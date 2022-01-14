import React from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
} from "react-bootstrap";

import Aux from "../../hoc/_Aux";

class FormsElements extends React.Component {
  render() {
    return (
      <Aux>
        {this.props.user.role === "Student" ? (
          <>
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
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title as="h5">Academic Performance</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form>
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
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Personal Data</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    {/* <Form> */}
                    <Form.Group controlId="form.firstname">
                      <Form.Label>Firstname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Text"
                        default="firstname"
                        autoComplete="off"
                      />
                    </Form.Group>
                    <Form.Group controlId="form.birthday">
                      <Form.Label>Birthday Date</Form.Label>
                      <Form.Control type="date" placeholder="Date of Birth" />
                      {/* <Form.Text className="text-muted">
                          We'll never share your email with anyone else.
                        </Form.Text> */}
                    </Form.Group>

                    <Form.Group controlId="form.BasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    {/* </Form> */}
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="form.lastname">
                      <Form.Label>Lastname</Form.Label>
                      <Form.Control type="text" placeholder="Text" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={this.props.user.email}
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Example select</Form.Label>
                      <Form.Control as="select">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Form.Control> 
                    </Form.Group>*/}
                    <Form.Group controlId="formBasicChecbox">
                      <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary">Submit</Button>
                  </Col>
                </Row>
                {/* <h5 className="mt-5">Sizing</h5>
                <hr />
                <Row>
                  <Col md={6}>
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Large text"
                      className="mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control size="lg" as="select" className="mb-3">
                      <option>Large select</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Form.Control>
                    <Form.Control as="select" className="mb-3">
                      <option>Default select</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Form.Control>
                  </Col>
                </Row>
                <h5 className="mt-5">Inline</h5>
                <hr />
                <Row>
                  <Col>
                    <Form inline>
                      <Form.Group className="mb-2 mr-5">
                        <Form.Label srOnly>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                      </Form.Group>
                      <Form.Group>
                        <Button className="mb-0">Confirm Identity</Button>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default FormsElements;
