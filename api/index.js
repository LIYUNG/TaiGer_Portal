const { app } = require("./app");
const { connectToDatabase, disconnectFromDatabase } = require("./database");
const {
  PORT,
  HTTPS_KEY,
  HTTPS_CERT,
  HTTPS_PORT,
  MONGODB_URI,
} = require("./config");
var https = require("https");
var fs = require("fs");

process.on("SIGINT", () => {
  disconnectFromDatabase(() => {
    console.log("Database disconnected through app termination");
    process.exit(0);
  });
});

const launch = async () => {
  try {
    const conn = await connectToDatabase(MONGODB_URI, 1000);
    console.log(`Database connected: ${conn.host}`);
  } catch (err) {
    console.error("Failed to connect to database");
    process.exit(1);
  }
  // app.listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`);
  // });
  // TODO: launch both http and https server?
  https
    .createServer(
      {
        key: fs.readFileSync(HTTPS_KEY),
        cert: fs.readFileSync(HTTPS_CERT),
      },
      app
    )
    .listen(HTTPS_PORT, function () {
      console.log(
        "Example app listening on port " +
          HTTPS_PORT +
          " ! Go to https://localhost:" +
          HTTPS_PORT +
          "/"
      );
    });
};

launch();
