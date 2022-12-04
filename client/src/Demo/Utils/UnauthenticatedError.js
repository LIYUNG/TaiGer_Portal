import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
import { BASE_URL } from '../../api/request';
// Status 401: cookies expired/ invalid cookie/ invalid authentication
class UnauthenticatedError extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>Session is expired. Please refresh the page and login again.</Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default UnauthenticatedError;
