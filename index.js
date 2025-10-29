const express = require("express");
const todoRouter = require("./routes/todo");
const mongodb = require("./db/mongodb");

mongodb.connect();

const app = express();
app.use(express.json());

app.use("/todos", todoRouter);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.get("/", (req, res) => {
  res.send("hi");
});

module.exports = app;
