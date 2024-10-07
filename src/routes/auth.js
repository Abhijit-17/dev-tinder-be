const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { validateSugnUpData, validateLoginData } = require("../utils/validation")

// POST API for signup
authRouter.post("/signup", async (req,res) => {
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
authRouter.post("/login", async (req, res) => {
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

//GET API for logout
authRouter.get("/logout", (req, res) => {
  try {
    res
      .cookie("token", null, {expires: new Date(Date.now() - 3600000)}) // set cookie date to "now minus 1 hour"
      .send("Logout Successful !!");
  } catch (error) {
    res.status(400).send("ERROR: " + "\n" + error.message);
  }
});

// exporting the router
module.exports = {
  authRouter
}