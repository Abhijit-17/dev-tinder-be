const jwt = require("jsonwebtoken");
const { User } = require("../models/user")
const JWT_SECRET = "RGV2VGluZGVyIEJ5IEFCIGluIE9DVCAyMDI0"; //DevTinder By AB in OCT 2024

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if(!token) throw new Error("Please login");
    
    const tokenData = await jwt.verify(token, JWT_SECRET);
    const { _id } = tokenData;
    if(!_id) throw new Error("Invalid Token");

    const user = await User.findById(_id);
    if(!user) throw new Error("Invalid Token");

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error : \n" + error.message);
  }
}

module.exports = {
  userAuth
}