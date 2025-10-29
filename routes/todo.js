const express = require("express");
const todoController = require("../controllers/todocontroller");
const router = express.Router();

router.post("/", todoController.createTodo);

module.exports = router;
