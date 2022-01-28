import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import EditProgramsFilesSubpage from "./EditProgramsFilesSubpage";

class DocsProgress extends React.Component {
  state = {
    showProgramFilesPage: false,
    student: this.props.student,
    file: "",
  };
  startEditingProgramFiles = () => {
    console.log("startEditingProgram");
    this.setState({
      showProgramFilesPage: true,
    });
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
    var application_RL_template_filled;
    var application_CV_template_filled;
    var application_ML_Lastupdate;
    var application_RL_Lastupdate;
    var application_CV_Lastupdate;
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
            {application.programId.University_}
          </h6>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.programId.Program_}
          </h6>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <h6 className="mb-1" key={i}>
            {application.programId.Application_end_date_}
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
      application_ML_template_filled = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.student_inputs &&
            application.student_inputs.findIndex((doc) =>
              doc.name.includes("ML_Template")
            ) !== -1 ? (
              <h6 className="mb-1">True</h6>
            ) : application.prepared ? ( // replace prepared by "programId.requiredML?"
              <h6 className="mb-1">closed</h6>
            ) : (
              <h6 className="mb-1">not required</h6>
            )}
          </>
        )
      );

      if (
        this.props.student.generaldocs === undefined ||
        this.props.student.generaldocs.studentinputs === undefined ||
        this.props.student.generaldocs.studentinputs.length === 0
      ) {
        application_CV_template_filled = <h6 className="mb-1">Not yet</h6>;
        application_RL_template_filled = <h6 className="mb-1">Not yet</h6>;
        application_CV_Lastupdate = <h6 className="mb-1">Not existed</h6>;
        application_RL_Lastupdate = <h6 className="mb-1">Not existed</h6>;
      } else {
        application_CV_template_filled =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("CV_Template")
          ) !== -1 ? (
            <h6 className="mb-1">True</h6>
          ) : (
            <h6 className="mb-1">False</h6>
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
        application_RL_template_filled =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_Template")
          ) !== -1 ? (
            <h6 className="mb-1">True</h6>
          ) : (
            <h6 className="mb-1">False</h6>
          );
        application_RL_Lastupdate =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_Template")
          ) !== -1 ? (
            <h6 className="mb-1">
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("RL_Template")
                  )
                ].updatedAt
              ).toLocaleDateString()}
              {", "}
              {new Date(
                this.props.student.generaldocs.studentinputs[
                  this.props.student.generaldocs.studentinputs.findIndex(
                    (doc) => doc.name.includes("RL_Template")
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
            <td>
              <DropdownButton
                className="btn ml-2"
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.student._id}`}
                key={this.props.student._id}
              >
                <Dropdown.Item
                  eventKey="4"
                  onSelect={() => this.startEditingProgramFiles()}
                >
                  Edit Files
                </Dropdown.Item>
              </DropdownButton>
            </td>
            {this.props.role !== "Student" ? (
              <td>
                <p>
                  {this.props.student.firstname}, {this.props.student.lastname}
                </p>
              </td>
            ) : (
              <></>
            )}
            <td>
              <h6 className="mb-1">RL</h6>
              <h6 className="mb-1">CV</h6>
              {applying_university_ML}
            </td>
            <td>
              <h6 className="mb-1">Recommentation</h6>
              <h6 className="mb-1">CV</h6>
              {applying_university}
            </td>
            <td>
              <h6 className="mb-1">Letters</h6>
              <h6 className="mb-1">CV</h6>
              {applying_program}
            </td>
            <td>
              <h6 className="mb-1">// </h6>
              <h6 className="mb-1">//</h6>
              {application_deadline}
            </td>
            <td>
              {application_RL_template_filled}
              {application_CV_template_filled}
              {application_ML_template_filled}
            </td>
            <td></td>
            <td>
              {application_RL_Lastupdate}
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

export default DocsProgress;
