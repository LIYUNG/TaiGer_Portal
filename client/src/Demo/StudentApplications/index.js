import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
// import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';

class StudentApplication extends React.Component {
  render() {
    return (
      <Aux>
        <Row>
          <Col>
            {this.props.user.role === 'Guest' ? (
              <Card className="mt-0">
                <Card.Header>
                  <Card.Title as="h5">
                    {' '}
                    {this.props.user.firstname} {this.props.user.lastname}
                  </Card.Title>
                </Card.Header>
              </Card>
            ) : (
              <>
                <Card className="mt-0">
                  <Card.Header>
                    <Card.Title as="h5">
                      {' '}
                      {this.props.user.firstname} {this.props.user.lastname}
                    </Card.Title>
                  </Card.Header>
                  <Card.Body></Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default StudentApplication;
