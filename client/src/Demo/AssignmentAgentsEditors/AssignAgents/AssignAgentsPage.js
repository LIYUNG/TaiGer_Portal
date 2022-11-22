import React from 'react';
import { Row, Card, Col, Table } from 'react-bootstrap';
import NoAgentsStudentsCard from '../../Dashboard/MainViewTab/NoAgentsStudentsCard/NoAgentsStudentsCard';

class AssignAgentsPage extends React.Component {
  render() {
    const no_agent_students = this.props.students.map((student, i) => (
      <NoAgentsStudentsCard
        key={i}
        role={this.props.role}
        student={student}
        updateStudentArchivStatus={this.props.updateStudentArchivStatus}
        editAgent={this.props.editAgent}
        agent_list={this.props.agent_list}
        updateAgentList={this.props.updateAgentList}
        handleChangeAgentlist={this.props.handleChangeAgentlist}
        submitUpdateAgentlist={this.props.submitUpdateAgentlist}
      />
    ));

    return (
      <>
        <Row>
          <Col mx={0} my={0}>
            <Card
              className="my-0 mx-0  text-light"
              bg={'danger'}
              text={'white'}
            >
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  No Agents Students
                </Card.Title>
              </Card.Header>
              <Table
                responsive
                variant="dark"
                text="light"
                className="my-0 mx-0"
                size="sm"
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>First-, Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>{no_agent_students}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default AssignAgentsPage;
