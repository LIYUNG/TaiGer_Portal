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
    // console.log(this.props.student.agents);
    if (
      this.props.student.agents === undefined ||
      this.props.student.agents.length === 0
    ) {
      studentsAgent = <h5 className="mb-1"> No Agent assigned</h5>;
    } else {
      studentsAgent = this.props.student.agents.map((agent, i) => (
        <>
          <h5 className="mb-1" key={i}>
            {agent.firstname}
            {", "}
            {agent.lastname}
          </h5>
          {agent.email}
        </>
      ));
    }
    if (
      this.props.student.editors === undefined ||
      this.props.student.editors.length === 0
    ) {
      studentsEditor = <h5 className="mb-1"> No Editor assigned</h5>;
    } else {
      studentsEditor = this.props.student.editors.map((editor, i) => (
        <>
          <h5 className="mb-1" key={i}>
            {editor.firstname}
            {", "}
            {editor.lastname}
          </h5>
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
                <h5>
                  {this.props.student.firstname}, {this.props.student.lastname}
                </h5>
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
