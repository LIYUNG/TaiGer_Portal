import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { updateLanguageSkill } from '../../api';
import { convertDate } from '../Utils/contants';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import {
  check_academic_background_filled,
  check_application_preference_filled
} from '../Utils/checking-functions';
import {
  APPLICATION_YEARS_FUTURE,
  EXPECTATION_APPLICATION_YEARS
} from '../Utils/contants';
class SurveyEditableComponent extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    role: '',
    isLoaded: this.props.isLoaded,
    academic_background: this.props.academic_background,
    application_preference: this.props.application_preference,
    updateconfirmed: false,
    changed_academic: false,
    changed_language: false,
    changed_application_preference: false
  };

  handleChange_ApplicationPreference = (e) => {
    e.preventDefault();
    var application_preference_temp = { ...this.state.application_preference };
    application_preference_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      changed_application_preference: true,
      application_preference: application_preference_temp
    }));
  };

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
    if (e.target.id === 'english_certificate') {
      if (e.target.value === 'No') {
        language_temp['english_score'] = '';
      } else {
        language_temp['english_test_date'] = '';
      }
    }
    if (e.target.id === 'german_certificate') {
      if (e.target.value === 'No') {
        language_temp['german_score'] = '';
      } else {
        language_temp['german_test_date'] = '';
      }
    }
    this.setState((state) => ({
      ...state,
      changed_language: true,
      academic_background: {
        ...state.academic_background,
        language: language_temp
      }
    }));
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

    // if (!isLoaded) {
    //   return (
    //     <div style={style}>
    //       <Spinner animation="border" role="status">
    //         <span className="visually-hidden"></span>
    //       </Spinner>
    //     </div>
    //   );
    // }
    return (
      <Aux>
        {(!check_academic_background_filled(this.props.academic_background) ||
          !check_application_preference_filled(
            this.props.application_preference
          )) && (
          <Row>
            <Col>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Body>
                  The followings information are still missing:{' '}
                  {this.props.academic_background &&
                    !this.props.academic_background.university
                      .attended_high_school && (
                      <li>
                        <b>High School Name</b>
                      </li>
                    )}
                  {this.props.academic_background &&
                    !this.props.academic_background.university
                      .attended_university && (
                      <li>
                        <b>University Name</b>
                      </li>
                    )}{' '}
                  {this.props.academic_background &&
                    !this.props.academic_background.university
                      .program_name && (
                      <li>
                        <b>University Program</b>
                      </li>
                    )}
                  {this.props.application_preference &&
                    !this.props.application_preference
                      .expected_application_date && (
                      <li>
                        <b>Expected Application Year</b>
                      </li>
                    )}
                  {this.props.application_preference &&
                    !this.props.application_preference
                      .expected_application_semester && (
                      <li>
                        <b>Expected Application Semester</b>
                      </li>
                    )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Academic Background Surney
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <h4 className="my-2 mx-0 text-light">High School</h4>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="attended_high_school">
                      <Form.Label className="my-0 mx-0 text-light">
                        High School Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Taipei First Girls' High School"
                        onChange={(e) => this.handleChange_Academic(e)}
                        defaultValue={
                          this.state.academic_background.university &&
                          this.state.academic_background.university
                            .attended_high_school
                            ? this.state.academic_background.university
                                .attended_high_school
                            : ''
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="high_school_graduated_year">
                      <Form.Label className="my-0 mx-0 text-light">
                        High School Gradate Year
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="2022"
                        defaultValue={
                          this.state.academic_background.university &&
                          this.state.academic_background.university
                            .high_school_graduated_year
                            ? this.state.academic_background.university
                                .high_school_graduated_year
                            : ''
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      />
                    </Form.Group>
                    <br />
                  </Col>
                </Row>
                <Row>
                  <h4 className="my-2 mx-0 text-light">University</h4>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="attended_university">
                      <Form.Label className="my-0 mx-0 text-light">
                        University Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="National Taiwan University / Not study yet"
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
                      <Form.Label className="my-0 mx-0 text-light">
                        University Program (Put together if double major)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="B.Sc, Mechanical Engineering / Not study yet"
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
                      <Form.Label className="my-0 mx-0 text-light">
                        Already graduated?
                      </Form.Label>
                      <Form.Control
                        as="select"
                        defaultValue={
                          this.state.academic_background.university &&
                          this.state.academic_background.university.isGraduated
                            ? this.state.academic_background.university
                                .isGraduated
                            : '-'
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      >
                        <option>-</option>
                        <option>Yes</option>
                        <option>No</option>
                      </Form.Control>
                    </Form.Group>
                    <br />
                  </Col>
                  {this.state.academic_background.university &&
                    this.state.academic_background.university.isGraduated !==
                      '-' && (
                      <Col md={6}>
                        <Form.Group controlId="expected_grad_date">
                          <Form.Label className="my-0 mx-0 text-light">
                            {this.state.academic_background.university
                              .isGraduated === 'No' && 'Expected Graduate Year'}
                            {this.state.academic_background.university
                              .isGraduated === 'Yes' && 'Graduated Year'}
                          </Form.Label>
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
                            <>{APPLICATION_YEARS_FUTURE()}</>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    )}
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="Highest_GPA_Uni">
                      <Form.Label className="my-0 mx-0 text-light">
                        Highest Score GPA of your university program (TODO: add
                        instruction)
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
                      <Form.Label className="my-0 mx-0 text-light">
                        Passing Score GPA of your university program (TODO: add
                        instruction)
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
                      <Form.Label className="my-0 mx-0 text-light">
                        My GPA (TODO: add instruction)
                      </Form.Label>
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
                      <Form.Label className="my-0 mx-0 text-light">
                        Corresponding German GPA System:
                      </Form.Label>
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
                  <Col md={10} className="my-0 mx-0 text-light">
                    <br />
                    {/* <br /> */}
                    Last update at:{' '}
                    {this.props.academic_background.university &&
                    this.props.academic_background.university.updatedAt
                      ? convertDate(
                          this.props.academic_background.university.updatedAt
                        )
                      : ''}
                  </Col>
                  <Col md={2}>
                    <br />
                    <Button
                      variant="primary"
                      disabled={!this.state.changed_academic}
                      onClick={(e) =>
                        this.props.handleSubmit_AcademicBackground(
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
            {/* TODO () : frontend and backend not connected. */}
            <Card className="my-4 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Application Preference
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="expected_application_date">
                      <Form.Label className="my-0 mx-0 text-light">
                        Expected Application Year
                      </Form.Label>
                      <Form.Control
                        as="select"
                        defaultValue={
                          this.state.application_preference &&
                          this.state.application_preference
                            .expected_application_date
                            ? this.state.application_preference
                                .expected_application_date
                            : ''
                        }
                        onChange={(e) =>
                          this.handleChange_ApplicationPreference(e)
                        }
                      >
                        <option value="">Please Select</option>
                        <>{EXPECTATION_APPLICATION_YEARS()}</>
                      </Form.Control>
                    </Form.Group>
                    <br />
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="expected_application_semester">
                      <Form.Label className="my-0 mx-0 text-light">
                        Expected Application Semester
                      </Form.Label>
                      <Form.Control
                        as="select"
                        defaultValue={
                          this.state.application_preference &&
                          this.state.application_preference
                            .expected_application_semester
                            ? this.state.application_preference
                                .expected_application_semester
                            : ''
                        }
                        onChange={(e) =>
                          this.handleChange_ApplicationPreference(e)
                        }
                      >
                        <option value="">Please Select</option>
                        <option value="WS">
                          Winter Semester (Semester begins on October)
                        </option>
                        <option value="SS">
                          Summer Semester (Semester begins on April)
                        </option>
                        <option value="WSSS">Winter + Summer Semester</option>
                      </Form.Control>
                    </Form.Group>
                    <br />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form>
                      <Form.Group
                        controlId="target_application_field"
                        className="my-0 mx-0"
                      >
                        <Form.Label className="my-0 mx-0 text-light">
                          Target Application Fields
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="M.Sc. Data Science, MBA, etc."
                          defaultValue={
                            this.state.application_preference &&
                            this.state.application_preference
                              .target_application_field
                              ? this.state.application_preference
                                  .target_application_field
                              : ''
                          }
                          onChange={(e) =>
                            this.handleChange_ApplicationPreference(e)
                          }
                        />
                      </Form.Group>
                      <Form.Group
                        controlId="application_outside_germany"
                        className="my-4 mx-0"
                      >
                        <Form.Label className="my-0 mx-0 text-light">
                          Considering universities outsid Germany?
                        </Form.Label>
                        <Form.Control
                          as="select"
                          defaultValue={
                            this.state.application_preference &&
                            this.state.application_preference
                              .application_outside_germany
                              ? this.state.application_preference
                                  .application_outside_germany
                              : '-'
                          }
                          onChange={(e) =>
                            this.handleChange_ApplicationPreference(e)
                          }
                        >
                          <option value="-">Please Select</option>
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group
                        controlId="considered_privat_universities"
                        className="my-0 mx-0"
                      >
                        <Form.Label className="my-0 mx-0 text-light">
                          Considering private universities? (Tuition Fee: ~15000
                          EURO/year)
                        </Form.Label>
                        <Form.Control
                          as="select"
                          defaultValue={
                            this.state.application_preference &&
                            this.state.application_preference
                              .considered_privat_universities
                              ? this.state.application_preference
                                  .considered_privat_universities
                              : '-'
                          }
                          onChange={(e) =>
                            this.handleChange_ApplicationPreference(e)
                          }
                        >
                          <option value="-">Please Select</option>
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>{' '}
                <Row>
                  <Col md={10} className="my-0 mx-0 text-light">
                    <br />
                    {/* <br /> */}
                    Last update at:{' '}
                    {this.props.application_preference &&
                    this.props.application_preference.updatedAt
                      ? convertDate(this.props.application_preference.updatedAt)
                      : ''}
                  </Col>
                  <Col md={2}>
                    <br />
                    <Button
                      variant="primary"
                      disabled={!this.state.changed_application_preference}
                      onClick={(e) =>
                        this.props.handleSubmit_ApplicationPreference(
                          e,
                          this.state.application_preference
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
                <Card.Title className="my-0 mx-0 text-light">
                  Languages
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="english_certificate">
                      <Form.Label className="my-0 mx-0 text-light">
                        English Certificate
                      </Form.Label>
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
                      <Form.Label className="my-0 mx-0 text-light">
                        English Test Score
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="(i.e. TOEFL: 94, or IELTS: 6.5) "
                        value={
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
                      <Form.Label className="my-0 mx-0 text-light">
                        Expected Test Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={
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
                      <Form.Label className="my-0 mx-0 text-light">
                        German Certificate
                      </Form.Label>
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
                      <Form.Label className="my-0 mx-0 text-light">
                        German Test Score
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="(i.e. TestDaF: 4, or DSH: 2) "
                        value={
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
                      <Form.Label className="my-0 mx-0 text-light">
                        Expected Test Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={
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
                  <Col md={10} className="my-0 mx-0 text-light">
                    <br />
                    {/* <br /> */}
                    Last update at:{' '}
                    {this.props.academic_background.language &&
                    this.props.academic_background.language.updatedAt
                      ? convertDate(
                          this.props.academic_background.language.updatedAt
                        )
                      : ''}
                  </Col>
                  <Col md={2}>
                    <br />
                    <Button
                      variant="primary"
                      disabled={!this.state.changed_language}
                      onClick={(e) =>
                        this.props.handleSubmit_Language(
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
        {/* 
        {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )} */}
      </Aux>
    );
  }
}

export default SurveyEditableComponent;
