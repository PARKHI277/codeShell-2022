require("dotenv").config();
const express = require("express");
require("./config/dbconfig");
const UserRouter = require("./router/User");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static(__dirname));

//middlewares
app.get("/", (req, res) => {
  res.send("Hi,the API is working.");
});
app.use("/api/users", UserRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`connection succesful  at port ${port}`);
});
