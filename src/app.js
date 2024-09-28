const express = require("express");

const { connectDB } = require("./config/database");

const { User } = require("./models/user");

const app = express();

//enabling express js to use JSON objects in requests
app.use(express.json());

// POST API for signup
app.post("/signup", async (req,res) => {
  const userObj = req.body;

  console.log(userObj);

  const user = new User(userObj);

  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error is user creation: " + error.message);
  }

});

//get API to search users by email id
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users  = await User.find({emailId : userEmail});
    if(users.length === 0) {
      res.status(404).send("User not found");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong " + "\n" +error.message)
  }

});

// API to get all the users - feed API
app.get("/feed", async (req,res) => {
  try {
    const users  = await User.find({});
    if(users.length === 0) {
      res.status(404).send("No Users found");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong " + "\n" +error.message)
  }
})



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



