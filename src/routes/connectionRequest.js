const express = require("express");
const connectionRequestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateSendRequestData, validateReviewRequestData } = require("../utils/validation");
const { ConnectionRequest } = require("../models/connectionRequests");
const { User } = require("../models/user");

// POST API to send a connection request, check if user is logged in and valid 
connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    validateSendRequestData(req);
    const { toUserId, status } = req.params;
    const fromUserId = req.user._id;
    
    // check if "toUserId" exists in our user Collection
    const toUser = await User.findById(toUserId);
    if(!toUser)
      throw new Error("User(request receiver) not found");

    // check id user has already sent a request to this person or that person has already sent a request to user
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId,
          toUserId
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId
        }
      ] 
    });

    if(existingConnectionRequest) 
      throw new Error("Connection already exists");

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    await connectionRequest.save();

    // creating dynamic response message 
    let successMessage;
    if(status === "interested") {
      successMessage = `${req.user.firstName} ${req.user.lastName} has sent a connection request to ${toUser.firstName} ${toUser.lastName}`
    } else if (status === "ignored") {
      successMessage = `${req.user.firstName} ${req.user.lastName} has ignored ${toUser.firstName} ${toUser.lastName}`;
    }

    res.json({
      "message": successMessage,
      "is_success": true
    });

  } catch (error) {
    res.status(400).json({
      "message": error.message,
      "is_success": false
    });
  }
});

//POST API to review requests recieved by logged in user
connectionRequestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    // validate the request body
    validateReviewRequestData(req);
    // continue if req data is valid
    const loggedInUser = req.user;
    const { status, requestId}  = req.params;
    // find the request in the collection
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });

    if(!connectionRequest)
      throw new Error("Request not found !");

    // if request is found, update the status with the status recieved in request
    connectionRequest.status = status;
    await connectionRequest.save();

    res.json({
      "message": `Request ${status}`,
      "is_success": true
    });

  } catch (error) {
    res.status(400).json({
      "message": error.message,
      "is_success": false
    });
  }
});

module.exports = {
  connectionRequestRouter
}