const validator = require("validator");

const validateSugnUpData = (req) => {
  const {firstName, lastName, emailId, password} = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Pass word is not Strong");
  }
}

const validateLoginData = (req) => {
  const {emailId, password} = req.body;
  if(!emailId || !password) {
    throw new Error("Email or Password missing");
  } else if(!validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  }
}

module.exports = {
  validateSugnUpData,
  validateLoginData
}