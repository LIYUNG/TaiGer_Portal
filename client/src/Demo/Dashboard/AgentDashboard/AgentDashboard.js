import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Card, Col, Row, Table } from "react-bootstrap";
import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import EditProgramsSubpage from "./EditProgramsSubpage";
import EditFilesSubpage from "./EditFilesSubpage";

class AgentDashboard extends React.Component {
  render() {
    return (
      // Overview template 2
      <>
        <tbody>
          <tr>
            <>
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
            </>
            {this.props.studentDocOverview}
          </tr>
        </tbody>
        <>
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
            documentlist2={this.props.documentlist2}
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

export default AgentDashboard;
