import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

function TooManyRequestsError(props) {
  return (
    <Aux>
      <Row>
        <Col>
          <Card>Too many requests. Please try later.</Card>
        </Col>
      </Row>
    </Aux>
  );
}

export default TooManyRequestsError;
