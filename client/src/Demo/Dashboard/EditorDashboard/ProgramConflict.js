import React from "react";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";

import { Card, Col, Row } from "react-bootstrap";

import { Dropdown, DropdownButton } from "react-bootstrap";
import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import { uploadforstudent } from "../../../api";
// import ConflictStatus from "./ConflictStatus";

class ProgramConflict extends React.Component {
  state = {
    students: this.props.students,
    file: "",
  };

  render() {

    let studs_id = this.props.conflict_map[this.props.conf_program_id];
    let stds = studs_id.map((k, i) => (
      <h5>
        {this.props.students.find((stud) => stud._id === studs_id[i]).firstname}
        ,{" "}
        {this.props.students.find((stud) => stud._id === studs_id[i]).lastname}
      </h5>
    ));

    return (
      <>
        <tbody>
          <tr>
            <td>
              <h5>
                {
                  this.props.conflict_programs[this.props.conf_program_id]
                    .University_
                }
              </h5>
            </td>
            <td>
              <h5>
                {
                  this.props.conflict_programs[this.props.conf_program_id]
                    .Program_
                }
              </h5>
            </td>
            <td>{stds}</td>
            <td>
              <h5>
                {
                  this.props.conflict_programs[this.props.conf_program_id]
                    .Application_end_date_
                }
              </h5>
            </td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default ProgramConflict;
