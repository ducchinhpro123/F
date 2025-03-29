var mongoose = require("mongoose");
var dotenv = require("dotenv");

dotenv.config();

function connect_mongodb() {

  let mongooseURI = process.env.MONGODB_API;

  if (!mongooseURI) {
    console.err(
      "MONGODB_API not found, consider create a .env file and export your MONGODB_API",
    );
    return -1;
  }

  mongoose
    .connect(mongooseURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Cannot connect to the mongodb"));
}

module.exports = connect_mongodb;
