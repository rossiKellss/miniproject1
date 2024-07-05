const { Schema, model, default: mongoose } = require("mongoose");

const postSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

module.exports = new model("Posts", postSchema);
