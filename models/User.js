const { model, Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
  },
  email: { type: String },
  age: { type: Number },
  password: { type: String },
  profileUrl:{
    type:String,
    default:"user.png"
  },
  posts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Posts",
    },
  ],
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = await bcrypt.hash(user.password, 8);
  next();
});

module.exports = new model("User", userSchema);
