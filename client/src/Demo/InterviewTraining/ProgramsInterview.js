import React from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner,
  Modal
} from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { getCVMLRLOverview } from '../../api';

class ProgramsInterview extends React.Component {
  render() {
    console.log(this.props.interviews);
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
          <Table>
            <tbody>{interviews}</tbody>
          </Table>
        </Col>
      </>
    );
  }
}

export default ProgramsInterview;
