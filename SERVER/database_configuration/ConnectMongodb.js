import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

function connect_mongodb() {

  let mongooseURI = process.env.MONGODB_API;

  if (!mongooseURI) {
    console.error("Some error...");

    return -1;
  }

  mongoose
    .connect(mongooseURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Cannot connect to the mongodb"));
}

export default connect_mongodb;
