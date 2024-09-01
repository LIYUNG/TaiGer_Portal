// const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { Role, DocumentStatus, profile_name_list } = require('../constants');
const { asyncHandler } = require('../middlewares/error-handler');
const { updateCredentialsEmail } = require('../services/email');
const logger = require('../services/logger');

// (O) email : self notification
const updateCredentials = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { credentials }
  } = req;
  const userExisted = await req.db.model('User').findById(user._id.toString());
  if (!userExisted) {
    logger.error('updateCredentials: Invalid user');
    throw new ErrorResponse(400, 'Invalid user');
  }

  userExisted.password = credentials.new_password;
  await userExisted.save();
  res.status(200).send({
    success: true
  });
  await updateCredentialsEmail(
    {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.email
    },
    {}
  );
  next();
});

const updateOfficehours = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { officehours, timezone }
  } = req;
  await req.db
    .model('Agent')
    .findByIdAndUpdate(user._id.toString(), { officehours, timezone }, {});

  res.status(200).send({
    success: true
  });
  next();
});

// (O)  email : self notification
const updateAcademicBackground = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { university }
  } = req;
  const { studentId } = req.params;
  // const { _id } = student;
  let student_id;
  if (user.role === Role.Student || user.role === Role.Guest) {
    // eslint-disable-next-line no-underscore-dangle
    student_id = user._id.toString();
  } else {
    student_id = studentId;
  }
  try {
    university.updatedAt = new Date();
    const updatedStudent = await req.db.model('User').findByIdAndUpdate(
      student_id,
      {
        'academic_background.university': university
        // $addToSet: {
        //   academic_background: { university: university },
        // },
      },
      { upsert: true, new: true }
    );

    // TODO: update base documents needed or not:
    const documentsToEnsure = [
      'Bachelor_Certificate',
      'Bachelor_Transcript',
      'Course_Description',
      'Employment_Certificate',
      'ECTS_Conversion'
    ];
    const ensureDocumentStatus = (
      studentProfile,
      docName,
      profileNameList,
      status,
      DocStatus
    ) => {
      let document = studentProfile.find(
        (doc) => doc.name === profileNameList[docName]
      );

      if (!document) {
        document = studentProfile.create({ name: profileNameList[docName] });
        document.status = status;
        document.required = true;
        document.updatedAt = new Date();
        document.path = '';
        studentProfile.push(document);
      } else if (
        document.status ===
        (status === DocStatus.NotNeeded
          ? DocStatus.Missing
          : DocStatus.NotNeeded)
      ) {
        document.status = status;
      }
    };
    let desiredStatus;

    // no need university doc
    if (
      updatedStudent.academic_background.university.high_school_isGraduated ===
        'pending' ||
      updatedStudent.academic_background.university.isGraduated === 'No'
    ) {
      desiredStatus = DocumentStatus.NotNeeded;
    } else {
      desiredStatus = DocumentStatus.Missing;
    }

    documentsToEnsure.forEach((docName) => {
      ensureDocumentStatus(
        updatedStudent.profile,
        docName,
        profile_name_list,
        desiredStatus,
        DocumentStatus
      );
    });

    let desiredSecondDegreeStatus;

    // no need university doc
    if (
      updatedStudent.academic_background.university.isGraduated === 'pending' ||
      updatedStudent.academic_background.university.isGraduated === 'No' ||
      updatedStudent.academic_background.university.isSecondGraduated ===
        'No' ||
      updatedStudent.academic_background.university.isSecondGraduated === '-'
    ) {
      desiredSecondDegreeStatus = DocumentStatus.NotNeeded;
    } else {
      desiredSecondDegreeStatus = DocumentStatus.Missing;
    }
    const secondDegreeDocumentsToEnsure = [
      'Second_Degree_Certificate',
      'Second_Degree_Transcript'
    ];
    secondDegreeDocumentsToEnsure.forEach((docName) => {
      ensureDocumentStatus(
        updatedStudent.profile,
        docName,
        profile_name_list,
        desiredSecondDegreeStatus,
        DocumentStatus
      );
    });

    const exchangeStatus =
      updatedStudent.academic_background.university.Has_Exchange_Experience ===
      'Yes'
        ? DocumentStatus.Missing
        : DocumentStatus.NotNeeded;

    ensureDocumentStatus(
      updatedStudent.profile,
      'Exchange_Student_Certificate',
      profile_name_list,
      exchangeStatus,
      DocumentStatus
    );

    const internshipStatus =
      updatedStudent.academic_background.university
        .Has_Internship_Experience === 'Yes'
        ? DocumentStatus.Missing
        : DocumentStatus.NotNeeded;
    ensureDocumentStatus(
      updatedStudent.profile,
      'Internship',
      profile_name_list,
      internshipStatus,
      DocumentStatus
    );

    const workExperienceStatus =
      updatedStudent.academic_background.university.Has_Working_Experience ===
      'Yes'
        ? DocumentStatus.Missing
        : DocumentStatus.NotNeeded;
    ensureDocumentStatus(
      updatedStudent.profile,
      'Employment_Certificate',
      profile_name_list,
      workExperienceStatus,
      DocumentStatus
    );

    await updatedStudent.save();

    // TODO: minor: profile field not used for student.
    res.status(200).send({
      success: true,
      data: university,
      profile: updatedStudent.profile
    });
    next();
  } catch (err) {
    logger.error(err);
    throw new ErrorResponse(400, JSON.stringify(err));
  }
});

// (O) email : self notification
const updateLanguageSkill = asyncHandler(async (req, res, next) => {
  const {
    user,
    body: { language }
  } = req;
  const { studentId } = req.params;
  let student_id;

  if (user.role === Role.Student || user.role === Role.Guest) {
    student_id = user._id.toString();
  } else {
    student_id = studentId;
  }

  language.updatedAt = new Date();

  const updatedStudent = await req.db.model('User').findByIdAndUpdate(
    student_id,
    {
      'academic_background.language': language
    },
    { upsert: true, new: true }
  );

  const profileUpdates = [
    {
      fieldName: 'german_isPassed',
      docName: profile_name_list.German_Certificate
    },
    {
      fieldName: 'english_isPassed',
      docName: profile_name_list.Englisch_Certificate
    },
    {
      fieldName: 'gre_isPassed',
      docName: profile_name_list.GRE
    },
    {
      fieldName: 'gmat_isPassed',
      docName: profile_name_list.GMAT
    }
  ];

  // Helper function to update document status
  const updateDocumentStatus = (isPassed, docName) => {
    let certificateDoc = updatedStudent.profile.find(
      (doc) => doc.name === docName
    );

    if (isPassed === '--') {
      if (!certificateDoc) {
        certificateDoc = updatedStudent.profile.create({
          name: docName,
          status: DocumentStatus.NotNeeded,
          required: true,
          updatedAt: new Date(),
          path: ''
        });
        updatedStudent.profile.push(certificateDoc);
      } else if (certificateDoc.status === DocumentStatus.Missing) {
        certificateDoc.status = DocumentStatus.NotNeeded;
      }
    } else if (!certificateDoc) {
      certificateDoc = updatedStudent.profile.create({
        name: docName,
        status: DocumentStatus.Missing,
        required: true,
        updatedAt: new Date(),
        path: ''
      });
      updatedStudent.profile.push(certificateDoc);
    } else if (certificateDoc.status === DocumentStatus.NotNeeded) {
      certificateDoc.status = DocumentStatus.Missing;
    }
  };

  // Iterate through each profile update configuration
  profileUpdates.forEach(({ fieldName, docName }) => {
    updateDocumentStatus(
      updatedStudent.academic_background.language[fieldName],
      docName
    );
  });

  await updatedStudent.save();

  res.status(200).send({
    success: true,
    data: updatedStudent.academic_background.language,
    profile: updatedStudent.profile
  });
  next();
});

// (O) email : self notification
const updateApplicationPreferenceSkill = asyncHandler(
  async (req, res, next) => {
    const {
      user,
      body: { application_preference }
    } = req;
    const { studentId } = req.params;
    let student_id;
    if (user.role === Role.Student || user.role === Role.Guest) {
      student_id = user._id;
    } else {
      student_id = studentId;
    }
    application_preference.updatedAt = new Date();
    const updatedStudent = await req.db.model('User').findByIdAndUpdate(
      student_id,
      {
        application_preference
      },
      { upsert: true, new: true }
    );
    res.status(200).send({
      success: true,
      data: updatedStudent.application_preference
    });
    next();
  }
);

// (O) email : self notification
const updatePersonalData = asyncHandler(async (req, res, next) => {
  const {
    params: { user_id },
    body: { personaldata }
  } = req;
  try {
    const updatedStudent = await req.db
      .model('User')
      .findByIdAndUpdate(user_id, personaldata, {
        upsert: true,
        new: true
      });
    res.status(200).send({
      success: true,
      data: {
        firstname: updatedStudent.firstname,
        firstname_chinese: updatedStudent.firstname_chinese,
        lastname: updatedStudent.lastname,
        lastname_chinese: updatedStudent.lastname_chinese,
        birthday: personaldata.birthday
      }
    });
    next();
  } catch (err) {
    logger.error(err);
  }
});

module.exports = {
  updateOfficehours,
  updateCredentials,
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreferenceSkill,
  updatePersonalData
};
