const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

// app.use("/admin", adminAuth);


app.get("/user/getAllData", userAuth, (req, res, next) => {
  try {
    throw new Error("something went wrong");
    res.send("user data sent");
  } catch (error) {
    res.status(500).send("Error handled in route handler");
  }
  
});

app.use("/", (err, req, res, next) => {
  res.status(500).send("Error Occured, connect with the admin");
});



// app.get("/admin/getAllData", (req, res, next) => {
//   console.log("getAllData called");
//   res.send("getAllData called");
// });

// app.delete("/admin/deleteAllData", (req, res, next) => {
//   console.log("deleteAllData called");
//   res.send("deleteAllData called");
// });

// app.get("/user/login", (req, res, next) => {
//   res.send("user logged in");
// });

// app.get("/user", [(req, res, next) => {
//   console.log("1st response");
//   next();
//   //res.send("1st response");
// }, (req, res, next) => {
//   console.log("2nd response");
//   //res.send("2nd response");
//   next();
// }], (req, res, next) => {
//   console.log("3rd response");
//   res.send("3rd response");
// });

// app.get("/user", (req,res,next) => {
//   console.log("1st response");
//   next();
// });

// app.get("/user", (req,res,next) => {
//   console.log("2nd response");
//   next();
// });

// app.get("/user", (req,res,next) => {
//   console.log("3rd response");
//   res.send("3rd response");
// });

// app.post("/user/:userId/:fName/:lName", (req, res) => {
//   console.log(req.params);
//   res.send("User saved in DB");
// });

// app.delete("/user", (req,res) => {
//   res.send("User deleted from DB");
// });

// app.use("/", (req, res) => {
//   res.send("Namaste Abhijit");
// });

// app.use("/ping",(req, res) => {
//   res.send("response from server");
// });

// app.use("/hello",(req, res) => {
//   res.send("Hello from server");
// });

// app.use("/test",(req, res) => {
//   res.send("mic testing 1..2..4..");
// });

app.listen(3000, ()=>{
  console.log("Server is running on port 3000...");
});



