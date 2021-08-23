import React from "react";
// import { FaBeer } from 'react-icons/fa';
import {
  AiOutlineLoading3Quarters,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineStop,
} from "react-icons/ai";
import { Card, Col, Row } from "react-bootstrap";

import { Dropdown, DropdownButton } from "react-bootstrap";
import avatar1 from "../../assets/images/user/avatar-1.jpg";
import EditAgentsSubpage from "./EditAgentsSubpage";
import EditEditorsSubpage from "./EditEditorsSubpage";
import EditProgramsSubpage from "./EditProgramsSubpage";
import EditFilesSubpage from "./EditFilesSubpage";

class EditableStudent extends React.Component {
  state = {
    showAgentPage: false,
    showEditorPage: false,
    showProgramPage: false,
    showFilePage: false,
    student: this.props.student,
  };

  setAgentModalhide = () => {
    this.setState({
      showAgentPage: false,
    });
  };

  startEditingAgent = (student) => {
    console.log("startEditingAgent");
    console.log(student);
    this.props.editAgent(student);
    this.setState({
      subpage: 1,
      showAgentPage: true,
    });
  };

  setEditorModalhide = () => {
    this.setState({
      showEditorPage: false,
    });
  };

  startEditingEditor = (student) => {
    console.log("startEditingEditor");
    console.log(student);
    this.props.editEditor(student);
    this.setState({
      subpage: 2,
      showEditorPage: true,
    });
  };

  setProgramModalhide = () => {
    this.setState({
      showProgramPage: false,
    });
  };

  startEditingProgram = () => {
    console.log("startEditingProgram");
    this.setState({
      showProgramPage: true,
    });
  };

  setFilesModalhide = () => {
    this.setState({
      showFilePage: false,
    });
  };

  startUploadfile = () => {
    console.log("startUploadfile");
    this.setState({
      showFilePage: true,
    });
  };

  onRejectFilefromstudent = (e, category, id) => {
    let stud = { ...this.state.student };
    stud.uploadedDocs_[category].uploadStatus_ = "unaccepted";
    console.log(stud);
    this.props.onRejectFilefromstudent(e, category, id);
    this.setState({
      student: stud,
    });
  };

  onAcceptFilefromstudent = (e, category, id) => {
    let stud = { ...this.state.student };
    stud.uploadedDocs_[category].uploadStatus_ = "checked";
    console.log(stud);
    this.props.onAcceptFilefromstudent(e, category, id);
    this.setState({
      student: stud,
    });
  };

  onDeleteFilefromstudent = (e, category, id) => {
    // TODO: delete this.state.student[document]
    let stud = { ...this.state.student };
    delete stud.uploadedDocs_[category];
    console.log(stud);
    this.props.onDeleteFilefromstudent(e, category, id);
    this.setState({
      student: stud,
    });
  };

  render() {
    let studentDocOverview;
    if (this.state.student.uploadedDocs_) {
      studentDocOverview = this.props.documentslist.map((doc, i) => {
        if (
          this.state.student.uploadedDocs_[doc.prop] &&
          this.state.student.uploadedDocs_[doc.prop].uploadStatus_ ===
            "uploaded"
        ) {
          return (
            <p className="m-0" key={i}>
              {" "}
              <AiOutlineLoading3Quarters /> {doc.name} :{" "}
              {this.state.student.uploadedDocs_[doc.prop].uploadStatus_}
            </p>
          );
        } else if (
          this.state.student.uploadedDocs_[doc.prop] &&
          this.state.student.uploadedDocs_[doc.prop].uploadStatus_ === "checked"
        ) {
          return (
            <p className="m-0" key={i}>
              <AiOutlineCheck /> {doc.name} :{" "}
              {this.state.student.uploadedDocs_[doc.prop].uploadStatus_}
            </p>
          );
        } else if (
          this.state.student.uploadedDocs_[doc.prop] &&
          this.state.student.uploadedDocs_[doc.prop].uploadStatus_ ===
            "unaccepted"
        ) {
          return (
            <p className="m-0" key={i}>
              <AiOutlineStop /> {doc.name} :{" "}
              {this.state.student.uploadedDocs_[doc.prop].uploadStatus_}
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
    if (
      this.props.role === "Agent" ||
      this.props.role === "Editor" ||
      this.props.role === "Admin"
    ) {
      return (
        <Card key={this.props.student._id}>
          <Card.Header>
            <Card.Title as="h5">
              {this.props.student.firstname_} {this.props.student.lastname_}
              Email: {this.props.student.emailaddress_}
              <DropdownButton
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.state.student._id}`}
                key={this.state.student._id}
              >
                <Dropdown.Item
                  eventKey="1"
                  onSelect={() => this.startEditingAgent(this.state.student)}
                >
                  Edit Agent
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onSelect={() => this.startEditingEditor(this.state.student)}
                >
                  Edit Editor
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onSelect={() => this.startEditingProgram()}
                >
                  Edit Program
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="4"
                  onSelect={() => this.startUploadfile()}
                >
                  Edit File Status
                </Dropdown.Item>
              </DropdownButton>
            </Card.Title>
          </Card.Header>
          <tr key={this.state.student._id}>
            <td>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar1}
                alt="activity-user"
              />
            </td>
            <td>
              <h5 className="m-0">Document status</h5>
              {studentDocOverview}
            </td>
            <td>
              <h5>Agent:</h5>
              {this.state.student.agent_.map((agent, i) => (
                <p className="m-0" key={i}>
                  {agent}
                </p>
              ))}
              <h5>Editor:</h5>
              {this.state.student.editor_.map((editor, i) => (
                <p className="m-0" key={i}>
                  {editor}
                </p>
              ))}
            </td>
            <td>
              <h5>Programs:</h5>
              {this.state.student.applying_program_.map((program, i) => (
                <h6 key={i}>
                  {program.University_} {program.Program_}{" "}
                </h6>
              ))}
            </td>
            <EditAgentsSubpage
              student={this.state.student}
              agent_list={this.props.agent_list}
              show={this.state.showAgentPage}
              onHide={this.setAgentModalhide}
              setmodalhide={this.setAgentModalhide}
              updateAgentList={this.props.updateAgentList}
              handleChangeAgentlist={this.props.handleChangeAgentlist}
              submitUpdateAgentlist={this.props.submitUpdateAgentlist}
            />
            <EditEditorsSubpage
              student={this.state.student}
              editor_list={this.props.editor_list}
              show={this.state.showEditorPage}
              onHide={this.setEditorModalhide}
              setmodalhide={this.setEditorModalhide}
              updateEditorList={this.props.updateEditorList}
              handleChangeEditorlist={this.props.handleChangeEditorlist}
              submitUpdateEditorlist={this.props.submitUpdateEditorlist}
            />
            <EditProgramsSubpage
              student={this.state.student}
              show={this.state.showProgramPage}
              onHide={this.setProgramModalhide}
              setmodalhide={this.setProgramModalhide}
              onDeleteProgram={this.props.onDeleteProgram}
            />
            <EditFilesSubpage
              student={this.state.student}
              documentslist={this.props.documentslist}
              show={this.state.showFilePage}
              onHide={this.setFilesModalhide}
              setmodalhide={this.setFilesModalhide}
              onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
              onRejectFilefromstudent={this.onRejectFilefromstudent}
              onAcceptFilefromstudent={this.onAcceptFilefromstudent}
              onDeleteFilefromstudent={this.onDeleteFilefromstudent}
            />
          </tr>
        </Card>
      );
    } else if (this.props.role === "Student") {
      return (
        <Card>
          <Card.Header>
            <Card.Title as="h5">
              {this.props.student.firstname_} {this.props.student.lastname_}
              Email: {this.props.student.emailaddress_}
            </Card.Title>
          </Card.Header>
          <tr key={this.state.student._id}>
            <td>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar1}
                alt="activity-user"
              />
            </td>
            <td>
              <h5 className="m-0">Document status</h5>
              {studentDocOverview}
            </td>
            <td>
              <h5>Agent:</h5>
              {this.state.student.agent_.map((agent, i) => (
                <p className="m-0" key={i}>
                  {agent}
                </p>
              ))}
              <h5>Editor:</h5>
              {this.state.student.editor_.map((editor, i) => (
                <p className="m-0" key={i}>
                  {editor}
                </p>
              ))}
            </td>
            <td>
              <h5>Programs:</h5>
              {this.state.student.applying_program_.map((program, i) => (
                <h6 key={i}>
                  {program.University_} {program.Program_}{" "}
                </h6>
              ))}
            </td>
          </tr>
        </Card>
      );
    } else {
      return (
        <Card>
          <Card.Header>
            <Card.Title as="h5">
              {this.props.student.firstname_} {this.props.student.lastname_}
              Email: {this.props.student.emailaddress_}
            </Card.Title>
          </Card.Header>
          <tr key={this.state.student._id}>
            <td>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar1}
                alt="activity-user"
              />
            </td>
            <td>
              <h5 className="m-0">Document status</h5>
              {studentDocOverview}
            </td>
            <td>
              <h5>Agent:</h5>
              {this.state.student.agent_.map((agent, i) => (
                <p className="m-0" key={this.props.i}>
                  {agent}
                </p>
              ))}
              <h5>Editor:</h5>
              {this.state.student.editor_.map((editor, i) => (
                <p className="m-0" key={this.props.i}>
                  {editor}
                </p>
              ))}
            </td>
            <td>
              <h5>Programs:</h5>
              {this.state.student.applying_program_.map((program, i) => (
                <h6 key={this.props.i}>
                  {program.University_} {program.Program_}{" "}
                </h6>
              ))}
            </td>
          </tr>
        </Card>
      );
    }
  }
}

export default EditableStudent;
