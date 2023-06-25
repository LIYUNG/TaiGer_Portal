const { google } = require('googleapis');
const uuid = require('uuid');
const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { Interview } = require('../models/Interview');

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  GOOGLE_API_KEY
} = require('../config');

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

const calendar = google.calendar({
  version: 'v3',
  auth: GOOGLE_API_KEY
});
const logger = require('../services/logger');

const getFormattedDate = (y, m, d, h, mm, s) => {
  const date = new Date(y, m, d, h, mm, s);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const timezoneOffset = -date.getTimezoneOffset() / 60;
  const timezoneOffsetString = `${timezoneOffset >= 0 ? '+' : '-'}${String(
    Math.abs(timezoneOffset)
  ).padStart(2, '0')}:00`;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneOffsetString}`;
};
const googleCalendarAPI = asyncHandler(async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });

  res.redirect(url);
});

const googleRedirectAPI = asyncHandler(async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  res.send({ msg: 'You have successfully logged in' });
});

const googleScheduleEvent = asyncHandler(async (req, res) => {
  //   console.log(oauth2Client.credentials.access_token);
  await calendar.events.insert({
    calendarId: 'primary',
    auth: oauth2Client,
    // conferenceDataVersion: 1,
    sendNotifications: true,
    requestBody: {
      summary: 'This is a test event',
      description: `Some event that is very very important
      https://meet.jit.si/TaiGer-Interview-Training-${uuid.v4()}
      `,
      start: {
        dateTime: getFormattedDate(2023, 5, 25, 2, 0, 0),
        timeZone: 'Europe/Berlin'
      },
      end: {
        dateTime: getFormattedDate(2023, 5, 25, 3, 0, 0),
        timeZone: 'Europe/Berlin'
      },
      //   conferenceData: {
      //     createRequest: {
      //       requestId: uuid.v4()
      //     }
      //   },
      attendees: [
        {
          email: 'deutschlernenmitbutterbrezel@gmail.com'
        },
        {
          email: 'steve50620@hotmail.com'
        },
        {
          email: 'taiger.leoc@gmail.com'
        }
      ],
      sendUpdates: 'all'
    }
  });

  //   https://meet.jit.si/AdjacentDiamondsDistinguishJust
  //   console.log(resp.data.hangoutLink);
  //   console.log(getFormattedDate(2023, 5, 25, 7, 0, 0));
  //   console.log(getFormattedDate(2023, 5, 25, 8, 0, 0));
  res.send({ msg: 'Done' });
});

module.exports = {
  googleCalendarAPI,
  googleRedirectAPI,
  googleScheduleEvent
};
