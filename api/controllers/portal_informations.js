const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');
const path = require('path');

const { asyncHandler } = require('../middlewares/error-handler');
const Course = require('../models/Course');
const { Role, Student, User } = require('../models/User');
const logger = require('../services/logger');

const getPortalCredentials = asyncHandler(async (req, res) => {
  const {
    params: { studentId }
  } = req;

  const student = await Student.findById(studentId)
    .populate(
      'applications.programId',
      'school program_name application_portal_a application_portal_b application_portal_a_instructions application_portal_b_instructions'
    )
    .select(
      'firstname lastname agents editors applications.decided applications.portal_credentials.application_portal_a applications.portal_credentials.application_portal_b'
    )
    .lean();
  res.status(200).send({
    success: true,
    data: {
      applications: student.applications,
      student: {
        _id: student._id,
        firstname: student.firstname,
        lastname: student.lastname,
        agents: student.agents,
        editors: student.editors
      }
    }
  });
});

const createPortalCredentials = asyncHandler(async (req, res) => {
  const { studentId, programId } = req.params;
  const credentials = req.body;
  const student = await Student.findById(studentId);
  const application = student.applications.find(
    (appli) => appli.programId.toString() === programId
  );
  if (!application) {
    logger.error('createPortalCredentials: Application not found');
    throw new ErrorResponse(400, 'Application not found');
  }
  const portal_credentials = {
    application_portal_a: {
      account: credentials.account_portal_a,
      password: credentials.password_portal_a
    },
    application_portal_b: {
      account: credentials.account_portal_b,
      password: credentials.password_portal_b
    }
  };
  application.portal_credentials = portal_credentials;
  await student.save();
  return res.send({ success: true, data: student });
});

module.exports = {
  getPortalCredentials,
  createPortalCredentials
};
