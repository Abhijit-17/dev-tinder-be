const express = require("express");
const connectionRequestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateSendRequestData } = require("../utils/validation");
const { ConnectionRequest } = require("../models/connectionRequests");

// POST API to send a connection request, check if user is logged in and valid 
connectionRequestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    validateSendRequestData(req);
    const { toUserId, status } = req.params;
    const fromUserId = req.user._id;

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    await connectionRequest.save();
    res.json({
      "message": "Connection request sent successfully !",
      "is_success": true
    });

  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
});

module.exports = {
  connectionRequestRouter
}