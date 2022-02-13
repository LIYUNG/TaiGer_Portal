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
      />
    ));
    return (
      <>
        <Table responsive>
          <thead>
            <tr>
              <>
                {this.props.role !== "Student" && <th>First-, Last Name</th>}
                <th>Type</th>
                <th>Document</th>
                <th></th>
                <th>Deadline</th>
              </>
              {window.documentsprogresslist.map((doc, index) => (
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
