import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

class TooManyRequestsError extends React.Component {
  render() {
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
}

export default TooManyRequestsError;
