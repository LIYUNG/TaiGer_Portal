import React from "react";
import { Table, Tabs, Tab } from "react-bootstrap";
import EditorStudents from "./EditorStudents";
import EditorDocsProgress from "./EditorDocsProgress";
import ProgramConflict from "./ProgramConflict";

class EditorMainView extends React.Component {
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
            Application_end_date_: this.props.students[i].applications[j].programId.Application_end_date_,
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
      <EditorStudents
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
    const student_editor = this.props.students.map((student, i) => (
      <EditorDocsProgress
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
    let conflicted_program = Object.keys(conflict_map);
    // console.log(conflict_map);
    // console.log(conflicted_program);
    // console.log(conflict_programs);
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
          <Tab eventKey="z" title="Program Conflicts">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th>University</th>
                    <th>Programs</th>
                    <th>First-/Last Name</th>
                    <th>Deadline</th>
                  </>
                  {/* {this.props.documentsprogresslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))} */}
                </tr>
              </thead>
              {program_conflict}
            </Table>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default EditorMainView;
