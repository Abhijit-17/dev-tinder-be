const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validateEditProfilePassword } = require("../utils/validation");

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

//patch API to edit password for logged in user
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validateEditProfilePassword(req);

    const loggedInUser = req.user;
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res
      .cookie("token", null, {expires: new Date(Date.now() - 3600000)}) // set cookie date to "now minus 1 hour" to logout user
      .json({
      "message": "Password changed successfully, you have been logged out, please login again using the new password",
      "is_success": true
      });

  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
});

module.exports = {
  profileRouter
}