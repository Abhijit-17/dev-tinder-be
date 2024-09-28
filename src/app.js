const express = require("express");

const { connectDB } = require("./config/database");

const { User } = require("./models/user");

const app = express();

// POST API for signup
app.post("/signup", async (req,res) => {
  const userObj = {
    firstName : "Rohit",
    lastName : "Sharma",
    emailId : "rohit@sharma.com",
    password : "rohit@123"
  }

  const user = new User(userObj);

  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error is user creation: " + error.message);
  }

});

connectDB()
.then(() => {
  console.log("Connection to devTinder DB establish succcessfuly...")
  app.listen(3000, ()=>{
    console.log("Server is running on port 3000...");
  });
})
.catch((err) => {
  console.log("Database devTinder cannot be connected");
  console.log(err.message);
})



