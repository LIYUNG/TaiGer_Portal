const mongoose = require('mongoose');

/**
 * StudentService handles queries for the Student model.
 */
const StudentService = {
  /**
   * Fetches a student by ID with optional population.
   *
   * @param {mongoose.Connection} db - The Mongoose connection instance.
   * @param {string} studentId - The student ID.
   * @param {string[]} [populateFields=[]] - Fields to populate.
   * @returns {Promise<mongoose.Document | null>} - The student document.
   */
  async getStudentById(db, studentId, populateConfig = [], selectFields = '') {
    const StudentModel = db.model('Student');

    let query = StudentModel.findById(studentId);

    // Apply population dynamically
    populateConfig.forEach((populateOption) => {
      query = query.populate(populateOption);
    });

    // Apply field selection
    if (selectFields) {
      query = query.select(selectFields);
    }

    return query.exec(); // Execute the query
  },
  async fetchStudents(req, filter) {
    return req.db
      .model('Student')
      .find(filter)
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select(
        '-notification +applications.portal_credentials.application_portal_a.account +applications.portal_credentials.application_portal_a.password +applications.portal_credentials.application_portal_b.account +applications.portal_credentials.application_portal_b.password'
      )
      .select('-notification')
      .lean();
  }
};

module.exports = StudentService;
