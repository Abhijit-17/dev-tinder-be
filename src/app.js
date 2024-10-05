const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSugnUpData, validateLoginData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const JWT_SECRET = "RGV2VGluZGVyIEJ5IEFCIGluIE9DVCAyMDI0"; //DevTinder By AB in OCT 2024
const app = express();

//enabling express js to use JSON objects in requests
app.use(express.json());
//enabling express js to read cookies from the request
app.use(cookieParser());

// POST API for signup
app.post("/signup", async (req,res) => {
  try {
    const {firstName, lastName, emailId, password} = req.body;

    // validate the body
    validateSugnUpData(req);
  
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error is user creation: \n" + error.message);
  }

});

//POST API for login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // validate the body
    validateLoginData(req);
    
    // find if user exists with the emailId
    const user = await User.findOne({emailId: emailId});
    if(!user) {
      throw new Error("Provided email is not registered");
    }

    // comparing the password using scema helper function
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid) {

      // create JWT token using schema helper function
      const token = await user.getJWT();

      // set token in cookie and send in response
      res.cookie("token", token, {"expires": new Date(Date.now() + (2 * 3600000))});
      
      res.send("User Login Sucessful");
    } else {
      throw new Error("Incorrect Credentials");
    }

  } catch (error) {
    res.status(400).send("Error is user login: \n" + error.message);
  }
});

// get API to fetch the profile data of logged in user
app.get("/profile", userAuth, async (req,res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
});

// POST API to send a connection request, check if user is logged in and valid 
app.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    res.send(req.user.firstName + " has sent a connection request");
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



