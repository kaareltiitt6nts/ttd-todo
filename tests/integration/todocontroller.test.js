const request = require("supertest");
const app = require("../../index");
const mockTodo = require("../mock-data/new-todo.json");

const endpoint = "/todos/";

describe(endpoint, () => {
  it(`POST ${endpoint}`, async () => {
    const response = await request(app).post(endpoint).send(mockTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(mockTodo.title);
    expect(response.body.done).toBe(mockTodo.done);
  });
});
