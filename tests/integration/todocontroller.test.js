const request = require("supertest");
const app = require("../../index");
const mockTodo = require("../mock-data/new-todo.json");

const endpoint = "/todos/";

describe(endpoint, () => {
  test(`POST ${endpoint}`, async () => {
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

  test(`GET ${endpoint}`, async () => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
  });
});

describe(`PUT ${endpoint}:id`, () => {
  let createdTodo;

  beforeAll(async () => {
    const response = await request(app).post(endpoint).send(mockTodo);
    createdTodo = response.body;
  });

  test(`should update an existing todo`, async () => {
    const updatedData = {
      title: "Updated title",
      done: true,
    };

    const response = await request(app)
      .put(`${endpoint}${createdTodo._id}`)
      .send(updatedData);

    expect(response.statusCode).toBe(201);
    expect(response.body._id).toBe(createdTodo._id);
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.done).toBe(updatedData.done);
  });

  test(`should return 404 when updating non-existing id`, async () => {
    const invalidId = "65a123456789012345678901";

    const response = await request(app)
      .put(`${endpoint}${invalidId}`)
      .send({ title: "doesnt matter", done: false });

    expect(response.statusCode).toBe(404);
  });
});

describe(`DELETE ${endpoint}:id`, () => {
  let createdTodo;

  beforeAll(async () => {
    const response = await request(app).post(endpoint).send(mockTodo);
    createdTodo = response.body;
  });

  test(`should delete an existing todo`, async () => {
    const response = await request(app).delete(`${endpoint}${createdTodo._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      message: "Todo deleted successfully",
    });
  });

  test(`should return 404 when deleting non-existing id`, async () => {
    const invalidId = "65a123456789012345678901";

    const response = await request(app).delete(`${endpoint}${invalidId}`);

    expect(response.statusCode).toBe(404);
  });
});
