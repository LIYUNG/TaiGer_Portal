const rateLimit = require('express-rate-limit');

const DownloadTemplateRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const loginRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const updateCredentialRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const updatePersonalInformationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const TranscriptAnalyserRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const RemoveNotificationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const GeneralGETRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const GeneralPUTRequestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 60 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const GeneralDELETERequestRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const GeneralPOSTRequestRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const postMessagesRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const postMessagesImageRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 60 minutes
  max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const getMessagesRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const getMessageFileRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 40, // Limit each IP to 40 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const SetStatusMessagesThreadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 60 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const GetProgramListRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 * 1 minutes
  max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const GetProgramRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 * 1 minutes
  max: 120, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const UpdateProgramRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 * 1 minutes
  max: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const DeleteProgramRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 * 1 minutes
  max: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

module.exports = {
  DownloadTemplateRateLimiter,
  GeneralGETRequestRateLimiter,
  GeneralPUTRequestRateLimiter,
  GeneralPOSTRequestRateLimiter,
  GeneralDELETERequestRateLimiter,
  registerRateLimiter,
  loginRateLimiter,
  updatePersonalInformationRateLimiter,
  TranscriptAnalyserRateLimiter,
  RemoveNotificationRateLimiter,
  updateCredentialRateLimiter,
  postMessagesRateLimiter,
  postMessagesImageRateLimiter,
  getMessagesRateLimiter,
  getMessageFileRateLimiter,
  SetStatusMessagesThreadRateLimiter,
  GetProgramListRateLimiter,
  GetProgramRateLimiter,
  UpdateProgramRateLimiter,
  DeleteProgramRateLimiter
};
