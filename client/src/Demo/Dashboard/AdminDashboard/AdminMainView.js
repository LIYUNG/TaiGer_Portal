import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";
// import AdminDashboard from "./AdminDashboard";
import StudDocsDashboard from "../MainViewTab/StudDocsOverview/StudDocsDashboard";
import AdminTodoList from "./AdminTodoList";
import EditorDocsProgress from "../MainViewTab/EditorDocsProgress/EditorDocsProgress";
import ProgramConflict from "./ProgramConflict";
import ApplicationProgress from "./ApplicationProgress";

class AdminMainView extends React.Component {
  render() {
    let conflict_map = new Object();
    let conflict_programs = new Object();

    for (let i = 0; i < this.props.students.length; i++) {
      for (let j = 0; j < this.props.students[i].applications.length; j++) {
        if (
          !Array.isArray(
            conflict_map[this.props.students[i].applications[j].programId._id]
          )
        ) {
          // console.log(this.props.students[i].applications[j].programId._id);
          conflict_map[this.props.students[i].applications[j].programId._id] = [
            this.props.students[i]._id,
          ];
          conflict_programs[
            this.props.students[i].applications[j].programId._id
          ] = {
            University_:
              this.props.students[i].applications[j].programId.University_,
            Program_: this.props.students[i].applications[j].programId.Program_,
            Application_end_date_:
              this.props.students[i].applications[j].programId
                .Application_end_date_,
          };
        } else {
          // console.log(this.props.students[i].applications[j].programId._id);
          conflict_map[
            this.props.students[i].applications[j].programId._id
          ].push(this.props.students[i]._id);
        }
      }
    }
    let conflict_program_ids = Object.keys(conflict_map);
    // Delete non-conflict keys(program_id)
    for (let i = 0; i < conflict_program_ids.length; i++) {
      if (conflict_map[conflict_program_ids[i]].length === 1) {
        delete conflict_map[conflict_program_ids[i]];
        delete conflict_programs[conflict_program_ids[i]];
      }
    }

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
    const agent_todo = this.props.students.map((student, i) => (
      <AdminTodoList
        key={i}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        agenttodolist={this.props.agenttodolist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        agent_list={this.props.agent_list}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));

    const student_editor = this.props.students.map((student, i) => (
      <EditorDocsProgress
        key={i}
        role={this.props.role}
        student={student}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    let conflicted_program = Object.keys(conflict_map);
    const program_conflict = conflicted_program.map((conf_program_id, i) => (
      <ProgramConflict
        key={i}
        students={this.props.students}
        conflict_map={conflict_map}
        conf_program_id={conf_program_id}
        conflict_programs={conflict_programs}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        startUploadfile={this.props.startUploadfile}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        onDeleteProgram={this.props.onDeleteProgram}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
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
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    let header = Object.values(this.props.documentlist2);
    // console.log(header)
    return (
      <>
        <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
          <Tab eventKey="w" title="Student Documents Overview">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th></th>
                    <th>First-/Last Name</th>
                  </>
                  {header.map((name, index) => (
                    <th key={index}>{name}</th>
                  ))}
                </tr>
              </thead>
              {stdlist}
            </Table>
          </Tab>
          <Tab eventKey="x" title="Agent TODO">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>First-/Last Name</th>
                  </>
                  {this.props.agenttodolist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))}
                </tr>
              </thead>
              {agent_todo}
            </Table>
          </Tab>
          <Tab eventKey="y" title="Editor & Docs Progress">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>First-/Last Name</th>
                    <th>University</th>
                    <th>Programs</th>
                    <th>Deadline</th>
                  </>
                  {this.props.documentsprogresslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))}
                </tr>
              </thead>
              {student_editor}
            </Table>
          </Tab>
          <Tab eventKey="xz" title="Program Conflicts">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>University</th>
                    <th>Programs</th>
                    <th>First-/Last Name</th>
                    <th>Deadline</th>
                  </>
                </tr>
              </thead>
              {program_conflict}
            </Table>
          </Tab>
          <Tab eventKey="z" title="Application Overview">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>First-/Last Name</th>
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
        </Tabs>
      </>
    );
  }
}

export default AdminMainView;
