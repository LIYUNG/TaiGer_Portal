import React from "react";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";

import Aux from "../../hoc/_Aux";

class Settings extends React.Component {
  state = {
    error: null,
    role: "",
    isLoaded: false,
    data: null,
    success: false,
  };

  componentDidMount() {
    console.log("Setting index.js rendered");
    this.setState({ isLoaded: true });
  }
  render() {
    const { error, isLoaded } = this.state;
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <Aux>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Settings</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    {/* <Form> */}
                    <Form.Group controlId="form.firstname">
                      <Form.Label>Setting 1</Form.Label>
                      <Form.Control
                        type="text"
                        readOnly={true}
                        placeholder="Text"
                        autoComplete="nope"
                        value={this.props.user.firstname}
                      />
                    </Form.Group>
                    <Form.Group controlId="form.birthday">
                      <Form.Label>Some Date</Form.Label>
                      <Form.Control type="date" placeholder="Date of Birth" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="form.lastname">
                      <Form.Label>Setting 2</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Text"
                        readOnly={true}
                        value={this.props.user.lastname}
                      />
                    </Form.Group>
                    <br />
                    <Button variant="primary">Submit</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default Settings;
