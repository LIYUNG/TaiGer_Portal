const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const mongooseOpts = {
    // userNewUrlParser: true,
    serverSelectionTimeoutMS: 5000
  };
  await mongoose.connect(uri, mongooseOpts);
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropCollection();
  await mongoose.connection.close();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
