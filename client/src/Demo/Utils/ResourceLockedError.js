import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

// Status 423: Forbidden requests
function ResourceLockedError(props) {
  return (
    <Aux>
      <Row>
        <Col>
          <Card>The resource is locked and can not be changed.</Card>
        </Col>
      </Row>
    </Aux>
  );
}

export default ResourceLockedError;
