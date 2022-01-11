import React from "react";
import { Table } from "react-bootstrap";
import ProgramConflict from "./ProgramConflict";

class TabProgramConflict extends React.Component {
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
          conflict_map[
            this.props.students[i].applications[j].programId._id
          ].push(this.props.students[i]._id);
        }
      }
    }
    let conflict_program_ids = Object.keys(conflict_map);
    for (let i = 0; i < conflict_program_ids.length; i++) {
      if (conflict_map[conflict_program_ids[i]].length === 1) {
        delete conflict_map[conflict_program_ids[i]];
        delete conflict_programs[conflict_program_ids[i]];
      }
    }
    let conflicted_program = Object.keys(conflict_map);
    const program_conflict = conflicted_program.map((conf_program_id, i) => (
      <ProgramConflict
        key={i}
        students={this.props.students}
        conflict_map={conflict_map}
        conf_program_id={conf_program_id}
        conflict_programs={conflict_programs}
        startEditingProgram={this.props.startEditingProgram}
        startUploadfile={this.props.startUploadfile}
        onDeleteProgram={this.props.onDeleteProgram}
      />
    ));
    return (
      <>
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
      </>
    );
  }
}

export default TabProgramConflict;
