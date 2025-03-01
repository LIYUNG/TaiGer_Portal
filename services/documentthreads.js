const DocumentThreadService = {
  async getThreadById(req, messagesThreadId) {
    return req.db
      .model('Documentthread')
      .findById(messagesThreadId)
      .populate(
        'student_id',
        'firstname lastname firstname_chinese lastname_chinese role agents editors application_preference'
      )
      .populate('messages.user_id', 'firstname lastname role')
      .populate('program_id')
      .populate('outsourced_user_id', 'firstname lastname role')
      .lean();
  },
  async getThreads(req, filter) {
    return req.db
      .model('Documentthread')
      .find(filter)
      .populate(
        'student_id',
        'firstname lastname firstname_chinese lastname_chinese role agents editors application_preference'
      )
      .populate('messages.user_id', 'firstname lastname role')
      .populate('program_id')
      .populate('outsourced_user_id', 'firstname lastname role')
      .lean();
  }
};

module.exports = DocumentThreadService;
