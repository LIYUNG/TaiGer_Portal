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
    university['updatedAt'] = new Date();
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
  // const { _id } = student;
  let student_id;
  if (user.role === Role.Student || user.role === Role.Guest) {
    student_id = user._id.toString();
  } else {
    student_id = studentId;
  }
  language['updatedAt'] = new Date();
  const updatedStudent = await req.db.model('User').findByIdAndUpdate(
    student_id,
    {
      'academic_background.language': language
      // $set: {
      //   'academic_background.language': language
      // }
    },
    { upsert: true, new: true }
  );

  // German not needed
  let german_certificate_doc = updatedStudent.profile.find(
    (doc) => doc.name === profile_name_list.German_Certificate
  );
  let english_certificate_doc = updatedStudent.profile.find(
    (doc) => doc.name === profile_name_list.Englisch_Certificate
  );
  let gre_certificate_doc = updatedStudent.profile.find(
    (doc) => doc.name === profile_name_list.GRE
  );
  let gmat_certificate_doc = updatedStudent.profile.find(
    (doc) => doc.name === profile_name_list.GMAT
  );
  if (updatedStudent.academic_background.language.german_isPassed === '--') {
    if (!german_certificate_doc) {
      // Set not needed
      german_certificate_doc = updatedStudent.profile.create({
        name: profile_name_list.German_Certificate
      });
      german_certificate_doc.status = DocumentStatus.NotNeeded;
      german_certificate_doc.required = true;
      german_certificate_doc.updatedAt = new Date();
      german_certificate_doc.path = '';
      updatedStudent.profile.push(german_certificate_doc);
    } else if (german_certificate_doc.status === DocumentStatus.Missing) {
      german_certificate_doc.status = DocumentStatus.NotNeeded;
    }
  } else if (!german_certificate_doc) {
    // Set not needed
    german_certificate_doc = updatedStudent.profile.create({
      name: profile_name_list.German_Certificate
    });
    german_certificate_doc.status = DocumentStatus.Missing;
    german_certificate_doc.required = true;
    german_certificate_doc.updatedAt = new Date();
    german_certificate_doc.path = '';
    updatedStudent.profile.push(german_certificate_doc);
  } else if (german_certificate_doc.status === DocumentStatus.NotNeeded) {
    german_certificate_doc.status = DocumentStatus.Missing;
  }

  if (updatedStudent.academic_background.language.english_isPassed === '--') {
    if (!english_certificate_doc) {
      // Set not needed
      english_certificate_doc = updatedStudent.profile.create({
        name: profile_name_list.Englisch_Certificate
      });
      english_certificate_doc.status = DocumentStatus.NotNeeded;
      english_certificate_doc.required = true;
      english_certificate_doc.updatedAt = new Date();
      english_certificate_doc.path = '';
      updatedStudent.profile.push(english_certificate_doc);
    } else if (english_certificate_doc.status === DocumentStatus.Missing) {
      english_certificate_doc.status = DocumentStatus.NotNeeded;
    }
  } else if (!english_certificate_doc) {
    // Set not needed
    english_certificate_doc = updatedStudent.profile.create({
      name: profile_name_list.Englisch_Certificate
    });
    english_certificate_doc.status = DocumentStatus.Missing;
    english_certificate_doc.required = true;
    english_certificate_doc.updatedAt = new Date();
    english_certificate_doc.path = '';
    updatedStudent.profile.push(english_certificate_doc);
  } else if (english_certificate_doc.status === DocumentStatus.NotNeeded) {
    english_certificate_doc.status = DocumentStatus.Missing;
  }
  if (updatedStudent.academic_background.language.gre_isPassed === '--') {
    if (!gre_certificate_doc) {
      // Set not needed
      gre_certificate_doc = updatedStudent.profile.create({
        name: profile_name_list.GRE
      });
      gre_certificate_doc.status = DocumentStatus.NotNeeded;
      gre_certificate_doc.required = true;
      gre_certificate_doc.updatedAt = new Date();
      gre_certificate_doc.path = '';
      updatedStudent.profile.push(gre_certificate_doc);
    } else if (gre_certificate_doc.status === DocumentStatus.Missing) {
      gre_certificate_doc.status = DocumentStatus.NotNeeded;
    }
  } else if (!gre_certificate_doc) {
    // Set not needed
    gre_certificate_doc = updatedStudent.profile.create({
      name: profile_name_list.GRE
    });
    gre_certificate_doc.status = DocumentStatus.Missing;
    gre_certificate_doc.required = true;
    gre_certificate_doc.updatedAt = new Date();
    gre_certificate_doc.path = '';
    updatedStudent.profile.push(gre_certificate_doc);
  } else if (gre_certificate_doc.status === DocumentStatus.NotNeeded) {
    gre_certificate_doc.status = DocumentStatus.Missing;
  }

  if (updatedStudent.academic_background.language.gmat_isPassed === '--') {
    if (!gmat_certificate_doc) {
      // Set not needed
      gmat_certificate_doc = updatedStudent.profile.create({
        name: profile_name_list.GMAT
      });
      gmat_certificate_doc.status = DocumentStatus.NotNeeded;
      gmat_certificate_doc.required = true;
      gmat_certificate_doc.updatedAt = new Date();
      gmat_certificate_doc.path = '';
      updatedStudent.profile.push(gmat_certificate_doc);
    } else if (gmat_certificate_doc.status === DocumentStatus.Missing) {
      gmat_certificate_doc.status = DocumentStatus.NotNeeded;
    }
  } else if (!gmat_certificate_doc) {
    // Set not needed
    gmat_certificate_doc = updatedStudent.profile.create({
      name: profile_name_list.GMAT
    });
    gmat_certificate_doc.status = DocumentStatus.Missing;
    gmat_certificate_doc.required = true;
    gmat_certificate_doc.updatedAt = new Date();
    gmat_certificate_doc.path = '';
    updatedStudent.profile.push(gmat_certificate_doc);
  } else if (gmat_certificate_doc.status === DocumentStatus.NotNeeded) {
    gmat_certificate_doc.status = DocumentStatus.Missing;
  }

  await updatedStudent.save();
  // TODO: minor: profile field not used for student.
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
    // const { _id } = student;
    let student_id;
    if (user.role === Role.Student || user.role === Role.Guest) {
      // eslint-disable-next-line no-underscore-dangle
      student_id = user._id;
    } else {
      student_id = studentId;
    }
    application_preference['updatedAt'] = new Date();
    const updatedStudent = await req.db.model('User').findByIdAndUpdate(
      student_id,
      {
        application_preference
      },
      { upsert: true, new: true }
    );
    // const updatedStudent = await req.db.model('User').findById(_id);
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
    user,
    body: { personaldata }
  } = req;
  try {
    const updatedStudent = await req.db
      .model('User')
      .findByIdAndUpdate(user_id, personaldata, {
        upsert: true,
        new: true
      });
    // const updatedStudent = await req.db.model('User').findById(_id);
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
