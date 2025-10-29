const todoController = require("../../controllers/todocontroller.js");
const todoModel = require("../../models/todo.js");
const httpMocks = require("node-mocks-http");
const mockTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

todoModel.create = jest.fn();
todoModel.find = jest.fn();

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
