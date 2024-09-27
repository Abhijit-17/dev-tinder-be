const mongoose  = require("mongoose");

const connectDB = async() => {
  await mongoose.connect(
    "mongodb+srv://abhijit1712:dKPz1INLlEHNeWUJ@asb1712.rexk7.mongodb.net/devTinder"
  );
}

module.exports = {
  connectDB
}

