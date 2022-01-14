import React from "react";
import { Row, Col, Table, Tabs, Tab } from "react-bootstrap";
import Card from "../../../App/components/MainCard";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
import TabStudDocsDashboard from "../MainViewTab/StudDocsOverview/TabStudDocsDashboard";
import AgentTodoList from "./AgentTodoList";
import TabEditorDocsProgress from "../MainViewTab/EditorDocsProgress/TabEditorDocsProgress";
import TabProgramConflict from "../MainViewTab/ProgramConflict/TabProgramConflict";
import ApplicationProgress from "../MainViewTab/ApplicationProgress/ApplicationProgress";

class AgentMainView extends React.Component {
  render() {
    const agent_todo = this.props.students.map((student, i) => (
      <AgentTodoList
        key={i}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        agenttodolist={this.props.agenttodolist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));

    const application_progress = this.props.students.map((student, i) => (
      <ApplicationProgress
        key={i}
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

    return (
      <>
        <Row>
          <Col sm={12}>
            <Card title="Agent: To Do">
              <Table responsive>
                <thead>
                  <tr>
                    <>
                      <th>First-, Last Name</th>
                    </>
                    {this.props.agenttodolist.map((doc, index) => (
                      <th key={index}>{doc.name}</th>
                    ))}
                  </tr>
                </thead>
                {agent_todo}
              </Table>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
              <Tab eventKey="w" title="Student Documents Overview">
                <TabStudDocsDashboard
                  role={this.props.role}
                  students={this.props.students}
                  editAgent={this.props.editAgent}
                  editEditor={this.props.editEditor}
                  startEditingEditor={this.props.startEditingEditor}
                  startEditingProgram={this.props.startEditingProgram}
                  documentslist={this.props.documentslist}
                  documentlist2={this.props.documentlist2}
                  startUploadfile={this.props.startUploadfile}
                  agent_list={this.props.agent_list}
                  editor_list={this.props.editor_list}
                  onDeleteProgram={this.props.onDeleteProgram}
                  onDownloadFilefromstudent={
                    this.props.onDownloadFilefromstudent
                  }
                  onRejectFilefromstudent={this.props.onRejectFilefromstudent}
                  onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
                  onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
                  updateAgentList={this.props.updateAgentList}
                  handleChangeAgentlist={this.props.handleChangeAgentlist}
                  submitUpdateAgentlist={this.props.submitUpdateAgentlist}
                  updateEditorList={this.props.updateEditorList}
                  handleChangeEditorlist={this.props.handleChangeEditorlist}
                  submitUpdateEditorlist={this.props.submitUpdateEditorlist}
                  SYMBOL_EXPLANATION={this.props.SYMBOL_EXPLANATION}
                  updateStudentArchivStatus={
                    this.props.updateStudentArchivStatus
                  }
                  isDashboard={this.props.isDashboard}
                />
              </Tab>
              <Tab eventKey="y" title="Editor & Docs Progress">
                <TabEditorDocsProgress
                  role={this.props.role}
                  students={this.props.students}
                  startEditingProgram={this.props.startEditingProgram}
                  documentslist={this.props.documentslist}
                  documentsprogresslist={this.props.documentsprogresslist}
                  documenheader={this.props.documenheader}
                  startUploadfile={this.props.startUploadfile}
                  onDownloadFilefromstudent={
                    this.props.onDownloadFilefromstudent
                  }
                  onRejectFilefromstudent={this.props.onRejectFilefromstudent}
                  onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
                  onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
                />
              </Tab>
              <Tab eventKey="z" title="Application Overview">
                <Table responsive>
                  <thead>
                    <tr>
                      <>
                        <th>First-, Last Name</th>
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
              </Tab>
              <Tab eventKey="zz" title="Program Conflicts">
                <TabProgramConflict
                  students={this.props.students}
                  startEditingProgram={this.props.startEditingProgram}
                  startUploadfile={this.props.startUploadfile}
                  onDeleteProgram={this.props.onDeleteProgram}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </>
    );
  }
}

export default AgentMainView;
