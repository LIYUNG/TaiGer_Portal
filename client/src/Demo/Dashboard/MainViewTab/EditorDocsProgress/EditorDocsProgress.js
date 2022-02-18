import React from "react";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import { uploadforstudent } from "../../../../api";
// import DocsProgress from "./DocsProgress";
import { Link } from "react-router-dom";
import EditProgramsFilesSubpage from "./EditProgramsFilesSubpage";

class EditorDocsProgress extends React.Component {
  state = {
    showProgramFilesPage: false,
    student: this.props.student,
    file: "",
  };

  setProgramFilesModalhide = () => {
    this.setState({
      showProgramFilesPage: false,
    });
  };
  render() {
    var applying_university_ML;
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_ML_template_filled;
    var application_RL_A_template_filled;
    var application_RL_B_template_filled;
    var application_RL_C_template_filled;
    var application_CV_template_filled;
    var application_ML_status;
    var application_RL_A_status;
    var application_RL_B_status;
    var application_RL_C_status;
    var application_CV_status;
    var application_ML_Lastupdate;
    var application_RL_A_Lastupdate;
    var application_RL_B_Lastupdate;
    var application_RL_C_Lastupdate;
    var application_CV_Lastupdate;
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
              <h6 className="mb-1" key={i}>
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
              <h6 className="mb-1" key={i}>
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
              <h6 className="mb-1" key={i}>
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
              <h6 className="mb-1" key={i}>
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
                ) !== -1 ? (
                  <h6 className="mb-1">Yes</h6>
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <h6 className="mb-1">No</h6>
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
                  doc.name.includes("_ML")
                ) !== -1 ? (
                  <h6 className="mb-1">uploaded</h6>
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <h6 className="mb-1">No</h6>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );

      if (
        this.props.student.generaldocs === undefined ||
        this.props.student.generaldocs.studentinputs === undefined ||
        this.props.student.generaldocs.studentinputs.length === 0
      ) {
        application_CV_template_filled = <h6 className="mb-1">No</h6>;
        application_RL_A_template_filled = <h6 className="mb-1">No</h6>;
        application_RL_B_template_filled = <h6 className="mb-1">No</h6>;
        application_RL_C_template_filled = <h6 className="mb-1">No</h6>;
        application_CV_status = <h6 className="mb-1">No</h6>;
        application_RL_A_status = <h6 className="mb-1">No</h6>;
        application_RL_B_status = <h6 className="mb-1">No</h6>;
        application_RL_C_status = <h6 className="mb-1">No</h6>;
        application_CV_Lastupdate = <h6 className="mb-1">Not existed</h6>;
        application_RL_A_Lastupdate = <h6 className="mb-1">Not existed</h6>;
        application_RL_B_Lastupdate = <h6 className="mb-1">Not existed</h6>;
        application_RL_C_Lastupdate = <h6 className="mb-1">Not existed</h6>;
      } else {
        application_CV_template_filled =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("CV_Template")
          ) !== -1 ? (
            <h6 className="mb-1">Yes</h6>
          ) : (
            <h6 className="mb-1">No</h6>
          );
        // For Editor
        application_CV_status =
          this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
            doc.name.includes("CV")
          ) !== -1 ? (
            <h6 className="mb-1">Uploaded</h6>
          ) : (
            <h6 className="mb-1">No</h6>
          );
        application_CV_Lastupdate =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("CV_Template")
          ) !== -1 ? (
            <h6 className="mb-1">
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("CV_Template")
                  )
                ].updatedAt
              ).toLocaleDateString()}
              {", "}
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("CV_Template")
                  )
                ].updatedAt
              ).toLocaleTimeString()}
            </h6>
          ) : (
            <h6 className="mb-1">Not existed</h6>
          );
        application_RL_A_template_filled =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_A_Template")
          ) !== -1 ? (
            <h6 className="mb-1">Yes</h6>
          ) : (
            <h6 className="mb-1">No</h6>
          );
        application_RL_B_template_filled =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_B_Template")
          ) !== -1 ? (
            <h6 className="mb-1">Yes</h6>
          ) : (
            <h6 className="mb-1">No</h6>
          );
        application_RL_C_template_filled =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_C_Template")
          ) !== -1 ? (
            <h6 className="mb-1">Yes</h6>
          ) : (
            <h6 className="mb-1">No</h6>
          );
        //For Editor:
        application_RL_A_status =
          this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
            doc.name.includes("RL_A")
          ) !== -1 ? (
            <h6 className="mb-1">Uploaded</h6>
          ) : (
            <h6 className="mb-1">No</h6>
          );
        application_RL_B_status =
          this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
            doc.name.includes("RL_B")
          ) !== -1 ? (
            <h6 className="mb-1">Uploaded</h6>
          ) : (
            <h6 className="mb-1">No</h6>
          );
        application_RL_C_status =
          this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
            doc.name.includes("RL_C")
          ) !== -1 ? (
            <h6 className="mb-1">Uploaded</h6>
          ) : (
            <h6 className="mb-1">No</h6>
          );
        application_RL_A_Lastupdate =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_A_Template")
          ) !== -1 ? (
            <h6 className="mb-1">
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("RL_A_Template")
                  )
                ].updatedAt
              ).toLocaleDateString()}
              {", "}
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("RL_A_Template")
                  )
                ].updatedAt
              ).toLocaleTimeString()}
            </h6>
          ) : (
            <h6 className="mb-1">Not existed</h6>
          );
        application_RL_B_Lastupdate =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_B_Template")
          ) !== -1 ? (
            <h6 className="mb-1">
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("RL_B_Template")
                  )
                ].updatedAt
              ).toLocaleDateString()}
              {", "}
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("RL_B_Template")
                  )
                ].updatedAt
              ).toLocaleTimeString()}
            </h6>
          ) : (
            <h6 className="mb-1">Not existed</h6>
          );
        application_RL_C_Lastupdate =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_C_Template")
          ) !== -1 ? (
            <h6 className="mb-1">
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("RL_C_Template")
                  )
                ].updatedAt
              ).toLocaleDateString()}
              {", "}
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("RL_C_Template")
                  )
                ].updatedAt
              ).toLocaleTimeString()}
            </h6>
          ) : (
            <h6 className="mb-1">Not existed</h6>
          );
      }
    }

    return (
      <>
        <tbody>
          <tr>
            {this.props.role !== "Student" ? (
              <td>
                <Link
                  to={
                    "/student-database/" +
                    this.props.student._id +
                    "/application-files"
                  }
                >
                  <p>
                    {this.props.student.firstname},{" "}
                    {this.props.student.lastname}
                  </p>
                </Link>
              </td>
            ) : (
              <></>
            )}
            <td>
              <h6 className="mb-1">RL A</h6>
              <h6 className="mb-1">RL B</h6>
              <h6 className="mb-1">RL C</h6>
              <h6 className="mb-1">CV</h6>
              {applying_university_ML}
            </td>
            <td>
              <h6 className="mb-1">Recommentation</h6>
              <h6 className="mb-1">Recommentation</h6>
              <h6 className="mb-1">Recommentation</h6>
              <h6 className="mb-1">CV</h6>
              {applying_university}
            </td>
            <td>
              <h6 className="mb-1">Letter</h6>
              <h6 className="mb-1">Letter</h6>
              <h6 className="mb-1">Letter</h6>
              <h6 className="mb-1">CV</h6>
              {applying_program}
            </td>
            <td>
              <h6 className="mb-1">// </h6>
              <h6 className="mb-1">// </h6>
              <h6 className="mb-1">// </h6>
              <h6 className="mb-1">//</h6>
              {application_deadline}
            </td>
            <td>
              {application_RL_A_template_filled}
              {application_RL_B_template_filled}
              {application_RL_C_template_filled}
              {application_CV_template_filled}
              {application_ML_template_filled}
            </td>
            <td>
              {application_RL_A_status}
              {application_RL_B_status}
              {application_RL_C_status}
              {application_CV_status}
              {application_ML_status}
            </td>
            <td>
              {application_RL_A_Lastupdate}
              {application_RL_B_Lastupdate}
              {application_RL_C_Lastupdate}
              {application_CV_Lastupdate}
              {application_ML_Lastupdate}
            </td>
          </tr>
        </tbody>
        <>
          <EditProgramsFilesSubpage
            role={this.props.role}
            student={this.state.student}
            show={this.state.showProgramFilesPage}
            onHide={this.setProgramFilesModalhide}
            setmodalhide={this.setProgramFilesModalhide}
          />
        </>
      </>
    );
  }
}

export default EditorDocsProgress;
