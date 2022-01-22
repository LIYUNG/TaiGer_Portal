import React from "react";
// import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
// import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import { uploadforstudent } from "../../../api";

class EditorTodoList extends React.Component {
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
      console.log("no files");
    }
    let missing_profiles = keys.map((key, i) => {
      if (object_init[key] !== "accepted" && object_init[key] !== "notneeded") {
        return (
          <>
            <h5>{this.props.documentlist2[key]}</h5>
          </>
        );
      }
    });
    let to_be_checked_profiles = keys.map((key, i) => {
      if (object_init[key] === "uploaded") {
        return (
          <>
            <h5>{this.props.documentlist2[key]}</h5>
          </>
        );
      }
    });
    // let applying_program;
    // let application_deadline;
    // if (this.props.student.applications) {
    //   applying_universit = this.props.student.applications.map(
    //     (application, i) => (
    //       <>
    //         <h5 className="mb-1" key={i}>
    //           {application.programId.University_}
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
    //           {application.programId.Program_}
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
    //           {application.programId.Application_end_date_}
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

    return (
      <>
        <tbody>
          <tr>
            <td>
              <h5>
                {this.props.student.firstname}, {this.props.student.lastname}
              </h5>
            </td>
            <td>{missing_profiles}</td>
            <td>{to_be_checked_profiles}</td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default EditorTodoList;
