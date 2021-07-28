import React from "react";
import { Table } from "react-bootstrap";
import {
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import StudentListSubpage from "./StudentListSubpage";
import EditableStudentlist from "./EditableStudentlist";

import EditAgentsSubpage from "./EditAgentsSubpage";
import EditEditorsSubpage from "./EditEditorsSubpage";
import EditProgramsSubpage from "./EditProgramsSubpage";
import EditFilesSubpage from "./EditFilesSubpage";
// import UcFirst from "../../App/components/UcFirst";

class Studentlist extends React.Component {
  render() {
    const stdlist = this.props.students.map((student, i) => (
      <EditableStudentlist
        key={student._id}
        student={student}
        i={i}
        startEditingAgent={this.props.startEditingAgent}
        startEditingEditor={this.props.startEditingEditor}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        startUploadfile={this.props.startUploadfile}
        role={this.props.role}
      />
    ));

    return (
      <>
        <Table responsive>
          <tbody>{stdlist}</tbody>
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
        {/* <EditAgentsSubpage
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
        /> */}
        {/* <EditEditorsSubpage />
        <EditProgramsSubpage />
        <EditFilesSubpage /> */}
      </>
    );
  }
}

export default Studentlist;
