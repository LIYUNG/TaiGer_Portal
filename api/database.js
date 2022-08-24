const mongoose = require('mongoose');

const connectToDatabase = async (uri, timeoutMS = 5000) => {
  mongoose.connection.on('error', () => {
    console.error('Database connection error');
  });

  const { connection } = await mongoose.connect(uri, {
    // useNewUrlParser: true, // mongoose 6 not support this anymore (always default true)
    // useUnifiedTopology: true, // mongoose 6 not support this anymore (always default true)
    // useCreateIndex: true, // mongoose 6 not support this anymore (always default true)
    // useFindAndModify: false, // mongoose 6 not support this anymore (always default false)
    serverSelectionTimeoutMS: timeoutMS
  });

  return connection;
};

const disconnectFromDatabase = (callback = async () => void 0) =>
  mongoose.connection.close(callback);

module.exports = { connectToDatabase, disconnectFromDatabase };
