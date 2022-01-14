import React from "react";
import { Row, Col, Table, Tabs, Tab } from "react-bootstrap";
import Card from "../../../App/components/MainCard";
import StudentMyself from "./StudentMyself";
import TabEditorDocsProgress from "../MainViewTab/EditorDocsProgress/TabEditorDocsProgress";
import ApplicationProgress from "../MainViewTab/ApplicationProgress/ApplicationProgress";
class StudentMainView extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <StudentMyself
        key={i}
        role={this.props.role}
        student={student}
        documentlist2={this.props.documentlist2}
      />
    ));

    const application_progress = this.props.students.map((student, i) => (
      <ApplicationProgress
        key={i}
        role={this.props.role}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        onDeleteProgram={this.props.onDeleteProgram}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));

    const your_editors = this.props.students.map((student, i) =>
      student.editors ? (
        student.editors.map((editor, i) => (
          <tr>
            <td>
              {editor.firstname} - {editor.lastname}
            </td>
            <td>{editor.email}</td>
          </tr>
        ))
      ) : (
        <></>
      )
    );

    const your_agents = this.props.students.map((student, i) =>
      student.agents ? (
        student.agents.map((agent, i) => (
          <tr>
            <td>
              {agent.firstname} - {agent.lastname}
            </td>
            <td>{agent.email}</td>
          </tr>
        ))
      ) : (
        <></>
      )
    );

    return (
      <>
        <Row>
          <Col md={6}>
            <Card title="Agent">
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>{your_agents}</tbody>
              </Table>
            </Card>
          </Col>
          <Col md={6}>
            <Card title="Editor">
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>First-, Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>{your_editors}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card title="My Editor & Docs Progress">
              <TabEditorDocsProgress
                role={this.props.role}
                students={this.props.students}
                startEditingProgram={this.props.startEditingProgram}
                documentslist={this.props.documentslist}
                documentsprogresslist={this.props.documentsprogresslist}
                documenheader={this.props.documenheader}
                startUploadfile={this.props.startUploadfile}
                onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
                onRejectFilefromstudent={this.props.onRejectFilefromstudent}
                onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
                onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card title="My Application Progress">
              <Table responsive>
                <thead>
                  <tr>
                    <>
                      {this.props.role !== "Student" ? (
                        <th>First-, Last Name</th>
                      ) : (
                        <></>
                      )}
                      <th>University</th>
                      <th>Programs</th>
                      <th>Deadline</th>
                    </>
                    {this.props.programstatuslist.map((doc, index) => (
                      <th key={index}>{doc.name}</th>
                    ))}
                  </tr>
                </thead>
                {application_progress}
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs defaultActiveKey="x" id="uncontrolled-tab-example">
              <Tab eventKey="x" title="My Uploaded Documents">
                <Table responsive>
                  <thead>
                    <tr>
                      {/* <>
                        <th>First-, Last Name</th>
                      </> */}
                      {this.props.documentslist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  {stdlist}
                  {this.props.SYMBOL_EXPLANATION}
                </Table>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </>
    );
  }
}

export default StudentMainView;
