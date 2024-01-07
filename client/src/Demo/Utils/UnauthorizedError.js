import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
import { appConfig } from '../../config';

// Status 403: Forbidden requests
function UnauthorizedError(props) {
  return (
    <Aux>
      <Row>
        <Col>
          <Card>
            Permission Denied. 請跟您的 {appConfig.companyName} 顧問聯繫
          </Card>
        </Col>
      </Row>
    </Aux>
  );
}

export default UnauthorizedError;
