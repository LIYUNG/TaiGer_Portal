import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
// import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

class PageNotFoundError extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h4>Page Not Found!</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default PageNotFoundError;
