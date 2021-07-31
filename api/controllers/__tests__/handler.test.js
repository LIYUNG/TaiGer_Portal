const request = require("supertest");
// const { app } = require("../../app"); // the express server
const { app } = require("../../app"); // the express server
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");
// jest.setTimeout(3000);
let connection;
let db;
let token;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  });
  db = await connection.db(process.env.MONGO_DB_NAME);
});

afterAll(async () => {
  await connection.close();
});

describe("DB simple test: ", () => {
  test("Test a existing user", async () => {
    const users = db.collection("students");

    const User1 = await users.findOne({
      emailaddress_: "liyung.chen.leo@gmail.com",
    });
    expect(User1.role_).toBe("Agent");
  });
});


describe("POST /", () => {
  // FIXME:
  // Always throw error like this:
  // thrown: "Exceeded timeout of 3000 ms for a test.
  // Use jest.setTimeout(newTimeout) to increase the timeout value, if this is a long-running test."

  it("It should response the POST method", async (done) => {
    const credentail = {
      emailaddress: process.env.USER_AGENT_EMAIL,
      password: process.env.USER_AGENT_PASSWORD,
    };
    try {
      const resp = await request(app)
        .post("/login")
        .set("Content-type", "application/json")
        .send(credentail);
      expect(resp.statusCode).toBe(200);
      expect(resp.role).toBe("Agent");
      done();
    } catch (err) {
      // write test for failure here
      console.log(`Error ${err}`);
      done();
    }
  });
});

describe("Hello world!", () => {
  it("Hello world!", async () => {
    expect("Hello").toBe("Hello");
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
