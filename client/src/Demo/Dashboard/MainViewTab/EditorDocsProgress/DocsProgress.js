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
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_ML_template_filled;
    var application_RL_template_filled;
    var application_CV_template_filled;
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <h5 className="mb-1"> No University</h5>;
      applying_program = <h5 className="mb-1"> No Program</h5>;
      application_deadline = <h5 className="mb-1"> No Date</h5>;
    } else {
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.programId.University_}
          </h5>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.programId.Program_}
          </h5>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.programId.Application_end_date_}
          </h5>
        )
      );
      // console.log(
      //   this.props.student.applications[0].documents[0].name.includes()
      // );
      application_ML_template_filled = this.props.student.applications.map(
        (application, i) => (
          <h5 className="mb-1" key={i}>
            {application.student_inputs.findIndex((doc) =>
              doc.name.includes("ML_Template")
            ) !== -1 ? (
              <h5>True</h5>
            ) : (
              <h5>False</h5>
            )}
          </h5>
        )
      );
      console.log(this.props.student.generaldocs);
      if (
        this.props.student.generaldocs === undefined ||
        this.props.student.generaldocs.studentinputs === undefined ||
        this.props.student.generaldocs.studentinputs.length === 0
      ) {
      } else {
        application_CV_template_filled =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("CV_Template")
          ) !== -1 ? (
            <h5>True</h5>
          ) : (
            <h5>False</h5>
          );
        //         doc.name.includes("CV_Template")
        //   (studentinput, i) => (
        //     <h5 className="mb-1" key={i}>
        //       {studentinput.findIndex((doc) =>
        //         doc.name.includes("CV_Template")
        //       ) !== -1 ? (

        //       ) : (

        //       )}
        //     </h5>
        //   )
        // );
        application_RL_template_filled =
          this.props.student.generaldocs.studentinputs.findIndex((doc) =>
            doc.name.includes("RL_Template")
          ) !== -1 ? (
            <h5>True</h5>
          ) : (
            <h5>False</h5>
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
            <td>{applying_university}</td>
            <td>{applying_program}</td>
            <td>{application_deadline}</td>
            <td>{application_ML_template_filled}</td>
            <td>{application_RL_template_filled}</td>
            <td>{application_CV_template_filled}</td>
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
