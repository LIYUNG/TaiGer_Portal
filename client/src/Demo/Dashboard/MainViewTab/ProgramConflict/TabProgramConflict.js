import React from 'react';
import { Row, Card, Table, Col } from 'react-bootstrap';
import ProgramConflict from './ProgramConflict';

class TabProgramConflict extends React.Component {
  render() {
    var conflict_map = {};
    var conflict_programs = {};

    for (let i = 0; i < this.props.students.length; i++) {
      if (this.props.students[i].applications)
        for (let j = 0; j < this.props.students[i].applications.length; j++) {
          // on decided program counts!
          if (
            this.props.students[i].applications[j].decided !== undefined &&
            this.props.students[i].applications[j].decided === 'O'
          ) {
            if (
              !Array.isArray(
                conflict_map[
                  this.props.students[i].applications[j].programId._id
                ]
              )
            ) {
              conflict_map[
                this.props.students[i].applications[j].programId._id
              ] = [this.props.students[i]._id];
              conflict_programs[
                this.props.students[i].applications[j].programId._id
              ] = {
                school: this.props.students[i].applications[j].programId.school,
                program:
                  this.props.students[i].applications[j].programId.program_name,
                application_deadline:
                  this.props.students[i].applications[j].programId
                    .application_deadline
              };
            } else {
              conflict_map[
                this.props.students[i].applications[j].programId._id
              ].push(this.props.students[i]._id);
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
        students={this.props.students}
        conflict_map={conflict_map}
        conf_program_id={conf_program_id}
        conflict_programs={conflict_programs}
      />
    ));
    return (
      <>
        {program_conflict.length !== 0 ? (
          <Row>
            <Col sm={12}>
              <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Header>
                  <Card.Title>Program Conflicts</Card.Title>
                </Card.Header>
                <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                >
                  <thead>
                    <tr>
                      <th>University / Programs</th>
                      <th>First-, Last Name</th>
                      <th>Deadline</th>
                    </tr>
                  </thead>
                  {program_conflict}
                </Table>
              </Card>
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default TabProgramConflict;
