const { google } = require('googleapis');
const uuid = require('uuid');
const ical = require('ical-generator');
const aws = require('aws-sdk');
const async = require('async');
const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role, Agent, Student, Editor } = require('../models/User');
const { Interview } = require('../models/Interview');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  GOOGLE_API_KEY,
  CLIENT_EMAIL,
  PRIVATE_KEY
} = require('../config');

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
);
const ses = new aws.SES({
  region: 'us-west-2',
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY
});
const scopes = ['https://www.googleapis.com/auth/calendar'];

const logger = require('../services/logger');
const calendar = google.calendar({
  version: 'v3',
  auth: GOOGLE_API_KEY
});
const getIcalObjectInstance = (
  starttime,
  endtime,
  summary,
  description,
  location,
  url,
  name,
  email
) => {
  const cal = ical({
    domain: 'mytestwebsite.com',
    name: 'My test calendar event'
  });
  cal.domain('mytestwebsite.com');
  cal.createEvent({
    start: starttime, // eg : moment()
    end: endtime, // eg : moment(1,'days')
    summary: summary, // 'Summary of your event'
    description: description, // 'More description'
    location: location, // 'Delhi'
    url: url, // 'event url'
    organizer: {
      // 'organizer details'
      name: name,
      email: email
    }
  });
  return cal;
};

const generateICSContent = () => {
  const event = {
    uid: '1234567890@example.com',
    dtstamp: new Date().toISOString().replace(/[:-]/g, ''),
    organizer: 'taiger.leoc@gmail.com',
    attendees: ['recipient@example.com'],
    start: new Date('2023-06-26T09:00:00Z').toISOString().replace(/[:-]/g, ''),
    end: new Date('2023-06-26T10:00:00Z').toISOString().replace(/[:-]/g, ''),
    summary: 'Invitation Example',
    description: 'This is an example invitation.',
    location: 'Meeting Room 123'
  };

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Application//EN
BEGIN:VEVENT
UID:${event.uid}
DTSTAMP:${event.dtstamp}
ORGANIZER;CN=Sender:mailto:${event.organizer}
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=Recipient:mailto:${event.attendees[0]}
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR
`;

  return icsContent;
};
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
        dateTime: getFormattedDate(2023, 5, 25, 20, 0, 0),
        timeZone: 'Europe/Berlin'
      },
      end: {
        dateTime: getFormattedDate(2023, 5, 25, 21, 0, 0),
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

  res.send({ msg: 'You have successfully setup meeting in' });
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
        dateTime: getFormattedDate(2023, 5, 25, 20, 0, 0),
        timeZone: 'Europe/Berlin'
      },
      end: {
        dateTime: getFormattedDate(2023, 5, 25, 21, 0, 0),
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

const awsSendEmail = asyncHandler(async (req, res) => {
  const params = {
    Source: 'sender@example.com',
    Destination: {
      ToAddresses: [
        'deutschlernenmitbutterbrezel@gmail.com',
        'steve50620@hotmail.com',
        'taiger.leoc@gmail.com'
      ]
    },
    Message: {
      Subject: {
        Data: 'Meeting Invitation'
      },
      Body: {
        Text: {
          Data: `Some event that is very very important
      https://meet.jit.si/TaiGer-Interview-Training-${uuid.v4()}
      `
        }
        // You can also include HTML content if desired
        // Html: {
        //   Data: '<html><body><h1>Meeting Invitation</h1><p>Please see the attached meeting invitation.</p></body></html>',
        // },
      }
      // Attach the meeting invitation as an attachment
    }
    // Tags: [
    //   {
    //     Filename: 'invitation.ics',
    //     Content: generateICSContent(),
    //     ContentType: 'text/calendar'
    //   }
    // ]
  };
  ses.sendEmail(params, (err, data) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', data);
      res.send({ msg: 'Done' });
    }
  });

  // The client is now authenticated and can be used to make API requests
});

module.exports = {
  googleCalendarAPI,
  googleRedirectAPI,
  googleScheduleEvent,
  awsSendEmail
};
