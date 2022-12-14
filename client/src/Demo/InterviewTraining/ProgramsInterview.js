import React from 'react';
import { Col, Table, Spinner, Modal } from 'react-bootstrap';

class ProgramsInterview extends React.Component {
  render() {
    const interviews = this.props.interviews.map((intervi, i) => (
      <>
        <tr>
          {intervi.program_id.school} {intervi.program_id.program_name}
        </tr>
      </>
    ));
    return (
      <>
        <Col>
          <Table size="sm">
            <tbody>{interviews}</tbody>
          </Table>
        </Col>
      </>
    );
  }
}

export default ProgramsInterview;
