import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { updateAcademicBackground, updateLanguageSkill } from '../../api';
import { convertDate } from '../Utils/contants';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

class SurveyComponent extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    role: '',
    isLoaded: this.props.isLoaded,
    student_id: this.props.student_id,
    success: false,
    academic_background: this.props.academic_background,
    updateconfirmed: false,
    changed_academic: false,
    changed_language: false
  };
  componentDidMount() {
    if (!this.props.student_id) {
      this.setState((state) => ({
        ...state,
        student_id: this.props.user._id
      }));
    }
  }
  componentDidUpdate(prevProps) {
    // 常見用法（別忘了比較 prop）：
    if (prevProps.academic_background !== this.props.academic_background) {
      this.setState((state) => ({
        ...state,
        academic_background: this.props.academic_background
      }));
    }
  }

  handleChange_Academic = (e) => {
    e.preventDefault();
    var university_temp = { ...this.state.academic_background.university };
    university_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      changed_academic: true,
      academic_background: {
        ...state.academic_background,
        university: university_temp
      }
    }));
  };

  handleChange_Language = (e) => {
    e.preventDefault();
    var language_temp = { ...this.state.academic_background.language };
    language_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      changed_language: true,
      academic_background: {
        ...state.academic_background,
        language: language_temp
      }
    }));
  };

  handleSubmit_AcademicBackground = (e, university) => {
    e.preventDefault();
    updateAcademicBackground(university, this.state.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            changed_academic: false,
            academic_background: {
              ...state.academic_background,
              university: data
            },
            success: success,
            updateconfirmed: true
          }));
        } else {
         if (resp.status === 401) {
           this.setState({ isLoaded: true, timeouterror: true });
         } else if (resp.status === 403) {
           this.setState({ isLoaded: true, unauthorizederror: true });
         }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };

  handleSubmit_Language = (e, language) => {
    e.preventDefault();
    updateLanguageSkill(language, this.state.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            changed_language: true,
            academic_background: {
              ...state.academic_background,
              language: data
            },
            success: success,
            updateconfirmed: true
          }));
        } else {
          if (resp.status === 401) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
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
      updateconfirmed: false
    });
  };

  setmodalhide = () => {
    this.setState({
      updateconfirmed: false
    });
  };

  render() {
    const { unauthorizederror, timeouterror, isLoaded } = this.state;

    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
        </div>
      );
    }
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

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
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title>Academic Background Surney</Card.Title>
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
                            : ''
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
                            : ''
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
                          this.state.academic_background.university.isGraduated
                            ? this.state.academic_background.university
                                .isGraduated
                            : ''
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
                      <Form.Label>Expected Graduate Year</Form.Label>
                      <Form.Control
                        as="select"
                        value={
                          this.state.academic_background.university &&
                          this.state.academic_background.university
                            .expected_grad_date
                            ? this.state.academic_background.university
                                .expected_grad_date
                            : ''
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      >
                        <option value="">Please Select</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </Form.Control>
                    </Form.Group>
                    <br />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="expected_application_date">
                      <Form.Label>Expected Application Year</Form.Label>
                      <Form.Control
                        as="select"
                        value={
                          this.state.academic_background.university &&
                          this.state.academic_background.university
                            .expected_application_date
                            ? this.state.academic_background.university
                                .expected_application_date
                            : ''
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      >
                        <option value="">Please Select</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </Form.Control>
                    </Form.Group>
                    <br />
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="expected_application_semester">
                      <Form.Label>Expected Application Semester</Form.Label>
                      <Form.Control
                        as="select"
                        value={
                          this.state.academic_background.university &&
                          this.state.academic_background.university
                            .expected_application_semester
                            ? this.state.academic_background.university
                                .expected_application_semester
                            : ''
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      >
                        <option value="">Please Select</option>
                        <option value="WS">Winter Semester</option>
                        <option value="SS">Summer Semester</option>
                        <option value="WSSS">Winter + Summer Semester</option>
                      </Form.Control>
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
                          this.state.academic_background.university.My_GPA_Uni
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="bayerische_formel">
                      <Form.Label>Corresponding German GPA System:</Form.Label>
                      <p className="text-info">
                        {this.state.academic_background.university &&
                        this.state.academic_background.university.My_GPA_Uni &&
                        this.state.academic_background.university
                          .Passing_GPA_Uni &&
                        this.state.academic_background.university
                          .Highest_GPA_Uni
                          ? this.Bayerische_Formel(
                              this.state.academic_background.university
                                .Highest_GPA_Uni,
                              this.state.academic_background.university
                                .Passing_GPA_Uni,
                              this.state.academic_background.university
                                .My_GPA_Uni
                            )
                          : 0}
                      </p>
                    </Form.Group>

                    <br />
                  </Col>
                </Row>
                <Row>
                  <Col md={10}>
                    <br />
                    {/* <br /> */}
                    Last update at:{' '}
                    {this.state.academic_background.university &&
                    this.state.academic_background.university.updatedAt
                      ? convertDate(
                          this.state.academic_background.university.updatedAt
                        )
                      : ''}
                  </Col>
                  <Col md={2}>
                    <br />
                    <Button
                      variant="primary"
                      disabled={!this.state.changed_academic}
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
            <Card className="my-4 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title>Languages</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="english_certificate">
                      <Form.Label>English Certificate</Form.Label>
                      <Form.Control
                        as="select"
                        value={
                          this.state.academic_background.language &&
                          this.state.academic_background.language
                            .english_certificate
                            ? this.state.academic_background.language
                                .english_certificate
                            : ''
                        }
                        onChange={(e) => this.handleChange_Language(e)}
                      >
                        <option value="No">No</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="IELTS">IELTS</option>
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
                          this.state.academic_background.language.english_score
                            ? this.state.academic_background.language
                                .english_score
                            : ''
                        }
                        disabled={
                          this.state.academic_background.language &&
                          this.state.academic_background.language
                            .english_certificate === 'No'
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
                            : ''
                        }
                        disabled={
                          this.state.academic_background.language &&
                          this.state.academic_background.language
                            .english_certificate === 'No'
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
                        value={
                          this.state.academic_background.language &&
                          this.state.academic_background.language
                            .german_certificate
                            ? this.state.academic_background.language
                                .german_certificate
                            : ''
                        }
                        onChange={(e) => this.handleChange_Language(e)}
                      >
                        <option value="No">No</option>
                        <option value="Goethe Zertifikat A2">
                          Goethe Zertifikat A2
                        </option>
                        <option value="Goethe Zertifikat B1">
                          Goethe Zertifikat B1
                        </option>
                        <option value="Goethe Zertifikat B2">
                          Goethe Zertifikat B2
                        </option>
                        <option value="Goethe Zertifikat C1">
                          Goethe Zertifikat C1
                        </option>
                        <option value="TestDaF">TestDaF</option>
                        <option value="DSH">DSH</option>
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
                          this.state.academic_background.language.german_score
                            ? this.state.academic_background.language
                                .german_score
                            : ''
                        }
                        disabled={
                          this.state.academic_background.language &&
                          this.state.academic_background.language
                            .german_certificate === 'No'
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
                            : ''
                        }
                        disabled={
                          this.state.academic_background.language &&
                          this.state.academic_background.language
                            .german_certificate === 'No'
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
                  <Col md={10}>
                    <br />
                    {/* <br /> */}
                    Last update at:{' '}
                    {this.state.academic_background.language &&
                    this.state.academic_background.language.updatedAt
                      ? convertDate(
                          this.state.academic_background.language.updatedAt
                        )
                      : ''}
                  </Col>
                  <Col md={2}>
                    <br />
                    <Button
                      variant="primary"
                      disabled={!this.state.changed_language}
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
        {/* TODO () : frontend and backend not connected. */}
        <Row>
          <Col>
            <Card className="my-4 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title>Application Preference</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form>
                      <Form.Group
                        controlId="form.firstname"
                        className="my-0 mx-0"
                      >
                        <Form.Label>Target Application Fields</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="M.Sc. Data Science, MBA, etc."
                        />
                      </Form.Group>
                      <Form.Group
                        controlId="exampleForm.ControlSelect1"
                        className="my-4 mx-0"
                      >
                        <Form.Label>Universities outsid Germany?</Form.Label>
                        <Form.Control as="select" defaultValue="No">
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group
                        controlId="exampleForm.ControlSelect1"
                        className="my-0 mx-0"
                      >
                        <Form.Label>
                          Considering Private Universities? (Tuition Fee)
                        </Form.Label>
                        <Form.Control as="select" defaultValue="No">
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Control>
                      </Form.Group>
                    </Form>
                    <Col md={6}>
                      <br />
                      <Button variant="primary">Update</Button>
                    </Col>
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

export default SurveyComponent;
