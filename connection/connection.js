const mongoose = require("mongoose");

const connectToDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Db connected sucessfully");
    })
    .catch((err) => console.log(err.message));
};

module.exports = connectToDB;
