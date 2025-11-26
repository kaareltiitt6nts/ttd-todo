const todoModel = require("../models/todo");

const createTodo = async (req, res, next) => {
  try {
    const model = await todoModel.create(req.body);
    res.status(201).json(model);
  } catch (error) {
    next(error);
  }
};

const getTodos = async (req, res, next) => {
  try {
    const model = await todoModel.find({});
    res.status(200).json(model);
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const model = await todoModel.findById(req.params.id);

    if (model) {
      res.status(200).json(model);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createTodo, getTodos, getTodoById };
