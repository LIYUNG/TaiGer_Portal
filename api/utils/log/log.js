const logAccess = async (req, res, next) => {
  try {
    const { user } = req;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const u = await req.db.model('Userlog').findOne({
      user_id: user._id,
      apiPath: req.originalUrl,
      operation: req.originalMethod,
      date: formattedDate
    });
    if (u) {
      // If a document exists, increment the access count
      await req.db.model('Userlog').findOneAndUpdate(
        {
          user_id: user._id,
          apiPath: req.originalUrl,
          operation: req.originalMethod,
          date: formattedDate
        },
        { $inc: { apiCallCount: 1 } }
      );
    } else {
      // If no document exists, create a new one with an access count of 1
      await req.db.model('Userlog').findOneAndUpdate(
        {
          user_id: user._id,
          apiPath: req.originalUrl,
          operation: req.originalMethod,
          date: formattedDate
        },
        { $inc: { apiCallCount: 1 } },
        { upsert: true }
      );
    }
  } catch (e) {
    // client.close();
  }
};

module.exports = {
  logAccess
};
