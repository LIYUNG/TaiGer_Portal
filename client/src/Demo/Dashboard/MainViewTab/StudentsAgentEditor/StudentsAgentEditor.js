import React from "react";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import { uploadforstudent } from "../../../../api";

class StudentsAgentEditor extends React.Component {
  render() {
    let studentsAgent;
    let studentsEditor;
    if (
      this.props.student.agents === undefined ||
      this.props.student.agents.length === 0
    ) {
      studentsAgent = <h6 className="mb-1"> No Agent assigned</h6>;
    } else {
      studentsAgent = this.props.student.agents.map((agent, i) => (
        <>
          <h6 className="mb-1" key={i}>
            {agent.firstname}
            {", "}
            {agent.lastname}
          </h6>
          {agent.email}
        </>
      ));
    }
    if (
      this.props.student.editors === undefined ||
      this.props.student.editors.length === 0
    ) {
      studentsEditor = <h6 className="mb-1"> No Editor assigned</h6>;
    } else {
      studentsEditor = this.props.student.editors.map((editor, i) => (
        <>
          <h6 className="mb-1" key={i}>
            {editor.firstname}
            {", "}
            {editor.lastname}
          </h6>
          {editor.email}
        </>
      ));
    }
    return (
      <>
        <tbody>
          <tr>
            {this.props.role !== "Student" ? (
              <td>
                <h6>
                  {this.props.student.firstname}, {this.props.student.lastname}
                </h6>
                {this.props.student.email}
              </td>
            ) : (
              <></>
            )}
            <td>{studentsAgent}</td>
            <td>{studentsEditor}</td>
            <td></td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default StudentsAgentEditor;
