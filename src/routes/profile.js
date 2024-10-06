const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

// get API to fetch the profile data of logged in user
profileRouter.get("/profile", userAuth, async (req,res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
});

module.exports = {
  profileRouter
}