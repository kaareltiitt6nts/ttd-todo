const todoController = require("../../controllers/todocontroller.js");
const todoModel = require("../../models/todo.js");
const httpMocks = require("node-mocks-http");
const mockTodo = require("../mock-data/new-todo.json");

todoModel.create = jest.fn();

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("todo.create", () => {
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
