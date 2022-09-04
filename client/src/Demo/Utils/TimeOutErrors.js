import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

class TimeOutErrors extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>Time out error. Please login again!</Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default TimeOutErrors;
