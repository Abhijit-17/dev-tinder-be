const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: "Invalid {VALUE} for status"
    }
  }
},{
  timestamps: true, optimisticConcurrency: true
});

const ConnectionRequest = mongoose.Model("ConnectionRequest", connectionRequestSchema);

module.exports = {
  ConnectionRequest
}