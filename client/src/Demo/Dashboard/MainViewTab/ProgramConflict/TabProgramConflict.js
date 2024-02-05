import React from 'react';
import { Table, TableCell, TableHead, TableRow } from '@mui/material';

import ProgramConflict from './ProgramConflict';

function TabProgramConflict(props) {
  var conflict_map = {};
  var conflict_programs = {};

  for (let i = 0; i < props.students.length; i++) {
    if (props.students[i].applications)
      for (let j = 0; j < props.students[i].applications.length; j++) {
        // on decided program counts!
        if (
          props.students[i].applications[j].decided !== undefined &&
          props.students[i].applications[j].decided === 'O'
        ) {
          if (
            !Array.isArray(
              conflict_map[props.students[i].applications[j].programId._id]
            )
          ) {
            conflict_map[props.students[i].applications[j].programId._id] = [
              props.students[i]._id
            ];
            conflict_programs[props.students[i].applications[j].programId._id] =
              {
                school: props.students[i].applications[j].programId.school,
                program:
                  props.students[i].applications[j].programId.program_name,
                application_deadline:
                  props.students[i].applications[j].programId
                    .application_deadline
              };
          } else {
            conflict_map[props.students[i].applications[j].programId._id].push(
              props.students[i]._id
            );
          }
        }
      }
  }
  var conflict_program_ids = Object.keys(conflict_map);
  for (let i = 0; i < conflict_program_ids.length; i++) {
    if (conflict_map[conflict_program_ids[i]].length === 1) {
      delete conflict_map[conflict_program_ids[i]];
      delete conflict_programs[conflict_program_ids[i]];
    }
  }
  var conflicted_program = Object.keys(conflict_map);
  const program_conflict = conflicted_program.map((conf_program_id, i) => (
    <ProgramConflict
      key={i}
      students={props.students}
      conflict_map={conflict_map}
      conf_program_id={conf_program_id}
      conflict_programs={conflict_programs}
    />
  ));
  return (
    <>
      {program_conflict.length !== 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>University / Programs</TableCell>
              <TableCell>First-, Last Name</TableCell>
              <TableCell>Deadline</TableCell>
            </TableRow>
          </TableHead>
          {program_conflict}
        </Table>
      ) : (
        <></>
      )}
    </>
  );
}

export default TabProgramConflict;
