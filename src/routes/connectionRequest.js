const express = require("express");
const connectionRequestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

// POST API to send a connection request, check if user is logged in and valid 
connectionRequestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    res.send(req.user.firstName + " " + req.user.lastName + " has sent a connection request");
  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
});

module.exports = {
  connectionRequestRouter
}