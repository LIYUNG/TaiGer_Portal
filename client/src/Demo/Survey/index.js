import React from "react";
import { Row, Col, Card, Form, Button, Spinner, Modal } from "react-bootstrap";

import Aux from "../../hoc/_Aux";
import {
  getMyAcademicBackground,
  updateAcademicBackground,
  updateLanguageSkill,
} from "../../api";
class Survey extends React.Component {
  state = {
    error: null,
    role: "",
    isLoaded: false,
    data: null,
    success: false,
    academic_background: {},
    updateconfirmed: false,
  };

  componentDidMount() {
    getMyAcademicBackground().then(
      (resp) => {
        const { data, success } = resp.data;
        console.log(data);
        if (success) {
          this.setState({
            isLoaded: true,
            academic_background: data,
            success: success,
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
    this.setState({ isLoaded: true });
  }

  handleChange_Academic = (e) => {
    console.log(e.target.value);
    console.log(e.target.id);
    e.preventDefault();
    var university_temp = { ...this.state.academic_background.university };
    university_temp[e.target.id] = e.target.value;
    console.log(university_temp);
    this.setState((state) => ({
      ...state,
      academic_background: {
        ...state.academic_background,
        university: university_temp,
      },
    }));
  };

  handleChange_Language = (e) => {
    console.log(e.target.value);
    console.log(e.target.id);
    e.preventDefault();
    var language_temp = { ...this.state.academic_background.language };
    language_temp[e.target.id] = e.target.value;
    console.log(language_temp);
    this.setState((state) => ({
      ...state,
      academic_background: {
        ...state.academic_background,
        language: language_temp,
      },
    }));
  };

  handleSubmit_AcademicBackground = (e, university) => {
    console.log(university);
    e.preventDefault();
    updateAcademicBackground(university).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          console.log(data);
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            academic_background: {
              ...state.academic_background,
              university: data,
            },
            success: success,
            updateconfirmed: true,
          }));
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  };

  handleSubmit_Language = (e, language) => {
    console.log(language);
    e.preventDefault();
    updateLanguageSkill(language).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            academic_background: {
              ...state.academic_background,
              language: data,
            },
            success: success,
            updateconfirmed: true,
          }));
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  };
  Bayerische_Formel = (high, low, my) => {
    if (high - low !== 0) {
      var Germen_note = 1 + (3 * (high - my)) / (high - low);
      return Germen_note.toFixed(2);
    }
    return 0;
  };

  onHide = () => {
    this.setState({
      updateconfirmed: false,
    });
  };

  setmodalhide = () => {
    this.setState({
      updateconfirmed: false,
    });
  };

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
        {this.state.success &&
        (this.props.user.role === "Student" ||
          this.props.user.role === "Guest") ? (
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
                        <Form.Group controlId="attended_university">
                          <Form.Label>University</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="National Taiwan University"
                            onChange={(e) => this.handleChange_Academic(e)}
                            defaultValue={
                              this.state.academic_background.university &&
                              this.state.academic_background.university
                                .attended_university
                                ? this.state.academic_background.university
                                    .attended_university
                                : ""
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="attended_university_program">
                          <Form.Label>
                            Program (Put together if double major)
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="B.Sc, Mechanical Engineering"
                            defaultValue={
                              this.state.academic_background.university &&
                              this.state.academic_background.university
                                .attended_university_program
                                ? this.state.academic_background.university
                                    .attended_university_program
                                : ""
                            }
                            onChange={(e) => this.handleChange_Academic(e)}
                          />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="isGraduated">
                          <Form.Label>Already graduated?</Form.Label>
                          <Form.Control
                            as="select"
                            defaultValue="No"
                            defaultValue={
                              this.state.academic_background.university &&
                              this.state.academic_background.university
                                .isGraduated
                                ? this.state.academic_background.university
                                    .isGraduated
                                : ""
                            }
                            onChange={(e) => this.handleChange_Academic(e)}
                          >
                            <option>Yes</option>
                            <option>No</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="expected_grad_date">
                          <Form.Label>Expected Application Year</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="2022 WS, 2023 SS"
                            defaultValue={
                              this.state.academic_background.university &&
                              this.state.academic_background.university
                                .expected_grad_date
                                ? this.state.academic_background.university
                                    .expected_grad_date
                                : ""
                            }
                            onChange={(e) => this.handleChange_Academic(e)}
                          />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="Highest_GPA_Uni">
                          <Form.Label>
                            Highest Score GPA of your university program
                          </Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="4.3"
                            defaultValue={
                              this.state.academic_background.university &&
                              this.state.academic_background.university
                                .Highest_GPA_Uni
                                ? this.state.academic_background.university
                                    .Highest_GPA_Uni
                                : 0
                            }
                            onChange={(e) => this.handleChange_Academic(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="Passing_GPA_Uni">
                          <Form.Label>
                            Passing Score GPA of your university program
                          </Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="1.7"
                            defaultValue={
                              this.state.academic_background.university &&
                              this.state.academic_background.university
                                .Passing_GPA_Uni
                                ? this.state.academic_background.university
                                    .Passing_GPA_Uni
                                : 0
                            }
                            onChange={(e) => this.handleChange_Academic(e)}
                          />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="My_GPA_Uni">
                          <Form.Label>My GPA</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="3.8"
                            defaultValue={
                              this.state.academic_background.university &&
                              this.state.academic_background.university
                                .My_GPA_Uni
                                ? this.state.academic_background.university
                                    .My_GPA_Uni
                                : 0
                            }
                            onChange={(e) => this.handleChange_Academic(e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="bayerische_formel">
                          <Form.Label>
                            Corresponding German GPA System:
                          </Form.Label>
                          <Form.Control
                            plaintext
                            readOnly
                            value={this.Bayerische_Formel(
                              this.state.academic_background.university
                                .Highest_GPA_Uni,
                              this.state.academic_background.university
                                .Passing_GPA_Uni,
                              this.state.academic_background.university
                                .My_GPA_Uni
                            )}
                          />
                        </Form.Group>
                        <br />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <br />
                        <Button
                          variant="primary"
                          onClick={(e) =>
                            this.handleSubmit_AcademicBackground(
                              e,
                              this.state.academic_background.university
                            )
                          }
                        >
                          Update
                        </Button>
                        <br />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Header>
                    <Card.Title as="h5">Languages</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <Form.Group controlId="english_certificate">
                          <Form.Label>English Certificate</Form.Label>
                          <Form.Control
                            as="select"
                            defaultValue={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .english_certificate
                                ? this.state.academic_background.language
                                    .english_certificate
                                : ""
                            }
                            onChange={(e) => this.handleChange_Language(e)}
                          >
                            <option>No</option>
                            <option>TOEFL</option>
                            <option>IELTS</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="english_score">
                          <Form.Label>English Test Score</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="(i.e. TOEFL: 94, or IELTS: 6.5) "
                            defaultValue={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .english_score
                                ? this.state.academic_background.language
                                    .english_score
                                : ""
                            }
                            disabled={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .english_certificate === "No"
                                ? true
                                : false
                            }
                            onChange={(e) => this.handleChange_Language(e)}
                          />
                        </Form.Group>
                        <br />
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="english_test_date">
                          <Form.Label>Expected Test Date</Form.Label>
                          <Form.Control
                            type="date"
                            defaultValue={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .english_test_date
                                ? this.state.academic_background.language
                                    .english_test_date
                                : ""
                            }
                            disabled={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .english_certificate === "No"
                                ? false
                                : true
                            }
                            placeholder="Date of English Test"
                            onChange={(e) => this.handleChange_Language(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group controlId="german_certificate">
                          <Form.Label>German Certificate</Form.Label>
                          <Form.Control
                            as="select"
                            defaultValue={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .german_certificate
                                ? this.state.academic_background.language
                                    .german_certificate
                                : ""
                            }
                            onChange={(e) => this.handleChange_Language(e)}
                          >
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
                      <Col md={4}>
                        <Form.Group controlId="german_score">
                          <Form.Label>German Test Score</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="(i.e. TestDaF: 4, or DSH: 2) "
                            defaultValue={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .german_score
                                ? this.state.academic_background.language
                                    .german_score
                                : ""
                            }
                            disabled={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .german_certificate === "No"
                                ? true
                                : false
                            }
                            onChange={(e) => this.handleChange_Language(e)}
                          />
                        </Form.Group>
                        <br />
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="german_test_date">
                          <Form.Label>Expected Test Date</Form.Label>
                          <Form.Control
                            type="date"
                            defaultValue={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .german_test_date
                                ? this.state.academic_background.language
                                    .german_test_date
                                : ""
                            }
                            disabled={
                              this.state.academic_background.language &&
                              this.state.academic_background.language
                                .german_certificate === "No"
                                ? false
                                : true
                            }
                            placeholder="Date of Germa Test"
                            onChange={(e) => this.handleChange_Language(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <br />
                        <Button
                          variant="primary"
                          onClick={(e) =>
                            this.handleSubmit_Language(
                              e,
                              this.state.academic_background.language
                            )
                          }
                        >
                          Update
                        </Button>
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
                            <Form.Label>Target Application Fields</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="M.Sc. Data Science, MBA, etc."
                            />
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
                        </Form>
                      </Col>
                      <Col md={6}>
                        <br />
                        <Button variant="primary">Update</Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Modal
              show={this.state.updateconfirmed}
              onHide={this.onHide}
              size="sm"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                  Update success
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Academic Background Surney is updated successfully!
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.setmodalhide}>Close</Button>
              </Modal.Footer>
            </Modal>
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
