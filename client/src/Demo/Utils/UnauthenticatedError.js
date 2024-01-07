import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
// Status 401: cookies expired/ invalid cookie/ invalid authentication
function UnauthenticatedError(props) {
  return (
    <Aux>
      <Row>
        <Col>
          <Card>
            Session is expired. Please refresh the page and login again.
          </Card>
        </Col>
      </Row>
    </Aux>
  );
}

export default UnauthenticatedError;
