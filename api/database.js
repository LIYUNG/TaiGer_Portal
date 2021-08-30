const mongoose = require('mongoose');

const connectToDatabase = async (uri, timeoutMS = 5000) => {
  mongoose.connection.on('error', () => {
    console.error('Database connection error')
  })

  const { connection } = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: timeoutMS,
  });

  return connection
}

const disconnectFromDatabase = (callback = async () => void 0) =>
  mongoose.connection.close(callback)

module.exports = { connectToDatabase, disconnectFromDatabase }
