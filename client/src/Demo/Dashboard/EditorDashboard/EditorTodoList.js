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
    }
    let waiting_RL_templates = this.props.student.applications.map(
      (application, i) => {
        return (
          <>
            <h6>
              {application.programId.school}
              {" - "}
              {application.programId.program}
            </h6>
          </>
        );
      }
    );
    let waiting_ML_templates = keys.map((key, i) => {
      if (object_init[key] === "uploaded") {
        return (
          <>
            <h6>{this.props.documentlist2[key]}</h6>
          </>
        );
      }
    });

    return (
      <>
        <tbody>
          <tr>
            <td>
              <h5>
                {this.props.student.firstname}, {this.props.student.lastname}
              </h5>
            </td>
            <td>{waiting_RL_templates}</td>
            <td>{waiting_ML_templates}</td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default EditorTodoList;
