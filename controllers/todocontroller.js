const todoModel = require("../models/todo");

const createTodo = (req, res, next) => {
  const model = todoModel.create(req.body);
  res.status(201).json(model);
};

module.exports = { createTodo };
