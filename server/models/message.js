const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    content: {
      type: String,
    },
    uuid: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }],
  },
  { timestamp: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
