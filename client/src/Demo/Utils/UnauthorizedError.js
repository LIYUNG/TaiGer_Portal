import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

// Status 403: Forbidden requests
class UnauthorizedError extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>請跟您的TaiGer顧問聯繫</Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default UnauthorizedError;
