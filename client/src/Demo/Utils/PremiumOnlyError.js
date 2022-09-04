import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

class PremiumOnlyError extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>This is for Premium only. Please contact our sales!</Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default PremiumOnlyError;
