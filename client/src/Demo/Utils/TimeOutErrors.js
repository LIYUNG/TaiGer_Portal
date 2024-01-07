import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

function TimeOutErrors(props) {
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

export default TimeOutErrors;
