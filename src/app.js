const express = require("express");

const app = express();

app.use("/ping",(req, res) => {
  res.send("response from server");
});

app.use("/hello",(req, res) => {
  res.send("Hello from server");
});

app.use("/test",(req, res) => {
  res.send("mic testing 1..2..4..");
});

app.listen(3000, ()=>{
  console.log("Server is running on port 3000...");
});

