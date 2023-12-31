import { Card, Col, Row } from 'react-bootstrap';

export const TopBar = ({ children }) => {
  return (
    <Row className="sticky-top ">
      <Col>
        <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
          <Card.Header text={'dark'}>
            <Card.Title>
              <Row>
                <Col className="my-0 mx-0 text-light">{children}</Col>
              </Row>
            </Card.Title>
          </Card.Header>
        </Card>
      </Col>
    </Row>
  );
};
