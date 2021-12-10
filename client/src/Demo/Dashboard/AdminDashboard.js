import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Card, Col, Row, Table } from "react-bootstrap";
import avatar1 from "../../assets/images/user/avatar-1.jpg";
import EditAgentsSubpage from "./EditAgentsSubpage";
import EditEditorsSubpage from "./EditEditorsSubpage";
import EditProgramsSubpage from "./EditProgramsSubpage";
import EditFilesSubpage from "./EditFilesSubpage";

class AdminDashboard extends React.Component {
  render() {
    return (
      // Overview template 2
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
                  eventKey="1"
                  onSelect={() =>
                    this.props.startEditingAgent(this.props.student)
                  }
                >
                  Edit Agent
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onSelect={() =>
                    this.props.startEditingEditor(this.props.student)
                  }
                >
                  Edit Editor
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onSelect={() => this.props.startEditingProgram()}
                >
                  Edit Program
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="4"
                  onSelect={() => this.props.startUploadfile()}
                >
                  Edit File Status
                </Dropdown.Item>
              </DropdownButton>
            </td>
            <td>
              {this.props.student.firstname_} /{this.props.student.lastname_}
            </td>
            {this.props.studentDocOverview}
          </tr>
        </tbody>
        <>
          <EditAgentsSubpage
            student={this.props.student}
            agent_list={this.props.agent_list}
            show={this.props.showAgentPage}
            onHide={this.props.setAgentModalhide}
            setmodalhide={this.props.setAgentModalhide}
            updateAgentList={this.props.updateAgentList}
            handleChangeAgentlist={this.props.handleChangeAgentlist}
            submitUpdateAgentlist={this.props.submitUpdateAgentlist}
          />
          <EditEditorsSubpage
            student={this.props.student}
            editor_list={this.props.editor_list}
            show={this.props.showEditorPage}
            onHide={this.props.setEditorModalhide}
            setmodalhide={this.props.setEditorModalhide}
            updateEditorList={this.props.updateEditorList}
            handleChangeEditorlist={this.props.handleChangeEditorlist}
            submitUpdateEditorlist={this.props.submitUpdateEditorlist}
          />
          <EditProgramsSubpage
            student={this.props.student}
            show={this.props.showProgramPage}
            onHide={this.props.setProgramModalhide}
            setmodalhide={this.props.setProgramModalhide}
            onDeleteProgram={this.props.onDeleteProgram}
          />
          <EditFilesSubpage
            student={this.props.student}
            documentslist={this.props.documentslist}
            show={this.props.showFilePage}
            onHide={this.props.setFilesModalhide}
            setmodalhide={this.props.setFilesModalhide}
            onFileChange={this.props.onFileChange}
            submitFile={this.props.submitFile}
            onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
            onRejectFilefromstudent={this.props.onRejectFilefromstudent}
            onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
            onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          />
        </>
      </>
      //   </Card.Body>
      // </Card>
    );
  }
}

export default AdminDashboard;
