import React from "react";
import { Table } from "react-bootstrap";
import EditorDocsProgress from "./EditorDocsProgress";
class TabEditorDocsProgress extends React.Component {
  render() {
    const student_editor = this.props.students.map((student, i) => (
      <EditorDocsProgress
        key={i}
        student={student}
        role={this.props.role}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));
    return (
      <>
        <Table responsive>
          <thead>
            <tr>
              <>
                <th></th>
                {this.props.role !== "Student" ? (
                  <th>First-/Last Name</th>
                ) : (
                  <></>
                )}
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
      </>
    );
  }
}
export default TabEditorDocsProgress;
