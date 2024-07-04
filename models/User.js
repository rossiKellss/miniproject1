const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: "String",
  email: "String",
  age: "Number",
  password: "String",
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = await bcrypt.hash(user.password, 8);
  next();
});

module.exports = new model("User", userSchema);
