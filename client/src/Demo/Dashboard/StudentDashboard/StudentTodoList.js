import React from "react";
// import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
// import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import { uploadforstudent } from "../../../api";

class StudentTodoList extends React.Component {
  render() {
    let keys = Object.keys(this.props.documentlist2);
    let object_init = {};
    for (let i = 0; i < keys.length; i++) {
      object_init[keys[i]] = "missing";
    }

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === "uploaded") {
          object_init[this.props.student.profile[i].name] = "uploaded";
        } else if (this.props.student.profile[i].status === "accepted") {
          object_init[this.props.student.profile[i].name] = "accepted";
        } else if (this.props.student.profile[i].status === "rejected") {
          object_init[this.props.student.profile[i].name] = "rejected";
        } else if (this.props.student.profile[i].status === "missing") {
          object_init[this.props.student.profile[i].name] = "missing";
        } else if (this.props.student.profile[i].status === "notneeded") {
          object_init[this.props.student.profile[i].name] = "notneeded";
        }
      }
    } else {
    }
    var missing_profiles = keys.map((key, i) => {
      if (
        object_init[key] !== "accepted" &&
        object_init[key] !== "notneeded" &&
        object_init[key] !== "uploaded"
      ) {
        return <h6>{key.replace(/_/g, " ")}</h6>;
      }
    });
    var response_editor;
    if (this.props.student.applications) {
      response_editor = this.props.student.applications.map(
        (application, i) => (
          <>
            <h6 className="mb-1" key={i}>
              {application.programId.school}{" "}
              {application.programId.program}
            </h6>
          </>
        )
      );
    }
    var template_provided;
    if (this.props.student.applications) {
      template_provided = this.props.student.applications.map(
        (application, i) => (
          <>
            <h6 className="mb-1" key={i}>
              {application.programId.school}
            </h6>
          </>
        )
      );
    }
    // let applying_program;
    // let application_deadline;
    // if (this.props.student.applications) {
    //   applying_universit = this.props.student.applications.map(
    //     (application, i) => (
    //       <>
    //         <h5 className="mb-1" key={i}>
    //           {application.programId.school}
    //         </h5>
    //       </>
    //     )
    //   );
    // } else {
    //   applying_universit = (
    //     <tr>
    //       <td>
    //         <h5 className="mb-1"> No Program</h5>
    //       </td>
    //     </tr>
    //   );
    // }

    // if (this.props.student.applications) {
    //   applying_program = this.props.student.applications.map(
    //     (application, i) => (
    //       <>
    //         <h5 className="mb-1" key={i}>
    //           {application.programId.program}
    //         </h5>
    //       </>
    //     )
    //   );
    // } else {
    //   applying_program = (
    //     <tr>
    //       <td>
    //         <h5 className="mb-1"> No Program</h5>
    //       </td>
    //     </tr>
    //   );
    // }

    // if (this.props.student.applications) {
    //   application_deadline = this.props.student.applications.map(
    //     (application, i) => (
    //       <>
    //         <h5 className="mb-1" key={i}>
    //           {application.programId.application_deadline}
    //         </h5>
    //       </>
    //     )
    //   );
    // } else {
    //   application_deadline = (
    //     <tr>
    //       <td>
    //         <h5 className="mb-1"> No Program</h5>
    //       </td>
    //     </tr>
    //   );
    // }
    var applying_university_ML;
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_ML_template_ToBefilled;
    var general_RL_template_ToBefilled;
    var general_CV_template_ToBefilled;
    var application_ML_status;
    var general_RL_status;
    var general_CV_status;
    var application_ML_Lastupdate;
    var general_RL_Lastupdate;
    var general_CV_Lastupdate;
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <h6 className="mb-1"> No University</h6>;
      applying_program = <h6 className="mb-1"> No Program</h6>;
      application_deadline = <h6 className="mb-1"> No Date</h6>;
    } else {
      applying_university_ML = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            ML
          </h6>
        )
      );
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.programId.school}
          </h6>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.programId.program}
          </h6>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.programId.application_deadline}
          </h6>
        )
      );
      application_ML_Lastupdate = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.student_inputs &&
            application.student_inputs.findIndex((doc) =>
              doc.name.includes("ML_Template")
            ) !== -1 ? (
              <h6 className="mb-1">
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
              <h6 className="mb-1">Not existed</h6>
            )}
          </>
        )
      );
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
                ) === -1 ? (
                  <h6 className="mb-1" key={application._id}>
                    ML - {application.programId.school}
                    {" - "}
                    {application.programId.program}
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
                        {application.programId.program}
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
    }

    if (
      this.props.student.generaldocs === undefined ||
      this.props.student.generaldocs.editoroutputs === undefined ||
      this.props.student.generaldocs.editoroutputs.length === 0
    ) {
      general_CV_status = <></>;
      general_RL_status = <></>;
    } else {
      general_CV_status =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (
            doc //TODO: get the latest CV and isReceivedFeedback flag
          ) => doc.name.includes("CV")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex(
            (
              doc //TODO: get the latest RL and isReceivedFeedback flag
            ) => doc.name.includes("CV") && doc.isFinalVersion === true
          ) !== -1 ? (
            <></>
          ) : (
            <h6 className="mb-1" key={1}>
              CV Revised
            </h6>
          )
        ) : (
          <></>
        );
      //For Editor: (TODO: add another flags: student read, editor read?)
      general_RL_status =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (
            doc //TODO: get the latest RL and isReceivedFeedback flag
          ) => doc.name.includes("RL")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex(
            (
              doc //TODO: get the latest RL and isReceivedFeedback flag
            ) => doc.name.includes("RL") && doc.isFinalVersion === true
          ) !== -1 ? (
            <></>
          ) : (
            <h6 className="mb-1" key={10}>
              RL Revised
            </h6>
          )
        ) : (
          <></>
        );
    }

    if (
      this.props.student.generaldocs === undefined ||
      this.props.student.generaldocs.studentinputs === undefined ||
      this.props.student.generaldocs.studentinputs.length === 0
    ) {
      general_CV_template_ToBefilled = (
        <h6 className="mb-1" key={1}>
          CV template
        </h6>
      );
      general_RL_template_ToBefilled = (
        <h6 className="mb-1" key={10}>
          RL template
        </h6>
      );
      general_CV_Lastupdate = (
        <h6 className="mb-1" key={1}>
          Not existed
        </h6>
      );
      general_RL_Lastupdate = (
        <h6 className="mb-1" key={10}>
          Not existed
        </h6>
      );
    } else {
      // For Editor

      general_CV_Lastupdate =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("CV_Template")
        ) !== -1 ? (
          <h6 className="mb-1">
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("CV_Template")
                )
              ].updatedAt
            ).toLocaleDateString()}
            {", "}
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("CV_Template")
                )
              ].updatedAt
            ).toLocaleTimeString()}
          </h6>
        ) : (
          <h6 className="mb-1">Not existed</h6>
        );

      general_RL_Lastupdate =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("RL_Template")
        ) !== -1 ? (
          <h6 className="mb-1">
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("RL_Template")
                )
              ].updatedAt
            ).toLocaleDateString()}
            {", "}
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("RL_Template")
                )
              ].updatedAt
            ).toLocaleTimeString()}
          </h6>
        ) : (
          <h6 className="mb-1">Not existed</h6>
        );
    }
    general_CV_template_ToBefilled =
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.studentinputs !== undefined &&
      this.props.student.generaldocs.studentinputs.findIndex((doc) =>
        doc.name.includes("CV_Template")
      ) === -1 &&
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.editoroutputs !== undefined &&
      this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
        doc.name.includes("CV")
      ) === -1 ? (
        <h6 className="mb-1" key={1}>
          CV - Template
        </h6>
      ) : (
        <></>
      );
    general_RL_template_ToBefilled =
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.studentinputs !== undefined &&
      this.props.student.generaldocs.studentinputs.findIndex((doc) =>
        doc.name.includes("RL_Template")
      ) === -1 &&
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.editoroutputs !== undefined &&
      this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
        doc.name.includes("RL")
      ) === -1 ? (
        <h6 className="mb-1" key={10}>
          RL template
        </h6>
      ) : (
        <></>
      );
    return (
      <>
        <tbody>
          <tr>
            <td>{missing_profiles}</td>
            <td>
              {general_RL_template_ToBefilled}
              {general_CV_template_ToBefilled}
              {application_ML_template_ToBefilled}
            </td>
            <td>
              {general_RL_status}
              {general_CV_status}
              {application_ML_status}
            </td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default StudentTodoList;
