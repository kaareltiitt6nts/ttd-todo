const todoModel = require("../models/todo");

const createTodo = async (req, res, next) => {
  const model = await todoModel.create(req.body);
  res.status(201).json(model);
};

module.exports = { createTodo };
