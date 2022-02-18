import React from "react";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineUndo,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import { uploadforstudent } from "../../../api";
import { Link } from "react-router-dom";

class EditorReviewing extends React.Component {
  generalFileLastUpdate = (file_name, file_name_text) => {
    return this.props.student.generaldocs.studentinputs.findIndex((doc) =>
      doc.name.includes(file_name + "_Template")
    ) !== -1 ? (
      <h6 className="mb-1" key={1}>
        {new Date(
          this.props.student.generaldocs.studentinputs[
            this.props.student.generaldocs.studentinputs.findIndex((doc) =>
              doc.name.includes(file_name + "_Template")
            )
          ].updatedAt
        ).toLocaleDateString()}
        {", "}
        {new Date(
          this.props.student.generaldocs.studentinputs[
            this.props.student.generaldocs.studentinputs.findIndex((doc) =>
              doc.name.includes(file_name + "_Template")
            )
          ].updatedAt
        ).toLocaleTimeString()}
      </h6>
    ) : (
      <h6 className="mb-1" key={1}>
        Not existed
      </h6>
    );
  };

  generalFileTemplateToBeFilled_Init = (file_name) => {
    return (
      <h6 className="mb-1" key={1}>
        <AiFillQuestionCircle
          size={18}
          color="lightgray"
          title="No Document uploaded"
        />{" "}
        file_name
      </h6>
    );
  };
  generalFileFilledOrReceivedFeedback = (file_name, file_name_text) => {
    return this.props.student.generaldocs.studentinputs.findIndex((doc) =>
      doc.name.includes(file_name + "_Template")
    ) !== -1 ? (
      this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
        doc.name.includes(file_name)
      ) !== -1 ? (
        this.props.student.generaldocs.editoroutputs.findIndex(
          (doc) =>
            doc.name.includes(file_name) &&
            doc.isReceivedFeedback === true &&
            doc.isFinalVersion === false
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex(
            (doc) =>
              doc.name.includes(file_name) &&
              doc.isReceivedFeedback === false &&
              doc.isFinalVersion === false
          ) !== -1 ? (
            <></>
          ) : (
            <h6 className="mb-1" key={10}>
              {file_name_text} received feedback
            </h6>
          )
        ) : (
          <></>
        )
      ) : (
        <h6 className="mb-1" key={10}>
          {file_name_text} template filled
        </h6>
      )
    ) : (
      <></>
    );
  };

  GeneralFileTemplateToBeFilled = (file_name, file_name_text) => {
    return this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.studentinputs !== undefined &&
      this.props.student.generaldocs.studentinputs.findIndex((doc) =>
        doc.name.includes(file_name + "_Template")
      ) === -1 &&
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.editoroutputs !== undefined &&
      this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
        doc.name.includes(file_name)
      ) === -1 ? (
      <h6 className="mb-1" key={10}>
        <AiFillQuestionCircle
          size={18}
          color="lightgray"
          title="No Document uploaded"
        />{" "}
        {file_name_text}
      </h6>
    ) : (
      <></>
    );
  };
  GeneralFileStatus = (file_name, file_name_text) => {
    return this.props.student.generaldocs.editoroutputs.findIndex(
      (
        doc //TODO: get the latest RL and isReceivedFeedback flag
      ) => doc.name.includes(file_name)
    ) !== -1 ? (
      this.props.student.generaldocs.editoroutputs.findIndex(
        (
          doc //TODO: get the latest RL and isReceivedFeedback flag
        ) =>
          doc.name.includes(file_name) &&
          doc.isReceivedFeedback === false &&
          doc.isFinalVersion === false
      ) !== -1 ? (
        <h6 className="mb-1" key={10}>
          {file_name_text} Revised
        </h6>
      ) : (
        <></>
      )
    ) : (
      <></>
    );
  };
  finishedGeneralFile = (file_name, file_name_text) => {
    return this.props.student.generaldocs.editoroutputs.findIndex(
      (doc) => doc.name.includes(file_name) && doc.isFinalVersion
    ) !== -1 ? (
      <h6 className="mb-1" key={10}>
        <IoCheckmarkCircle size={18} color="limegreen" title="Final Version" />{" "}
        {file_name_text} -- Final
      </h6>
    ) : (
      // TODO: add new case: replace prepared by "programId.requiredML?"
      <></>
    );
  };
  render() {
    var applying_university_ML;
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_ML_template_ToBefilled;
    var general_RL_A_template_ToBefilled;
    var general_RL_B_template_ToBefilled;
    var general_RL_C_template_ToBefilled;
    var general_CV_template_ToBefilled;
    var application_ML_template_filled;
    var general_RL_A_template_filled;
    var general_RL_B_template_filled;
    var general_RL_C_template_filled;
    var general_CV_template_filled;
    var application_ML_status;
    var general_RL_A_status;
    var general_RL_B_status;
    var general_RL_C_status;
    var general_CV_status;
    var finished_RL_A;
    var finished_RL_B;
    var finished_RL_C;
    var finished_CV;
    var finished_application_ML;
    var application_ML_Lastupdate;
    var general_RL_A_Lastupdate;
    var general_RL_B_Lastupdate;
    var general_RL_C_Lastupdate;
    var general_CV_Lastupdate;
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <></>;
      applying_program = <></>;
      application_deadline = <></>;
    } else {
      applying_university_ML = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <h6 className="mb-1" key={application._id}>
                ML
              </h6>
            ) : (
              <></>
            )}
          </>
        )
      );
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <h6 className="mb-1" key={application._id}>
                {application.programId.school}
              </h6>
            ) : (
              <></>
            )}
          </>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <h6 className="mb-1" key={application._id}>
                {application.programId.program_name}
              </h6>
            ) : (
              <></>
            )}
          </>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <h6 className="mb-1" key={application._id}>
                {application.programId.application_deadline}
              </h6>
            ) : (
              <></>
            )}
          </>
        )
      );
      application_ML_Lastupdate = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {application.student_inputs &&
                application.student_inputs.findIndex((doc) =>
                  doc.name.includes("ML_Template")
                ) !== -1 ? (
                  <h6 className="mb-1" key={application._id}>
                    {new Date(
                      application.student_inputs[
                        application.student_inputs.findIndex((doc) =>
                          doc.name.includes("ML_Template")
                        )
                      ].updatedAt
                    ).toLocaleDateString()}
                    {", "}
                    {new Date(
                      application.student_inputs[
                        application.student_inputs.findIndex((doc) =>
                          doc.name.includes("ML_Template")
                        )
                      ].updatedAt
                    ).toLocaleTimeString()}
                  </h6>
                ) : (
                  <h6 className="mb-1" key={i}>
                    Not existed
                  </h6>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
      application_ML_template_filled = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {application.student_inputs &&
                application.student_inputs.findIndex((doc) =>
                  doc.name.includes("ML_Template")
                ) !== -1 &&
                application.documents &&
                application.documents.findIndex(
                  (doc) =>
                    doc.name.includes("ML") && doc.isFinalVersion === true
                ) === -1 ? (
                  application.documents &&
                  application.documents.findIndex(
                    (doc) =>
                      doc.name.includes("ML") &&
                      (doc.isReceivedFeedback === false ||
                        doc.isReceivedFeedback === undefined)
                  ) !== -1 ? (
                    <></>
                  ) : (
                    <>
                      <h6 className="mb-1" key={application._id}>
                        ML - {application.programId.school}
                        {" - "}
                        {application.programId.program_name}
                      </h6>
                    </>
                  )
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
      //For editor
      application_ML_status = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {application.documents &&
                application.documents.findIndex((doc) =>
                  doc.name.includes("ML")
                ) !== -1 ? (
                  application.documents &&
                  application.documents.findIndex(
                    (doc) =>
                      doc.name.includes("ML") && doc.isFinalVersion === true
                  ) !== -1 ? (
                    <></>
                  ) : application.documents &&
                    application.documents.findIndex(
                      (doc) =>
                        doc.name.includes("ML") &&
                        (doc.isReceivedFeedback === false ||
                          doc.isReceivedFeedback === undefined)
                    ) !== -1 ? (
                    <>
                      <h6 className="mb-1" key={application._id}>
                        ML - {application.programId.school}
                        {" - "}
                        {application.programId.program_name}
                      </h6>
                    </>
                  ) : (
                    <></>
                  )
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
      finished_application_ML = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {application.documents &&
                application.documents.findIndex(
                  (doc) =>
                    doc.name.includes("_ML") &&
                    doc.isFinalVersion !== undefined &&
                    doc.isFinalVersion === true
                ) !== -1 ? (
                  <h6 className="mb-1" key={application._id}>
                    <IoCheckmarkCircle
                      size={18}
                      color="limegreen"
                      title="Final Version"
                    />{" "}
                    ML - {application.programId.school}
                    {" - "}
                    {application.programId.program_name}
                  </h6>
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
      //TODO: Can add program list ML required info to here!
      application_ML_template_ToBefilled = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {(application.student_inputs &&
                  application.student_inputs.findIndex((doc) =>
                    doc.name.includes("ML_Template")
                  )) === -1 &&
                application.documents &&
                application.documents.findIndex((doc) =>
                  doc.name.includes("ML")
                ) === -1 &&
                (application.programId.ml_required === "yes" ||
                  application.programId.ml_required === "Yes") ? (
                  <h6 className="mb-1" key={application._id}>
                    <AiFillQuestionCircle
                      size={18}
                      color="lightgray"
                      title="No Document uploaded"
                    />{" "}
                    ML - {application.programId.school}
                    {" - "}
                    {application.programId.program_name}
                  </h6>
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <> </>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
    }

    if (
      this.props.student.generaldocs === undefined ||
      this.props.student.generaldocs.editoroutputs === undefined ||
      this.props.student.generaldocs.editoroutputs.length === 0
    ) {
      general_CV_status = <></>;
      general_RL_A_status = <></>;
      general_RL_B_status = <></>;
      general_RL_C_status = <></>;
    } else {
      //For Editor: (TODO: add another flags: student read, editor read?)
      general_CV_status = this.GeneralFileStatus("CV", "CV");
      general_RL_A_status = this.GeneralFileStatus("RL_A", "RL (Referee B)");
      general_RL_B_status = this.GeneralFileStatus("RL_B", "RL (Referee B)");
      general_RL_C_status = this.GeneralFileStatus("RL_C", "RL (Referee C)");

      finished_CV = this.finishedGeneralFile("CV", "CV");
      finished_RL_A = this.finishedGeneralFile("RL_A", "RL (Referee A)");
      finished_RL_B = this.finishedGeneralFile("RL_B", "RL (Referee B)");
      finished_RL_C = this.finishedGeneralFile("RL_C", "RL (Referee C)");
    }

    if (
      this.props.student.generaldocs === undefined ||
      this.props.student.generaldocs.studentinputs === undefined ||
      this.props.student.generaldocs.studentinputs.length === 0
    ) {
      general_CV_template_filled = <></>;
      general_RL_A_template_filled = <></>;
      general_RL_B_template_filled = <></>;
      general_RL_C_template_filled = <></>;
      general_CV_template_ToBefilled =
        this.generalFileTemplateToBeFilled_Init("CV Template");

      general_RL_A_template_ToBefilled =
        this.generalFileTemplateToBeFilled_Init("RL template (Referee A)");

      general_RL_B_template_ToBefilled =
        this.generalFileTemplateToBeFilled_Init("RL template (Referee B)");

      general_RL_C_template_ToBefilled =
        this.generalFileTemplateToBeFilled_Init("RL template (Referee C)");

      general_CV_Lastupdate = (
        <h6 className="mb-1" key={1}>
          Not existed
        </h6>
      );
      general_RL_A_Lastupdate = (
        <h6 className="mb-1" key={10}>
          Not existed
        </h6>
      );
      general_RL_B_Lastupdate = (
        <h6 className="mb-1" key={10}>
          Not existed
        </h6>
      );
      general_RL_C_Lastupdate = (
        <h6 className="mb-1" key={10}>
          Not existed
        </h6>
      );
    } else {
      general_CV_template_filled = this.generalFileFilledOrReceivedFeedback(
        "CV",
        "CV"
      );
      general_CV_Lastupdate = this.generalFileLastUpdate("CV", "CV");
      general_RL_A_template_filled = this.generalFileFilledOrReceivedFeedback(
        "RL_A",
        "RL (Referee A)"
      );
      general_RL_A_Lastupdate = this.generalFileLastUpdate("RL_A", "RL_A");
      general_RL_B_template_filled = this.generalFileFilledOrReceivedFeedback(
        "RL_B",
        "RL (Referee B)"
      );
      general_RL_B_Lastupdate = this.generalFileLastUpdate("RL_B", "RL_B");
      general_RL_C_template_filled = this.generalFileFilledOrReceivedFeedback(
        "RL_C",
        "RL (Referee C)"
      );
      general_RL_C_Lastupdate = this.generalFileLastUpdate("RL_C", "RL_C");
    }

    general_RL_A_template_ToBefilled = this.GeneralFileTemplateToBeFilled(
      "RL_A",
      "RL template (Referee A)"
    );

    general_RL_B_template_ToBefilled = this.GeneralFileTemplateToBeFilled(
      "RL_B",
      "RL template (Referee B)"
    );

    general_RL_C_template_ToBefilled = this.GeneralFileTemplateToBeFilled(
      "RL_C",
      "RL template (Referee C)"
    );

    general_CV_template_ToBefilled = this.GeneralFileTemplateToBeFilled(
      "CV",
      "CV - Template"
    );

    return (
      <>
        <tr>
          {this.props.role !== "Student" ? (
            <>
              <td>
                <Link
                  to={
                    "/student-database/" +
                    this.props.student._id +
                    "/application-files"
                  }
                >
                  {this.props.student.firstname}
                  {" - "}
                  {this.props.student.lastname}
                </Link>
              </td>
              <td>
                {general_CV_template_ToBefilled}
                {general_RL_A_template_ToBefilled}
                {general_RL_B_template_ToBefilled}
                {general_RL_C_template_ToBefilled}
                {application_ML_template_ToBefilled}
              </td>
            </>
          ) : (
            <></>
          )}

          <td>
            {general_RL_A_template_filled}
            {general_RL_B_template_filled}
            {general_RL_C_template_filled}
            {general_CV_template_filled}
            {application_ML_template_filled}
          </td>
          {this.props.role !== "Student" ? (
            <td>
              {general_RL_A_status}
              {general_RL_B_status}
              {general_RL_C_status}
              {general_CV_status}
              {application_ML_status}
            </td>
          ) : (
            <></>
          )}
          {this.props.role !== "Student" ? (
            <td>
              {finished_RL_A}
              {finished_RL_B}
              {finished_RL_C}
              {finished_CV}
              {finished_application_ML}
            </td>
          ) : (
            <></>
          )}
        </tr>
      </>
    );
  }
}

export default EditorReviewing;
