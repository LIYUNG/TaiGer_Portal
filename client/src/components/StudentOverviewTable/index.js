import React from 'react';
import { Table, Card } from 'react-bootstrap';

import AgentReviewing from '../../Demo/Dashboard/MainViewTab/AgentReview/AgentReviewing';

class StudentOverviewTable extends React.Component {
  render() {
    const agent_reviewing = this.props.students.map((student, i) => (
      <AgentReviewing key={i} role={this.props.user.role} student={student} />
    ));

    return (
      <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
        <Table
          responsive
          bordered
          hover
          className="px-0 my-0 mx-0"
          variant="dark"
          text="light"
          size="sm"
        >
          <thead>
            <tr>
              <th>Target Year</th>
              <th>First-/Lastname,Birthday</th>
              <th>Agent</th>
              <th>Editor</th>
              <th>Graduated</th>
              <th>Program Selection</th>
              <th>Applications</th>
              <th>Next Program to apply</th>
              <th>Next Program deadline</th>
              <th>day left</th>
              <th>Next Program status</th>
              <th>Survey</th>
              <th>Base Documents</th>
              <th>Language</th>
              <th>Course Analysis</th>
              <th>CV</th>
              <th>ML</th>
              <th>RL</th>
              <th>Essay</th>
              <th>Portals</th>
              <th>Uni-Assist</th>
              <th>open/offer/reject</th>
            </tr>
          </thead>
          <tbody>{agent_reviewing}</tbody>
        </Table>
      </Card>
    );
  }
}

export default StudentOverviewTable;
