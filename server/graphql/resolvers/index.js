const userResolver = require("./user.js");
const messageResolver = require("./message.js");
const User = require("../../models/user.js");
const Message = require("../../models/message.js");

const resolvers = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),

    message: async (parent) => await Message.findById(parent.messageId),

    user: async (parent) =>
      await User.findById(parent.userId, "name imageUrl createdAt"),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...userResolver.Query,
    ...messageResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...messageResolver.Mutation,
  },
  Subscription: {
    ...messageResolver.Subscription,
  },
};

module.exports = resolvers;
