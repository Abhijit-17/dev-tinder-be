const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = "RGV2VGluZGVyIEJ5IEFCIGluIE9DVCAyMDI0"; //DevTinder By AB in OCT 2024


const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Email is not valid " + value);
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if(!validator.isStrongPassword(value)) throw new Error("\n Password should be a combination of these" + "\n" +"[{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}]");
    }
  },
  age: {
    type: Number,
    min: 18
  },
  gender: {
    type: String,
    lowercase: true,
    enum: {
      values: ["male", "female", "others"],
      message: "Gender Data is not valid"
    }
    // validate(value) {
    //   if(!["male", "female", "others"].includes(value)){
    //     throw new Error("Gender Data is not valid");
    //   }
    // }
  },
  photoUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/106/106137.png",
    validate(value) {
      if(!validator.isURL(value)) throw new Error("This is not a photo URL " + value);
    }
  },
  about: {
    type: String,
    default: "Let the world know who you are !"
  },
  skills: {
    type: [String],
    validate(value) {
      if(value.length > 10) throw new Error("Cannot add more than 10 skills");
    }
  }
}, { timestamps: true, optimisticConcurrency: true });

// schema helper method to create a jwt token
userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({_id: user._id}, JWT_SECRET, {expiresIn: "2h"});
  return token;
}

// schema helper method to validate password
userSchema.methods.validatePassword = async function(userInputPassword) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(userInputPassword, user.password);
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = {
  User
}