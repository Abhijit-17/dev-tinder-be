const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequests");
const { User } = require("../models/user");

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

userRouter.get("/user/connections", userAuth, async(req, res) => {
  try {

    const loggedInUser = req.user;
    // const connectionRequestsFromUser = await ConnectionRequest.find({
    //   toUserId: loggedInUser._id, 
    //   status: "accepted"
    // }).populate(
    //   "fromUserId",
    //   "firstName lastName photoUrl about age gender skills"
    // );

    // const connectionRequestsToUser = await ConnectionRequest.find({
    //   fromUserId: loggedInUser._id,
    //   status: "accepted"
    // }).populate(
    //   "toUserId",
    //   "firstName lastName photoUrl about age gender skills"
    // );

    // const [connectionRequestsFromUser, connectionRequestsToUser] = await Promise.all([
    //   ConnectionRequest.find({
    //     toUserId: loggedInUser._id, 
    //     status: "accepted"
    //   }).populate(
    //     "fromUserId",
    //     "firstName lastName photoUrl about age gender skills"
    //   ),
    //   ConnectionRequest.find({
    //     fromUserId: loggedInUser._id,
    //     status: "accepted"
    //   }).populate(
    //     "toUserId",
    //     "firstName lastName photoUrl about age gender skills"
    //   )
    // ]);

    const allConnectionRequests = await ConnectionRequest.find({
      $or: [
        {toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"}
      ]
    }).populate("fromUserId", "firstName lastName photoUrl about age gender skills")
      .populate("toUserId", "firstName lastName photoUrl about age gender skills");

    const data = allConnectionRequests.map(connectionRequest => {
      if(loggedInUser._id.equals(connectionRequest.toUserId._id)) {
        return connectionRequest.fromUserId
      } else {
        return connectionRequest.toUserId
      }
    });

    res.json({
      "message": "People who are connected with you",
      "is_success": true,
      "data": data
    });

  } catch (error) {
    res.json({
      "message": error.message,
      "is_success": false
    });
  }
});

userRouter.get("/user/feed", userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;

    const allUserConnections = await ConnectionRequest.find({
      $or: [
        {fromUserId: loggedInUser._id},
        {toUserId: loggedInUser._id}
      ]
    }).select("fromUserId toUserId");

    const feedExclusionList = new Set();
    allUserConnections.forEach(connection => {
      feedExclusionList.add(connection.fromUserId.toString());
      feedExclusionList.add(connection.toUserId.toString());
    });

    const feedList = await User.find({
      _id: {
        $nin: Array.from(feedExclusionList)
      }
    }).select("firstName lastName age gender photoUrl about skills");

    res.json({
      "message": "Find new friends",
      "is_success": true,
      "data": feedList
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
      is_success: false
    });
  }
});

module.exports = {
  userRouter
}

