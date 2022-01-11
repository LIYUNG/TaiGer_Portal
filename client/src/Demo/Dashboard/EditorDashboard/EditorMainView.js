import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";
import StudDocsDashboard from "../MainViewTab/StudDocsOverview/StudDocsDashboard";
import TabEditorDocsProgress from "../MainViewTab/EditorDocsProgress/TabEditorDocsProgress";
import TabProgramConflict from "../MainViewTab/ProgramConflict/TabProgramConflict";

class EditorMainView extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <StudDocsDashboard
        key={i}
        role={this.props.role}
        student={student}
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
    ));

    return (
      <>
        <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
          <Tab eventKey="w" title="Student Overview">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th></th>
                    <th>First-/Last Name</th>
                  </>
                  {this.props.documentslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))}
                </tr>
              </thead>
              {stdlist}
            </Table>
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
              onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
              onRejectFilefromstudent={this.props.onRejectFilefromstudent}
              onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
              onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
            />
          </Tab>
          <Tab eventKey="z" title="Program Conflicts">
            <TabProgramConflict
              students={this.props.students}
              startEditingProgram={this.props.startEditingProgram}
              startUploadfile={this.props.startUploadfile}
              onDeleteProgram={this.props.onDeleteProgram}
            />
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default EditorMainView;
