const express = require("express");

const app = express();

app.get("/user", [(req, res, next) => {
  console.log("1st response");
  next();
  //res.send("1st response");
}, (req, res, next) => {
  console.log("2nd response");
  //res.send("2nd response");
  next();
}], (req, res, next) => {
  console.log("3rd response");
  res.send("3rd response");
});

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



