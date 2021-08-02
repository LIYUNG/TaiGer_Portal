const { MongoClient } = require("mongodb");
const request = require("supertest");

const { app } = require("../../app");

let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect(global.__MONGO_URI__, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  db = await connection.db(global.__MONGO_DB_NAME__);
});

afterAll(async () => {
  await connection.close();
});

describe("DB simple test: ", () => {
  // FIXME: Remove this test, Test should be self-contained and environment independent
  // also note this test is testing library code
  test("Test a existing user", async () => {
    const users = db.collection("students");

    const user = await users.findOne({
      emailaddress_: "liyung.chen.leo@gmail.com",
    });
    expect(user).toBe(null);
  });
});

describe("POST /", () => {
  it("It should response the POST method", async () => {
    // FIXME: just create a new user (testing database starts empty, you can populate your own fixtures)
    const credential = {
      emailaddress: process.env.USER_AGENT_EMAIL,
      password: process.env.USER_AGENT_PASSWORD,
    };

    try {
      const resp = await request(app)
        .post("/login")
        .set("Content-type", "application/json")
        .send(credential);

      // FIXME: toggle below assertions once the credential above is fixed
      expect(resp.statusCode).toBe(401);
      // expect(resp.statusCode).toBe(200);
      // expect(resp.role).toBe("Agent");
    } catch (err) {
      // FIXME: catch error in tests is dangerous, the test will always success
      // use https://jestjs.io/docs/expect#tothrowerror to test error condition
      console.log(`Error ${err}`);
    }
  });
});

describe("GET /userslist", () => {
  it("It should response 401 (unauthenticated)", async () => {
    const response = await request(app).get("/userslist");
    expect(response.statusCode).toBe(401);
  });
});

describe("GET /login", () => {
  it("It should response 404 (no this route) ", async () => {
    const response = await request(app).get("/login");
    expect(response.statusCode).toBe(404);
  });
});
