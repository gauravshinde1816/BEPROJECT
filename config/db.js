const mongoose = require("mongoose");
const config = require("config");
const db = config.get("MONGO_URI");
const db_local = config.get("MONGO_LOCAL")
const connectDB = async () => {
  try {
    await mongoose.connect(db_local, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
