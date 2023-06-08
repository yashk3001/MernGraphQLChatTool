const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const Jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Message = require("../../models/message");
const dotenv = require("dotenv");
dotenv.config();
const moment = require("moment");

const JWT_SECRET = process.env.JWT_KEY;
var utcMoment = moment.utc();

const userResolver = {
  Query: {
    getUsers: async (parent, _, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let users = await User.find(
          { _id: { $ne: user.userId } },
          "name profilePicUrl createdAt latestMessage"
        )
          .populate("latestMessage")
          .then((users) => {
            return users;
          });

        return users;
      } catch (error) {
        console.log("error get users:::", error);
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let {
        username,
        email,
        password,
        name,
        DOB,
        mobileNumber,
        gender,
        profilePicUrl,
      } = args;
      let errors = {};

      try {
        const checkEmail = await User.findOne({ email: email });

        const checkMobileNumber = await User.findOne({
          mobileNumber: mobileNumber,
        });

        if (checkEmail) {
          throw new UserInputError(
            "this email has already been taken. Please try different"
          );
        }

        if (checkMobileNumber) {
          throw new UserInputError(
            "this mobile number has already been taken. Please try different"
          );
        }

        password = await bcrypt.hash(password, 6);

        const user = new User({
          // username: username,
          email: email,
          password: password,
          name: name,
          // DOB: new Date(DOB).toDateString(),
          gender: gender,
          // profilePicUrl: profilePicUrl,
          mobileNumber: mobileNumber,
          // latestMessage: "",
          createdAt: new Date(utcMoment.format()),
        });

        const result = await user.save();

        return result;
      } catch (error) {
        console.log("error in register:::", error);
      }
    },
    login: async (_, args) => {
      const { identifier, password } = args;
      let errors = {};

      try {
        const user = await User.findOne({
          $or: [{ mobileNumber: identifier }, { email: identifier }],
        });

        if (!user) {
          throw new Error("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          throw new Error("password is incorrect", { errors });
        }

        const userId = user._id;
        const userName = user.name;

        const token = Jwt.sign({ identifier, userId, userName }, JWT_SECRET, {
          expiresIn: 60 * 60,
        });

        return {
          ...user.toJSON(),
          token,
        };
      } catch (error) {
        console.log("error in login:::", error);
      }
    },
  },
};

module.exports = userResolver;
