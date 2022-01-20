const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { ORIGIN } = require("./config");

require("./middlewares/passport");

const router = require("./routes");
const { errorHandler } = require("./middlewares/error-handler");
const { isDev } = require("./config");

const app = express();

app.use(
  cors({
    exposedHeaders: ["Content-Disposition"],
    origin: ORIGIN,
    credentials: true,
  })
);
if (isDev()) {
  app.use(morgan("dev"));
}

app.use(methodOverride("_method")); //in order to make delete request
app.use(cookieParser());
app.use(express.json());

router(app);

app.use(errorHandler);

module.exports = { app };
