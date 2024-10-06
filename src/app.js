const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const app = express();

//enabling express js to use JSON objects in requests
app.use(express.json());
//enabling express js to read cookies from the request
app.use(cookieParser());
// importing the auth router and using it
app.use("/", authRouter);
// importing the profile router and using it
app.use("/", profileRouter)

// POST API to send a connection request, check if user is logged in and valid 
app.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    res.send(req.user.firstName + " " + req.user.lastName + " has sent a connection request");
  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
});

//get API to search users by email id
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
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

// Delete user by id - userId === mongo db object id
app.delete("/user", async (req, res) =>{
  const userId = req.body.userId;
  try {
    const user  = await User.findByIdAndDelete(userId);
    console.log(user);
    res.send("User deleted successfuly !");
  } catch (error) {
    res.status(400).send("Something went wrong " + "\n" +error.message)
  }
});

// Update use by user id  -  userId === mongo db object id
//Patch method should be used
app.patch("/user/:userId", async (req,res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;
    const ALLOWED_UPDATES = [ "photoUrl", "about", "gender", "age", "skills" ];
    const isUpdateAllowed = Object.keys(data).every( key => ALLOWED_UPDATES.includes(key));
    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
    const user  = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
      returnDocument: "after"
    });
    if(!user) throw new Error("User Not Found !")
    res.send("User updated successfully !");
  } catch (error) {
    res.status(400).send("Something went wrong " + "\n" +error.message)
  }
});

app.patch("/user/:emailId", async (req, res) => {
  try {
    const userEmail = req.params?.emailId;
    const data  = req.body;
    const user = await User.findOneAndUpdate({emailId: userEmail}, data, {
      runValidators: true,
      returnDocument: "after"
    });
    res.send("User updated successfully by emailId!");
  } catch (error) {
    res.status(400).send("Something went wrong " + "\n" +error.message)
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



