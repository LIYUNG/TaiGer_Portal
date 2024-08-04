const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { TENANT_ID } = require('./constants');

let mongoServer;
module.exports.connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  // mongod = await MongoMemoryServer.create({
  //   instance: { dbName: TENANT_ID }
  // });
  const uri = mongoServer.getUri();
  // const mongooseOpts = {
  //   // userNewUrlParser: true,
  //   serverSelectionTimeoutMS: 5000
  // };
  await mongoose.connect(mongoServer.getUri(), { dbName: TENANT_ID });
  return uri; // Return the URI to be used in tests
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
