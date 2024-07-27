const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const { ORIGIN } = require('./config');

require('./middlewares/passport');

const router = require('./routes');
const { errorHandler } = require('./middlewares/error-handler');
const { isDev, isProd } = require('./config');
const httpLogger = require('./services/httpLogger');
const { tenantMiddleware } = require('./middlewares/tenantMiddleware');

const app = express();
app.set('trust proxy', 1);
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
// app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(
  cors({
    exposedHeaders: ['Content-Disposition'],
    origin: ORIGIN,
    credentials: true
  })
);
app.use(tenantMiddleware);

app.use(methodOverride('_method')); // in order to make delete request
app.use(cookieParser());
app.use(express.json());

if (isProd()) {
  app.use(httpLogger);
}
if (isDev()) {
  app.use(morgan('dev'));
}

router(app);

app.use(errorHandler);

module.exports = { app };
