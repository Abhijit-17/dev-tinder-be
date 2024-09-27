const adminAuth = (req, res, next) => {
  if (req.headers.token === "xyz") {
    next();
  } else {
    res.status(401).send("Auth failed");
  }
}

const userAuth = (req, res, next) => {
  if (req.headers.token === "xyz") {
    next();
  } else {
    res.status(401).send("Auth failed");
  }
}

module.exports = {
  adminAuth,
  userAuth
}