const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

// get API to fetch the profile data of logged in user
profileRouter.get("/profile/view", userAuth, async (req,res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
});

// patch API to edit the profile for loggedIn user
profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
  try {
    validateEditProfileData(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
    await loggedInUser.save();
    res.send("Profile Updated successfuly !");
  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
});

module.exports = {
  profileRouter
}