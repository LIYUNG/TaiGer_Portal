import React from "react";
// import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
// import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import { uploadforstudent } from "../../../api";

class AgentTodoList extends React.Component {
  render() {
    let keys = Object.keys(window.profile_list);
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
            <h6>{window.profile_list[key]}</h6>
          </>
        );
      }
    });
    let to_be_checked_profiles = keys.map((key, i) => {
      if (object_init[key] === "uploaded") {
        return (
          <>
            <h6>{window.profile_list[key]}</h6>
          </>
        );
      }
    });

    return (
      <>
        <tbody>
          <tr>
            <td>
              <h6>
                {this.props.student.firstname}, {this.props.student.lastname}
              </h6>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default AgentTodoList;
