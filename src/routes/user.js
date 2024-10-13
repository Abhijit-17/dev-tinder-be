const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequests");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requestsReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl about age gender skills"
    );

    res.json({
      "message": "People who are interested in you",
      "is_success": true,
      "data": requestsReceived
    });

  } catch (error) {
    res.json({
      "message": error.message,
      "is_success": false
    });
  }
});

module.exports = {
  userRouter
}

