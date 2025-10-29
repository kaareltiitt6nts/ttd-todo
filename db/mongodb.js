const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect("mongodb://user:password@localhost:27017/tests");
  } catch (error) {
    console.error("Error connecting to mongodb");
    console.error(error);
  }
};

module.exports = { connect };
