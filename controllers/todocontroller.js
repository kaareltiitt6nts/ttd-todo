const todoModel = require("../models/todo");

const createTodo = async (req, res, next) => {
  try {
    const model = await todoModel.create(req.body);
    res.status(201).json(model);
  } catch (error) {
    next(error);
  }
};

module.exports = { createTodo };
