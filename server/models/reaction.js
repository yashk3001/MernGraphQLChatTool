const mongoose = require("mongoose");

const reactionschema = mongoose.Schema(
  {
    content: {
      type: String,
      required: false,
    },
    uuid: {
      type: String,
      required: false,
    },
    // messageId: {
    //   type: String,
    //   required: false,
    // },
    userId: {
      type: String,
      required: false,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

const Reaction = mongoose.model("Reaction", reactionschema);

module.exports = Reaction;
