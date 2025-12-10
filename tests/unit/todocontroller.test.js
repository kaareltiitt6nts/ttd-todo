const todoController = require("../../controllers/todocontroller.js");
const todoModel = require("../../models/todo.js");
const httpMocks = require("node-mocks-http");
const mockTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

todoModel.create = jest.fn();
todoModel.find = jest.fn();
todoModel.findById = jest.fn();
todoModel.findByIdAndUpdate = jest.fn();
todoModel.findByIdAndDelete = jest.fn();

const todoId = "6901ce2b452f9008dbce5f47";

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("todo/create", () => {
  beforeEach(() => {
    req.body = mockTodo;
  });

  it("should have a create todo function", () => {
    expect(typeof todoController.createTodo).toBe("function");
  });

  it("should call todo create", async () => {
    await todoController.createTodo(req, res, next);
    expect(todoModel.create).toHaveBeenCalledWith(mockTodo);
  });

  it("should return 201", async () => {
    await todoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should match json body in response", async () => {
    await todoModel.create.mockReturnValue(mockTodo);
    await todoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(mockTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    todoModel.create.mockReturnValue(rejectedPromise);
    await todoController.createTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("todo/get", () => {
  it("should have a get todos function", () => {
    expect(typeof todoController.createTodo).toBe("function");
  });

  it("should call todo get", async () => {
    await todoController.getTodos(req, res, next);
    expect(todoModel.find).toHaveBeenCalledWith({});
  });

  it("should get all todos", async () => {
    todoModel.find.mockReturnValue(allTodos);
    await todoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "The promise rejected with the reason" };
    const rejectedPromise = Promise.reject(errorMessage);
    todoModel.find.mockReturnValue(rejectedPromise);
    await todoController.getTodos(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("todo/get/id", () => {
  it("should have a get todo by id function", () => {
    expect(typeof todoController.getTodoById).toBe("function");
  });

  it("should call todo get by id", async () => {
    req.params.id = todoId;
    await todoController.getTodoById(req, res, next);
    expect(todoModel.findById).toHaveBeenCalledWith(todoId);
  });

  it("should get todo by id", async () => {
    todoModel.findById.mockResolvedValue(mockTodo);
    await todoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(mockTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "The promise rejected with the reason" };
    const rejectedPromise = Promise.reject(errorMessage);
    todoModel.find.mockReturnValue(rejectedPromise);
    await todoController.getTodos(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  it("should handle 404", async () => {
    todoModel.findById.mockResolvedValue(null);
    await todoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("todo/update/id", () => {
  it("should have an update todo function", () => {
    expect(typeof todoController.updateTodo).toBe("function");
  });

  it("should call findByIdAndUpdate with correct params", async () => {
    req.params.id = todoId;
    req.body = { title: "Updated title", done: true };
    todoModel.findByIdAndUpdate.mockResolvedValue(mockTodo);
    await todoController.updateTodo(req, res, next);
    expect(todoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, req.body, {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    });
  });

  it("should return 201 when update is successful", async () => {
    todoModel.findByIdAndUpdate.mockResolvedValue(mockTodo);
    await todoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(mockTodo);
  });

  it("should return 404 if todo not found", async () => {
    todoModel.findByIdAndUpdate.mockResolvedValue(null);
    await todoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Update failed" };
    todoModel.findByIdAndUpdate.mockRejectedValue(errorMessage);
    await todoController.updateTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("todo/delete/id", () => {
  it("should have a delete todo function", () => {
    expect(typeof todoController.deleteTodo).toBe("function");
  });

  it("should call findByIdAndDelete with correct params", async () => {
    req.params.id = todoId;
    await todoController.deleteTodo(req, res, next);
    expect(todoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
  });

  it("should return 200 when delete is successful", async () => {
    todoModel.findByIdAndDelete.mockResolvedValue(mockTodo);
    await todoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      message: "Todo deleted successfully",
    });
  });

  it("should return 404 if todo not found", async () => {
    todoModel.findByIdAndDelete.mockResolvedValue(null);
    await todoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Delete failed" };
    todoModel.findByIdAndDelete.mockRejectedValue(errorMessage);
    await todoController.deleteTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
