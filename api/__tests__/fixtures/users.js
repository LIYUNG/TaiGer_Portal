const { ObjectId } = require("mongoose").Types;
const faker = require("faker");

const { connectToDatabase, disconnectFromDatabase } = require("../../database");
const Student = require("../../models/Students");

const generateUser = (role) => ({
  _id: new ObjectId(),
  firstname_: faker.name.firstName(),
  lastname_: faker.name.lastName(),
  emailaddress_: faker.unique(faker.internet.email).toLowerCase(),
  password_: faker.internet.password(10, false, /[0-9A-Z]/),
  role_: role,
});

module.exports = {
  generateUser,
};
