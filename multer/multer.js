const crypto = require("crypto");
const path = require("path");
const multer=require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    const dbName = crypto.randomBytes(10).toString("hex");

    cb(null, dbName + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
module.exports=upload;
