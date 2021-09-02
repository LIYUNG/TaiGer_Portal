const { ObjectId } = require("mongoose").Types;
const faker = require("faker");

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
