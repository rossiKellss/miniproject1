const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: "String",
  email: "String",
  age: "Number",
  password: "String",
});

module.exports = new model("User", userSchema);

userSchema.pre("save", function (next) {
  const user = this;
});
