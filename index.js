const express = require("express");
require("dotenv/config");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(PORT, (err) => {
  console.log(`Server started! http://localhost:${PORT}`);
});
