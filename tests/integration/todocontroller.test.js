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

  it(`should return error 500 on malformed data on POST ${endpoint}`, async () => {
    const response = await request(app)
      .post(endpoint)
      .send({ title: "missing done property" });

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "todo validation failed: done: Path `done` is required.",
    });
  });
});
