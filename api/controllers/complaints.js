const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { Role } = require('../constants');
const { isNotArchiv } = require('../constants');

const {
  newCustomerCenterTicketEmail,
  newCustomerCenterTicketSubmitConfirmationEmail,
  complaintResolvedRequesterReminderEmail
} = require('../services/email/complaints');
const { s3 } = require('../aws');
const { one_month_cache } = require('../cache/node-cache');
const { AWS_S3_BUCKET_NAME } = require('../config');

const getComplaints = asyncHandler(async (req, res) => {
  const { user } = req;

  const { type, program_id, status } = req.query;
  const query = {};
  if (type) {
    query.type = type;
  }
  if (program_id) {
    query.program_id = program_id;
  }
  if (status) {
    query.status = status;
  }
  if (user.role === Role.Student) {
    const tickets = await req.db
      .model('Complaint')
      .find()
      .select('-requester_id')
      .sort({ createdAt: -1 });
    res.send({ success: true, data: tickets });
  } else {
    const tickets = await req.db
      .model('Complaint')
      .find()
      .populate('requester_id', 'firstname lastname email')
      .sort({ createdAt: -1 });
    res.send({ success: true, data: tickets });
  }
});

const getComplaint = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticketId } = req.params;
  if (user.role === Role.Student) {
    const ticket = await req.db
      .model('Complaint')
      .findById(ticketId)
      .select('-requester_id');
    if (!ticket) {
      logger.error('getComplaint: Invalid ticket id');
      throw new ErrorResponse(404, 'Complaint not found');
    }
    res.send({ success: true, data: ticket });
  } else {
    const ticket = await req.db
      .model('Complaint')
      .findById(ticketId)
      .populate('messages.user_id', 'firstname lastname email ')
      .populate('requester_id', 'firstname lastname email ');
    if (!ticket) {
      logger.error('getComplaint: Invalid ticket id');
      throw new ErrorResponse(404, 'Complaint not found');
    }
    res.send({ success: true, data: ticket });
  }
});

const createComplaint = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticket } = req.body;
  ticket.requester_id = user._id.toString();
  // TODO: DO not create the same
  const new_ticket = await req.db.model('Complaint').create(ticket);

  res.status(201).send({ success: true, data: new_ticket });

  // TODO: inform manager
  const permissions = await req.db
    .model('Permission')
    .find({
      $or: [
        { canAssignEditors: true },
        { canAssignAgents: true },
        { canModifyAllBaseDocuments: true },
        { canAccessAllChat: true }
      ]
    })
    .populate('user_id', 'firstname lastname email archiv')
    .lean();
  if (permissions) {
    for (let x = 0; x < permissions.length; x += 1) {
      if (isNotArchiv(permissions[x].user_id)) {
        newCustomerCenterTicketEmail(
          {
            firstname: permissions[x].user_id.firstname,
            lastname: permissions[x].user_id.lastname,
            address: permissions[x].user_id.email
          },
          {
            requester: user,
            ticket_id: new_ticket._id?.toString(),
            ticket_title: new_ticket.title,
            ticket_description: new_ticket.description,
            createdAt: new Date()
          }
        );
      }
    }
  }

  if (isNotArchiv(user)) {
    newCustomerCenterTicketSubmitConfirmationEmail(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.email
      },
      {
        ticket_id: new_ticket._id?.toString(),
        ticket_title: new_ticket.title,
        ticket_description: new_ticket.description,
        createdAt: new Date()
      }
    );
  }
});

const getMessageFileInTicket = asyncHandler(async (req, res) => {
  const {
    params: { ticketId, studentId, fileKey }
  } = req;

  logger.info('Trying to download ticket file', fileKey);
  let directory = path.join(AWS_S3_BUCKET_NAME, ticketId, studentId);
  directory = directory.replace(/\\/g, '/');
  const options = {
    Key: fileKey,
    Bucket: directory
  };

  // messageid + extension
  const cache_key = `${studentId}${ticketId}${encodeURIComponent(fileKey)}`;
  const value = one_month_cache.get(cache_key); // file name
  if (value === undefined) {
    s3.getObject(options, (err, data) => {
      // Handle any error and exit
      if (!data || !data.Body) {
        logger.info('ticket file not found in S3');
        // You can handle this case as needed, e.g., send a 404 response
        return res.status(404).send(err);
      }

      // No error happened
      const success = one_month_cache.set(cache_key, data.Body);
      if (success) {
        logger.info('ticket file cache set successfully');
      }

      res.attachment(fileKey);
      return res.end(data.Body);
    });
  } else {
    logger.info('ticket file cache hit');
    res.attachment(fileKey);
    return res.end(value);
  }
});

// (O) notification email works
const postMessageInTicket = asyncHandler(async (req, res) => {
  const {
    user,
    params: { ticketId }
  } = req;
  const { message } = req.body;
  console.log(message);
  const ticket = await req.db
    .model('Complaint')
    .findById(ticketId)
    .populate('requester_id');
  if (!ticket) {
    logger.info('postMessageInTicket: Invalid message thread id');
    throw new ErrorResponse(404, 'Thread Id not found');
  }

  if (ticket?.isFinalVersion) {
    logger.info('postMessageInTicket: thread is closed! Please refresh!');
    throw new ErrorResponse(403, ' thread is closed! Please refresh!');
  }
  try {
    JSON.parse(message);
  } catch (e) {
    logger.error(`Thread message collapse ${message}`);
    throw new ErrorResponse(400, 'message collapse');
  }
  // Check student can only access their own thread!!!!
  if (user.role === Role.Student) {
    if (ticket.student_id._id.toString() !== user._id.toString()) {
      logger.error('getMessages: Unauthorized request!');
      throw new ErrorResponse(403, 'Unauthorized request');
    }
  }
  let newfile = [];
  if (req.files) {
    for (let i = 0; i < req.files.length; i += 1) {
      newfile.push({
        name: req.files[i].key,
        path: path.join(req.files[i].metadata.path, req.files[i].key)
      });
      // Check for duplicate file extensions
      const fileExtensions = req.files.map(
        (file) => file.mimetype.split('/')[1]
      );
      const uniqueFileExtensions = new Set(fileExtensions);
      if (fileExtensions.length !== uniqueFileExtensions.size) {
        logger.error('Error: Duplicate file extensions found!');
        throw new ErrorResponse(
          423,
          'Error: Duplicate file extensions found. Due to the system automatical naming mechanism, the files with same extension (said .pdf) will be overwritten. You can not upload 2 same files extension (2 .pdf or 2 .docx) at the same message. But 1 .pdf and 1 .docx are allowed.'
        );
      }
    }
  }

  const new_message = {
    user_id: user._id,
    message,
    createdAt: new Date(),
    file: newfile
  };
  // TODO: prevent abuse! if ticket.messages.length > 30, too much message in a thread!
  ticket.messages.push(new_message);
  ticket.updatedAt = new Date();
  await ticket.save();
  const ticket2 = await req.db
    .model('Complaint')
    .findById(ticketId)
    .populate('requester_id messages.user_id');

  res.status(200).send({ success: true, data: ticket2 });

  const student = await req.db
    .model('Student')
    .findById(ticket.requester_id)
    .populate('editors agents', 'firstname lastname email archiv');

  if (user.role === Role.Student) {
    // Inform Agent
    if (isNotArchiv(student)) {
      for (let i = 0; i < student.agents.length; i += 1) {
        // Inform Agent
        if (isNotArchiv(student.agents[i])) {
          const agent_recipent = {
            firstname: student.agents[i].firstname,
            lastname: student.agents[i].lastname,
            address: student.agents[i].email
          };
          const agent_payload = {
            writer_firstname: user.firstname,
            writer_lastname: user.lastname,
            student_firstname: student.firstname,
            student_lastname: student.lastname,
            uploaded_documentname: ticket.file_type,
            thread_id: ticket._id.toString(),
            uploaded_updatedAt: new Date()
          };
          // sendNewGeneraldocMessageInThreadEmail(
          //   agent_recipent,
          //   agent_payload
          // );
        }
      }
    }
  }

  // Inform student
  if (isNotArchiv(ticket.student_id)) {
    const student_recipient = {
      firstname: document_thread.requester_id.firstname,
      lastname: document_thread.requester_id.lastname,
      address: document_thread.requester_id.email
    };
    const student_payload = {
      writer_firstname: user.firstname,
      writer_lastname: user.lastname,
      student_firstname: student.firstname,
      student_lastname: student.lastname,
      uploaded_documentname: document_thread.file_type,
      thread_id: document_thread._id.toString(),
      uploaded_updatedAt: new Date()
    };
    // TODO: email
    // sendNewApplicationMessageInThreadEmail(
    //   student_recipient,
    //   student_payload
    // );
  }
});

const updateComplaint = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticketId } = req.params;
  const fields = req.body;

  fields.updatedAt = new Date();
  // TODO: update resolver_id
  const updatedComplaint = await req.db
    .model('Complaint')
    .findByIdAndUpdate(ticketId, fields, {
      new: true
    })
    .populate('requester_id', 'firstname lastname email archiv');

  res.status(200).send({ success: true, data: updatedComplaint });

  // TODO: to avoid resolved many times
  if (fields?.status === 'resolved') {
    if (isNotArchiv(updatedComplaint.requester_id)) {
      complaintResolvedRequesterReminderEmail(
        {
          firstname: updatedComplaint.requester_id.firstname,
          lastname: updatedComplaint.requester_id.lastname,
          address: updatedComplaint.requester_id.email
        },
        {
          program: updatedComplaint.program_id,
          student: updatedComplaint.requester_id,
          taigerUser: user
        }
      );
    }
  }
});

const deleteAMessageInComplaint = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticketId, messageId } = req.params;

  const ticket = await req.db.model('Complaint').findById(ticketId);
  if (!ticket) {
    logger.error('deleteAMessageInComplaint : Invalid message thread id');
    throw new ErrorResponse(404, 'Thread not found');
  }
  if (ticket.status === 'closed') {
    logger.error('deleteAMessageInComplaint : ticket is closed.');
    throw new ErrorResponse(423, 'Ticket is closed.');
  }
  const msg = ticket.messages.find(
    (message) => message._id.toString() === messageId
  );

  if (!msg) {
    logger.error('deleteAMessageInComplaint : Invalid message id');
    throw new ErrorResponse(404, 'Message not found');
  }
  // Prevent multitenant
  if (msg.user_id.toString() !== user._id.toString()) {
    logger.error(
      'deleteAMessageInComplaint : You can only delete your own message.'
    );
    throw new ErrorResponse(409, 'You can only delete your own message.');
  }

  // Don't need so delete in S3 , will delete by garbage collector
  await req.db.model('Complaint').findByIdAndUpdate(ticketId, {
    $pull: {
      messages: { _id: messageId }
    }
  });

  res.status(200).send({ success: true });
});

const deleteComplaint = asyncHandler(async (req, res) => {
  await req.db.model('Complaint').findByIdAndDelete(req.params.ticketId);
  res.status(200).send({ success: true });
});

module.exports = {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  getMessageFileInTicket,
  postMessageInTicket,
  deleteAMessageInComplaint,
  deleteComplaint
};
