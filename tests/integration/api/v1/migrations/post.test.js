import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST /api/v1/migrations returns status 200", async () => {
  const result = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(result.status).toBe(201);

  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(200);
  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBeTruthy();
  expect(responseBody).toHaveLength(0);
});
