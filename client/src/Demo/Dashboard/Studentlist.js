import React from "react";
// import { FaBeer } from 'react-icons/fa';
import {
  AiFillCheckCircle,
  AiOutlineLoading3Quarters,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineStop,
} from "react-icons/ai";
import { Row, Col, Table, Form, Modal } from "react-bootstrap";
import {
  Button,
  // OverlayTrigger,
  // Tooltip,
  // ButtonToolbar,
  Dropdown,
  DropdownButton,
  // SplitButton
} from "react-bootstrap";
import avatar1 from "../../assets/images/user/avatar-1.jpg";
import StudentListSubpage from "./StudentListSubpage";
// import avatar2 from '../../assets/images/user/avatar-2.jpg';
// import avatar3 from '../../assets/images/user/avatar-3.jpg';
// import Aux from "../../hoc/_Aux";
// import UcFirst from "../../App/components/UcFirst";



const row = (
  student,
  i,
  header,
  handleRemove,
  startEditingAgent,
  startEditingEditor,
  startEditingProgram,
  // editIdx,
  handleChange,
  // stopEditing,
  RemoveProgramHandler3,
  // cancelEditing,
  documentslist,
  startUploadfile
) => {
  // const currentlyEditing = editIdx === i;
  let studentDocOverview;
  if (student.uploadedDocs_) {
    studentDocOverview = documentslist.map((doc, i) => {
      if (
        student.uploadedDocs_[doc.prop] &&
        student.uploadedDocs_[doc.prop].uploadStatus_ === "uploaded"
      ) {
        return (
          <p className="m-0" key={i}>
            {" "}
            <AiOutlineLoading3Quarters /> {doc.name} :{" "}
            {student.uploadedDocs_[doc.prop].uploadStatus_}
          </p>
        );
      } else if (
        student.uploadedDocs_[doc.prop] &&
        student.uploadedDocs_[doc.prop].uploadStatus_ === "checked"
      ) {
        return (
          <p className="m-0" key={i}>
            <AiOutlineCheck /> {doc.name} :{" "}
            {student.uploadedDocs_[doc.prop].uploadStatus_}
          </p>
        );
      } else if (
        student.uploadedDocs_[doc.prop] &&
        student.uploadedDocs_[doc.prop].uploadStatus_ === "unaccepted"
      ) {
        return (
          <p className="m-0" key={i}>
            <AiOutlineStop /> {doc.name} :{" "}
            {student.uploadedDocs_[doc.prop].uploadStatus_}
          </p>
        );
      } else {
        return (
          <p className="m-0" key={i}>
            <b>
              <AiOutlineClose /> {doc.name}{" "}
            </b>
          </p>
        );
      }
    });
  } else {
    studentDocOverview = <p>So far no uploaded file!</p>;
  }
  return (
    <tr key={student._id}>
      <>
        <td>
          <img
            className="rounded-circle"
            style={{ width: "40px" }}
            src={avatar1}
            alt="activity-user"
          />
        </td>
        <td>
          <h6 className="mb-1">
            {student.firstname_} {student.lastname_}
          </h6>
          <p className="m-1">{student.emailaddress_}</p>
          <h6 className="m-0">Document status</h6>
          {studentDocOverview}
        </td>
        <td>
          <h5>Agent:</h5>
          {student.agent_.map((agent, i) => (
            <p className="m-0" key={i}>
              {agent}
            </p>
          ))}
          <h5>Editor:</h5>
          {student.editor_.map((editor, i) => (
            <p className="m-0" key={i}>
              {editor}
            </p>
          ))}
        </td>
        <td>
          <h5>Programs:</h5>
          {student.applying_program_.map(
            (program, i) => (
              <h6 key={i}>
                {program.University_} {program.Program_}{" "}
              </h6>
            )
          )}
        </td>
        <th>
          <DropdownButton
            size="sm"
            title="Option"
            variant="primary"
            id={`dropdown-variants-${student._id}`}
            key={student._id}
          >
            <Dropdown.Item eventKey="1" onSelect={() => startEditingAgent(i)}>
              Edit Agent
            </Dropdown.Item>
            <Dropdown.Item eventKey="2" onSelect={() => startEditingEditor(i)}>
              Edit Editor
            </Dropdown.Item>
            <Dropdown.Item eventKey="3" onSelect={() => startEditingProgram(i)}>
              Edit Program
            </Dropdown.Item>
            <Dropdown.Item eventKey="4" onSelect={() => startUploadfile(i)}>
              Edit File Status
            </Dropdown.Item>
          </DropdownButton>
        </th>
        {/* <Row>
                    <h4>{student._id}</h4>
                </Row> */}
      </>
    </tr>
  );
};

class Studentlist extends React.Component {
  render() {
    return (
      <>
        <Table responsive>
          <tbody>
            {this.props.students.map((student, i) =>
              row(
                student,
                i,
                this.props.header,
                this.props.handleRemove,
                this.props.startEditingAgent,
                this.props.startEditingEditor,
                this.props.startEditingProgram,
                // this.props.editIdx,
                this.props.handleChange,
                // this.props.stopEditing,
                this.props.RemoveProgramHandler3,
                // this.props.cancelEditing,
                this.props.documentslist,
                this.props.startUploadfile
              )
            )}
          </tbody>
        </Table>
        <StudentListSubpage
          agent_list={this.props.agent_list}
          editor_list={this.props.editor_list}
          show={this.props.ModalShow}
          onHide={this.props.setmodalhide}
          setmodalhide={this.props.setmodalhide}
          subpage={this.props.subpage}
          student_i={this.props.student_i} // student order
          students={this.props.students}
          documentslist={this.props.documentslist}
          onDeleteProgram={this.props.onDeleteProgram}
          onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
          onRejectFilefromstudent={this.props.onRejectFilefromstudent}
          onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
          onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          updateAgentList={this.props.updateAgentList}
          handleChangeAgentlist={this.props.handleChangeAgentlist}
          submitUpdateAgentlist={this.props.submitUpdateAgentlist}
          updateEditorList={this.props.updateEditorList}
          handleChangeEditorlist={this.props.handleChangeEditorlist}
          submitUpdateEditorlist={this.props.submitUpdateEditorlist}
        />
      </>
    );
  }
}

export default Studentlist;
