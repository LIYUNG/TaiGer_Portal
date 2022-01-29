import React from "react";
// import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
// import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import { uploadforstudent } from "../../../api";

class AgentTodoList extends React.Component {
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
    let missing_profiles = keys.map((key, i) => {
      if (object_init[key] !== "accepted" && object_init[key] !== "notneeded") {
        return (
          <>
            <h6>{this.props.documentlist2[key]}</h6>
          </>
        );
      }
    });
    let to_be_checked_profiles = keys.map((key, i) => {
      if (object_init[key] === "uploaded") {
        return (
          <>
            <h6>{this.props.documentlist2[key]}</h6>
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
    //         <h6 className="mb-1" key={i}>
    //           {application.programId.University_}
    //         </h6>
    //       </>
    //     )
    //   );
    // } else {
    //   applying_universit = (
    //     <tr>
    //       <td>
    //         <h6 className="mb-1"> No Program</h6>
    //       </td>
    //     </tr>
    //   );
    // }

    // if (this.props.student.applications) {
    //   applying_program = this.props.student.applications.map(
    //     (application, i) => (
    //       <>
    //         <h6 className="mb-1" key={i}>
    //           {application.programId.Program_}
    //         </h6>
    //       </>
    //     )
    //   );
    // } else {
    //   applying_program = (
    //     <tr>
    //       <td>
    //         <h6 className="mb-1"> No Program</h6>
    //       </td>
    //     </tr>
    //   );
    // }

    // if (this.props.student.applications) {
    //   application_deadline = this.props.student.applications.map(
    //     (application, i) => (
    //       <>
    //         <h6 className="mb-1" key={i}>
    //           {application.programId.Application_end_date_}
    //         </h6>
    //       </>
    //     )
    //   );
    // } else {
    //   application_deadline = (
    //     <tr>
    //       <td>
    //         <h6 className="mb-1"> No Program</h6>
    //       </td>
    //     </tr>
    //   );
    // }

    return (
      <>
        <tbody>
          <tr>
            <td>
              <h6>
                {this.props.student.firstname}, {this.props.student.lastname}
              </h6>
            </td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default AgentTodoList;
