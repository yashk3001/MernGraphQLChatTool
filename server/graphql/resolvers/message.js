const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  withFilter,
} = require("apollo-server");
const User = require("../../models/user");
const Message = require("../../models/message");
const Reaction = require("../../models/reaction");
const moment = require("moment");
const crypto = require("crypto");

var utcMoment = moment.utc();

function generateRandomId() {
  const uuid = crypto.randomBytes(8).toString("hex");
  return uuid;
}

const messageResolver = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        const otherUser = await User.findOne({ name: from });

        if (!otherUser) throw new UserInputError("User not found");

        const usernames = [user.userName, otherUser.name];

        const messages = await Message.find({
          $and: [{ from: usernames }, { to: usernames }],
        }).sort({ createdAt: -1 });

        return messages;
      } catch (error) {
        console.log("error in getMessages::", error);
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user, pubsub }) => {
      try {
        const recipient = await User.findOne({ name: to });

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient.name === user.userName) {
          throw new UserInputError("You cant message yourself");
        }

        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }

        const newUUID = generateRandomId();

        const message = new Message({
          from: user.userName,
          to: to,
          content: content,
          uuid: newUUID,
          createdAt: new Date(utcMoment.format()),
        });

        const result = await message.save();

        await User.findByIdAndUpdate(
          {
            _id: user.userId,
          },
          { $set: { latestMessage: message._id } }
        );

        await User.findByIdAndUpdate(
          {
            _id: recipient._id,
          },
          {
            $set: { latestMessage: message._id },
          }
        );

        pubsub.publish("NEW_MESSAGE", { newMessage: message });

        return result;
      } catch (error) {
        console.log("error in sendMessage:::", error);
      }
    },
    reactToMessage: async (_, { uuid, content }, { user, pubsub }) => {
      const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

      console.log("react to msg");
      console.log("uuid::::", uuid);
      console.log("content::::", content);
      console.log("user::::", user);
      console.log("pubsub::::", pubsub);

      try {
        if (!reactions.includes(content)) {
          throw new UserInputError("Invalid reaction");
        }

        const name = user ? user.name : "";

        user = await User.findOne({ name: name });

        if (!user) throw new AuthenticationError("Unauthenticated");

        const message = await Message.findOne({ uuid: uuid });
        if (!message) throw new UserInputError("message not found");

        if (message.from !== user.name && message.to !== user.name) {
          throw new ForbiddenError("Unauthorized");
        }

        let reaction = await Reaction.findOne({
          messageId: message._id,
          userId: user._id,
        });

        if (reaction) {
          reaction.content = content;
          const result = await reaction.save();
          pubsub.publish("NEW_REACTION", { newReaction: result });

          return result;
        } else {
          reaction = new Reaction({
            messageId: message._id,
            userId: user._id,
            content: content,
            uuid: uuid,
            createdAt: new Date(utcMoment.format()),
          });

          const result2 = await reaction.save();

          pubsub.publish("NEW_REACTION", { newReaction: result2 });

          return result2;
        }
      } catch (error) {
        console.log("error in reactToMessage:::", error);
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          const newmsg = pubsub.asyncIterator("NEW_MESSAGE");
          return newmsg;
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.userName ||
            newMessage.to === user.userName
          ) {
            return true;
          }

          return false;
        }
      ),
    },
    newReaction: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          console.log("yes");

          return pubsub.asyncIterator("NEW_REACTION");
        },
        async ({ newReaction }, _, { user }) => {
          const message = await newReaction.getMessages();
          console.log("mesagge:::::", message);
          if (message.from === user.name || message.to === user.name) {
            return true;
          }

          return false;
        }
      ),
    },
  },
};

module.exports = messageResolver;
