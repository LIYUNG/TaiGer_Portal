// FIXME: remove global variable
global.__basedir = __dirname;
// global.jwtExpirySeconds = 6000;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

require("./middlewares/passport");

const router = require("./routes");
const { errorHandler } = require("./middlewares/error-handler");

const app = express();

app.use(cors({ exposedHeaders: ["Content-Disposition"] }));
app.use(morgan("dev"));

app.use(methodOverride("_method")); //in order to make delete request
app.use(cookieParser());
app.use(express.json());

router(app);

app.use(errorHandler);

module.exports = { app };
