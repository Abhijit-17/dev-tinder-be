const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    "firstName": "Abhijit",
    "lastName": "Bhadoria"
  });
});

app.post("/user", (req, res) => {
  res.send("User saved in DB");
});

app.delete("/user", (req,res) => {
  res.send("User deleted from DB");
});

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



