import React from 'react';
import { Row, Card, Col, Table } from 'react-bootstrap';
import NoAgentsStudentsCard from '../../Dashboard/MainViewTab/NoAgentsStudentsCard/NoAgentsStudentsCard';
import NoEditorsStudentsCard from '../../Dashboard/MainViewTab/NoEditorsStudentsCard/NoEditorsStudentsCard';

class AssignEditorsPage extends React.Component {
  render() {
    const no_editor_students = this.props.students.map((student, i) => (
      <NoEditorsStudentsCard
        key={i}
        user={this.props.user}
        student={student}
        editEditor={this.props.editEditor}
        editor_list={this.props.editor_list}
        updateEditorList={this.props.updateEditorList}
        handleChangeEditorlist={this.props.handleChangeEditorlist}
        submitUpdateEditorlist={this.props.submitUpdateEditorlist}
      />
    ));

    return (
      <>
        <Row>
          <Col>
            <Card className="my-0 mx-0" bg={'danger'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  No Editors Students
                </Card.Title>
              </Card.Header>
              <Table
                responsive
                className="my-0 mx-0"
                variant="dark"
                text="light"
                size="sm"
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>First-, Last Name</th>
                    <th>Email</th>
                    <th>Target Year</th>
                    <th>Agent(s)</th>
                  </tr>
                </thead>
                <tbody>{no_editor_students}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default AssignEditorsPage;
