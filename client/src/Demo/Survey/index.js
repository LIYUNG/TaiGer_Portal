import React from "react";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";

import Aux from "../../hoc/_Aux";

class Survey extends React.Component {
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
        {this.props.user.role === "Student" ||
        this.props.user.role === "Guest" ? (
          <>
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title as="h5">Academic Background Surney</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>University</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="National Taiwan University"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>
                            Program (Put together if double major)
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="B.Sc, Mechanical Engineering"
                          />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>Already graduated?</Form.Label>
                          <Form.Control as="select" defaultValue="No">
                            <option>Yes</option>
                            <option>No</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>Expected Application Year</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="2022 WS, 2023 SS"
                          />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>
                            Highest Score GPA of your university program
                          </Form.Label>
                          <Form.Control type="text" placeholder="4.3" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>
                            Passing Score GPA of your university program
                          </Form.Label>
                          <Form.Control type="text" placeholder="1.7" />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>GPA</Form.Label>
                          <Form.Control type="text" placeholder="3.8" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>
                            Corresponding German GPA System:
                          </Form.Label>
                          <Form.Control plaintext readOnly defaultValue={1.5} />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>English Certificate</Form.Label>
                          <Form.Control as="select" defaultValue="No">
                            <option>No</option>
                            <option>TOEFL</option>
                            <option>IELTS</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>English Test Score</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="(i.e. TOEFL: 94, or IELTS: 6.5) "
                          />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>German Certificate</Form.Label>
                          <Form.Control as="select" defaultValue="No">
                            <option>No</option>
                            <option>Goethe Zertifikat A2</option>
                            <option>Goethe Zertifikat B1</option>
                            <option>Goethe Zertifikat B2</option>
                            <option>Goethe Zertifikat C1</option>
                            <option>TestDaF</option>
                            <option>DSH</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>German Test Score</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="(i.e. TestDaF: 4, or DSH: 2) "
                          />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlSelect22">
                          <Form.Label>
                            Corresponding German GPA System:
                          </Form.Label>
                          <Form.Control
                            type="number"
                            step={0.01}
                            placeholder="3.8"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <br />
                        <Button variant="primary">Submit</Button>
                        <br />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title as="h5">Application Preference</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form>
                          <Form.Group controlId="form.firstname">
                            <Form.Label>Firstname</Form.Label>
                            <Form.Control type="text" placeholder="Text" />
                          </Form.Group>
                          <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>
                              Universities outsid Germany?
                            </Form.Label>
                            <Form.Control as="select" defaultValue="No">
                              <option>Yes</option>
                              <option>No</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>
                              Considering Private Universities? (Tuition Fee)
                            </Form.Label>
                            <Form.Control as="select" defaultValue="No">
                              <option>Yes</option>
                              <option>No</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="formBasicChecbox">
                            <Form.Check type="checkbox" label="Check me out" />
                          </Form.Group>
                        </Form>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                          <Form.Label>Expected Application Year</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="2022 WS, 2023 SS"
                          />
                        </Form.Group>
                        <br />
                        <Button variant="primary">Submit</Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
        {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
      </Aux>
    );
  }
}

export default Survey;
