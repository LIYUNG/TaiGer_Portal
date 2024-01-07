import React from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Offcanvas,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import {
  ENGLISH_CERTIFICATE_OPTIONS,
  GERMAN_CERTIFICATE_OPTIONS,
  GMAT_CERTIFICATE_OPTIONS,
  GRE_CERTIFICATE_OPTIONS,
  IS_PASSED_OPTIONS,
  TRI_STATE_OPTIONS,
  convertDate
} from '../Utils/contants';
import { FiExternalLink } from 'react-icons/fi';
import {
  check_academic_background_filled,
  check_languages_filled,
  check_application_preference_filled,
  // showButtonIfMyStudent,
  missing_survey_fields_list
} from '../Utils/checking-functions';
import {
  APPLICATION_YEARS_FUTURE,
  EXPECTATION_APPLICATION_YEARS,
  profile_name_list,
  getNumberOfDays
} from '../Utils/contants';
import Banner from '../../components/Banner/Banner';
import InputFormSelect from './InputForms/InputFormSelect';
import { AiFillQuestionCircle } from 'react-icons/ai';
class SurveyEditableComponent extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    role: '',
    survey_link: this.props.survey_link,
    isLoaded: this.props.isLoaded,
    academic_background: this.props.academic_background,
    application_preference: this.props.application_preference,
    updateconfirmed: false,
    changed_academic: false,
    changed_language: false,
    changed_application_preference: false,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  };
  componentDidUpdate(prevProps, prevState) {
    // 常見用法（別忘了比較 prop）：
    if (
      prevProps.student_id !== this.props.student_id ||
      prevProps.academic_background !== this.props.academic_background ||
      prevProps.application_preference !== this.props.application_preference
    ) {
      this.setState((state) => ({
        ...state,
        academic_background: this.props.academic_background,
        application_preference: this.props.application_preference
      }));
    }
    if (
      prevProps.academic_background.university !==
      this.props.academic_background.university
    ) {
      this.setState((state) => ({
        ...state,
        changed_academic: false
      }));
    }
    if (
      prevProps.academic_background.language !==
      this.props.academic_background.language
    ) {
      this.setState((state) => ({
        ...state,
        changed_language: false
      }));
    }
    if (
      prevProps.application_preference !== this.props.application_preference
    ) {
      this.setState((state) => ({
        ...state,
        changed_application_preference: false
      }));
    }
  }
  closeOffcanvasWindow = () => {
    this.setState((state) => ({ ...state, baseDocsflagOffcanvas: false }));
  };

  openOffcanvasWindow = () => {
    this.setState((state) => ({ ...state, baseDocsflagOffcanvas: true }));
  };

  updateDocLink = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    this.props.updateDocLink(
      this.state.survey_link,
      profile_name_list.Grading_System
    ); // this.props.k is the grading system name
    this.setState((state) => ({
      ...state,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    this.setState((state) => ({
      ...state,
      survey_link: url_temp
    }));
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

  renderTooltipApplicationYear = (props) => (
    <Tooltip id="tooltip-disabled" {...props}>
      請填上預計申請入學年度，您的申請必須要在這個預計入學年度和預計入學學期前完成。各學校申請截止
      Deadline 會依照你的預計入學年度和學期為您做計算。
    </Tooltip>
  );

  renderTooltipApplicationSemester = (props) => (
    <Tooltip id="tooltip-disabled" {...props}>
      請填上預計入學學期，您的申請必須會在這個時間之前結束。各學校申請截止
      Deadline 會依照你的預計入學年度和學期為您做計算。
    </Tooltip>
  );
  render() {
    const isReadonly = false;
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
                  <b>請盡速填好以下問卷問題，這將會影響Agent處理您的申請進度</b>
                  <br />
                  The followings information are still missing:{' '}
                  {missing_survey_fields_list(
                    this.props.academic_background,
                    this.props.application_preference
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        {!check_languages_filled(this.props.academic_background) && (
          <Row>
            <Col>
              <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                <Card.Body>
                  <b>
                    請盡速更新您的語言檢定資訊，這將會影響Agent了解您的申請時程
                  </b>
                  <br />
                  Your <b>language skills and certificates</b> information are
                  still missing or not up-to-date:
                  {this.props.academic_background.language?.english_isPassed ===
                    '-' ||
                  !this.props.academic_background.language?.english_isPassed ? (
                    <li>Do you need English Test?</li>
                  ) : this.props.academic_background.language
                      ?.english_isPassed === 'X' &&
                    parseInt(
                      getNumberOfDays(
                        this.props.academic_background.language
                          ?.english_test_date,
                        new Date()
                      )
                    ) > 1 ? (
                    <li>English Test passed?</li>
                  ) : this.props.academic_background.language
                      ?.english_isPassed === 'X' &&
                    this.props.academic_background.language
                      ?.english_test_date === '' ? (
                    <li>English Test Date missing !</li>
                  ) : (
                    <></>
                  )}
                  {this.props.academic_background.language?.german_isPassed ===
                    '-' ||
                  !this.props.academic_background.language?.german_isPassed ? (
                    <li>Do you need German Test?</li>
                  ) : this.props.academic_background.language
                      ?.german_isPassed === 'X' &&
                    parseInt(
                      getNumberOfDays(
                        this.props.academic_background.language
                          ?.german_test_date,
                        new Date()
                      )
                    ) > 1 ? (
                    <li>German Test passed ?</li>
                  ) : this.props.academic_background.language
                      ?.german_isPassed === 'X' &&
                    this.props.academic_background.language
                      ?.german_test_date === '' ? (
                    <li>German Test Date not given</li>
                  ) : (
                    <></>
                  )}
                  {this.props.academic_background.language?.gre_isPassed ===
                    '-' ||
                  !this.props.academic_background.language?.gre_isPassed ? (
                    <li>Do you need GRE Test?</li>
                  ) : this.props.academic_background.language?.gre_isPassed ===
                      'X' &&
                    parseInt(
                      getNumberOfDays(
                        this.props.academic_background.language?.gre_test_date,
                        new Date()
                      )
                    ) > 1 ? (
                    <li>GRE Test passed ?</li>
                  ) : this.props.academic_background.language?.gre_isPassed ===
                      'X' &&
                    this.props.academic_background.language?.gre_test_date ===
                      '' ? (
                    <li>GRE Test Date not given</li>
                  ) : (
                    <></>
                  )}
                  {this.props.academic_background.language?.gmat_isPassed ===
                    '-' ||
                  !this.props.academic_background.language?.gmat_isPassed ? (
                    <li>Do you need GMAT Test?</li>
                  ) : this.props.academic_background.language?.gmat_isPassed ===
                      'X' &&
                    parseInt(
                      getNumberOfDays(
                        this.props.academic_background.language?.gmat_test_date,
                        new Date()
                      )
                    ) > 1 ? (
                    <li>GMAT Test passed ?</li>
                  ) : this.props.academic_background.language?.gmat_isPassed ===
                      'X' &&
                    this.props.academic_background.language?.gmat_test_date ===
                      '' ? (
                    <li>GMAT Test Date not given</li>
                  ) : (
                    <></>
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
                        High School Name (English)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        readOnly={isReadonly}
                        placeholder="Taipei First Girls' High School"
                        onChange={(e) => this.handleChange_Academic(e)}
                        value={
                          this.state.academic_background.university &&
                          this.state.academic_background.university
                            .attended_high_school
                            ? this.state.academic_background.university
                                .attended_high_school
                            : ''
                        }
                      />
                    </Form.Group>
                    <br />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="high_school_isGraduated">
                      <Form.Label className="my-0 mx-0 text-light">
                        High School already graduated ?
                      </Form.Label>
                      <Form.Control
                        as="select"
                        disabled={isReadonly}
                        value={
                          this.state.academic_background?.university
                            ?.high_school_isGraduated
                            ? this.state.academic_background.university
                                .high_school_isGraduated
                            : '-'
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      >
                        <>{TRI_STATE_OPTIONS()}</>
                        <option value="pending">Not finished yet</option>
                      </Form.Control>
                    </Form.Group>
                    <br />
                  </Col>
                  {this.state.academic_background?.university
                    ?.high_school_isGraduated !== '-' && (
                    <Col md={6}>
                      <Form.Group controlId="high_school_graduated_year">
                        <Form.Label className="my-0 mx-0 text-light">
                          {this.state.academic_background.university
                            .high_school_isGraduated === 'Yes' &&
                            'High School Graduate Year'}
                          {this.state.academic_background.university
                            .high_school_isGraduated === 'pending' &&
                            'Expected High School Graduate Year'}
                          {this.state.academic_background.university
                            .high_school_isGraduated === 'No' &&
                            'High School Graduate leaved Year'}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          readOnly={isReadonly}
                          placeholder="2022"
                          value={
                            this.state.academic_background?.university
                              ?.high_school_graduated_year
                              ? this.state.academic_background.university
                                  .high_school_graduated_year
                              : ''
                          }
                          onChange={(e) => this.handleChange_Academic(e)}
                        />
                      </Form.Group>
                      <br />
                    </Col>
                  )}
                </Row>
                <Row>
                  <h4 className="my-2 mx-0 text-light">
                    University (Bachelor degree)
                  </h4>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="attended_university">
                      <Form.Label className="my-0 mx-0 text-light">
                        University Name (English)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="National Taiwan University / Not study yet"
                        readOnly={isReadonly}
                        onChange={(e) => this.handleChange_Academic(e)}
                        value={
                          this.state.academic_background?.university
                            ?.attended_university
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
                        University Program (English) (Put together if double
                        major)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        readOnly={isReadonly}
                        placeholder="B.Sc, Mechanical Engineering / Not study yet"
                        value={
                          this.state.academic_background?.university
                            ?.attended_university_program
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
                        Already Bachelor graduated ?
                      </Form.Label>
                      <Form.Control
                        as="select"
                        disabled={isReadonly}
                        value={
                          this.state.academic_background.university &&
                          this.state.academic_background.university.isGraduated
                            ? this.state.academic_background.university
                                .isGraduated
                            : '-'
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      >
                        <option value="-">-</option>
                        <option value="Yes">Yes 已畢業</option>
                        <option value="No">No 未開始就讀</option>
                        <option value="pending">
                          Not finished yet 就讀中，尚未畢業
                        </option>
                      </Form.Control>
                    </Form.Group>
                    <br />
                  </Col>
                  {this.state.academic_background?.university?.isGraduated !==
                    '-' &&
                    this.state.academic_background?.university?.isGraduated !==
                      'No' && (
                      <Col md={6}>
                        <Form.Group controlId="expected_grad_date">
                          <Form.Label className="my-0 mx-0 text-light">
                            {this.state.academic_background.university
                              .isGraduated === 'No' && 'Leaved Year'}
                            {this.state.academic_background.university
                              .isGraduated === 'Yes' && 'Graduated Year'}
                            {this.state.academic_background.university
                              .isGraduated === 'pending' &&
                              'Expected Graduate Year'}
                          </Form.Label>
                          <Form.Control
                            as="select"
                            disabled={isReadonly}
                            value={
                              this.state.academic_background?.university
                                ?.expected_grad_date
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
                    <InputFormSelect
                      prop_name={'Has_Exchange_Experience'}
                      title={'Exchange Student Experience ?'}
                      isReadonly={isReadonly}
                      value={
                        this.state.academic_background?.university
                          ?.Has_Exchange_Experience
                          ? this.state.academic_background.university
                              .Has_Exchange_Experience
                          : '-'
                      }
                      OPTIONS={TRI_STATE_OPTIONS()}
                      handleChange={this.handleChange_Academic}
                    />
                    <br />
                  </Col>
                  <Col md={6}>
                    <InputFormSelect
                      prop_name={'Has_Internship_Experience'}
                      title={'Internship Experience ?'}
                      isReadonly={isReadonly}
                      value={
                        this.state.academic_background?.university
                          ?.Has_Internship_Experience
                          ? this.state.academic_background.university
                              .Has_Internship_Experience
                          : '-'
                      }
                      OPTIONS={TRI_STATE_OPTIONS()}
                      handleChange={this.handleChange_Academic}
                    />
                    <br />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <InputFormSelect
                      prop_name={'Has_Working_Experience'}
                      title={'Full-Time Job Experience ?'}
                      isReadonly={isReadonly}
                      value={
                        this.state.academic_background?.university
                          ?.Has_Working_Experience
                          ? this.state.academic_background.university
                              .Has_Working_Experience
                          : '-'
                      }
                      OPTIONS={TRI_STATE_OPTIONS()}
                      handleChange={this.handleChange_Academic}
                    />
                    <br />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="Highest_GPA_Uni">
                      <Form.Label className="my-0 mx-0 text-light">
                        Highest Score GPA of your university program
                        <a
                          href={
                            this.state.survey_link &&
                            this.state.survey_link != ''
                              ? this.state.survey_link
                              : '/'
                          }
                          target="_blank"
                          className="text-info"
                        >
                          <FiExternalLink
                            className="mx-1 mb-1"
                            style={{ cursor: 'pointer' }}
                          />
                        </a>
                        {this.props.user.role === 'Admin' && (
                          <a
                            onClick={this.openOffcanvasWindow}
                            style={{ cursor: 'pointer' }}
                          >
                            [Edit]
                          </a>
                        )}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        readOnly={isReadonly}
                        placeholder="4.3"
                        value={
                          this.state.academic_background?.university
                            ?.Highest_GPA_Uni
                        }
                        onChange={(e) => this.handleChange_Academic(e)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="Passing_GPA_Uni">
                      <Form.Label className="my-0 mx-0 text-light">
                        Passing Score GPA of your university program
                        <a
                          href={
                            this.state.survey_link &&
                            this.state.survey_link != ''
                              ? this.state.survey_link
                              : '/'
                          }
                          target="_blank"
                          className="text-info"
                        >
                          <FiExternalLink
                            className="mx-1 mb-1"
                            style={{ cursor: 'pointer' }}
                          />
                        </a>
                        {this.props.user.role === 'Admin' && (
                          <a
                            onClick={this.openOffcanvasWindow}
                            style={{ cursor: 'pointer' }}
                          >
                            [Edit]
                          </a>
                        )}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        readOnly={isReadonly}
                        placeholder="1.7"
                        value={
                          this.state.academic_background?.university
                            ?.Passing_GPA_Uni
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
                        My GPA
                        <a
                          href={
                            this.state.survey_link &&
                            this.state.survey_link != ''
                              ? this.state.survey_link
                              : '/'
                          }
                          target="_blank"
                          className="text-info"
                        >
                          <FiExternalLink
                            className="mx-1 mb-1"
                            style={{ cursor: 'pointer' }}
                          />
                        </a>
                        {this.props.user.role === 'Admin' && (
                          <a
                            onClick={this.openOffcanvasWindow}
                            style={{ cursor: 'pointer' }}
                          >
                            [Edit]
                          </a>
                        )}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        readOnly={isReadonly}
                        placeholder="3.8"
                        value={
                          this.state.academic_background?.university?.My_GPA_Uni
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
                        {this.state.academic_background?.university
                          ?.My_GPA_Uni &&
                        this.state.academic_background?.university
                          ?.Passing_GPA_Uni &&
                        this.state.academic_background?.university
                          ?.Highest_GPA_Uni
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
                    {this.props.academic_background?.university?.updatedAt
                      ? convertDate(
                          this.props.academic_background.university.updatedAt
                        )
                      : ''}
                  </Col>
                  {this.props.user.archiv !== true && (
                    <Col md={2}>
                      <br />
                      {this.props.singlestudentpage_fromtaiger ? (
                        <>
                          <Button
                            variant="primary"
                            disabled={!this.state.changed_academic}
                            onClick={(e) =>
                              this.props.handleSubmit_AcademicBackground_root(
                                e,
                                this.state.academic_background.university
                              )
                            }
                          >
                            Update
                          </Button>
                          <br />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
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
                      <Form.Label className="mb-2 mx-0 text-light">
                        預計要入學的年度 Expected Application Year{' '}
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={this.renderTooltipApplicationYear}
                        >
                          <span className="d-inline-block">
                            <AiFillQuestionCircle
                              size={24}
                              color="dodgerblue  "
                            />
                          </span>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        disabled={isReadonly}
                        value={
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
                      <Form.Label className="mb-2 mx-0 text-light">
                        預計要入學的學期 Expected Application Semester{' '}
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={this.renderTooltipApplicationSemester}
                        >
                          <span className="d-inline-block">
                            <AiFillQuestionCircle
                              size={24}
                              color="dodgerblue  "
                            />
                          </span>
                        </OverlayTrigger>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        disabled={isReadonly}
                        value={
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
                        {/* <option value="WSSS">Winter + Summer Semester</option> */}
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
                          maxLength={40}
                          readOnly={isReadonly}
                          placeholder="Data Science, Comupter Science, etc. (max. 40 characters)"
                          value={
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
                    </Form>
                  </Col>
                  <Col md={6}>
                    <Form>
                      <Form.Group controlId="target_degree">
                        <Form.Label className="my-0 mx-0 text-light">
                          Target Degree Programs
                        </Form.Label>
                        <Form.Control
                          as="select"
                          disabled={isReadonly}
                          value={
                            this.state.application_preference &&
                            this.state.application_preference.target_degree
                              ? this.state.application_preference.target_degree
                              : ''
                          }
                          onChange={(e) =>
                            this.handleChange_ApplicationPreference(e)
                          }
                        >
                          <option value="">Please Select</option>
                          <option value="Bachelor">Bachelor</option>
                          <option value="Master">Master</option>
                          <option value="BachelorMaster">
                            Bachelor and Master
                          </option>
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form>
                      <Form.Group
                        controlId="application_outside_germany"
                        className="my-4 mx-0"
                      >
                        <Form.Label className="my-0 mx-0 text-light">
                          Considering universities outside Germany?
                        </Form.Label>
                        <Form.Control
                          disabled={isReadonly}
                          as="select"
                          value={
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
                    </Form>
                  </Col>
                  <Col md={6}>
                    <Form>
                      <Form.Group
                        controlId="considered_privat_universities"
                        className="my-4 mx-0"
                      >
                        <Form.Label className="my-0 mx-0 text-light">
                          Considering private universities? (Tuition Fee: ~15000
                          EURO/year)
                        </Form.Label>
                        <Form.Control
                          as="select"
                          disabled={isReadonly}
                          value={
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
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="NotSure">Not Sure</option>
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form>
                      <Form.Group
                        controlId="special_wished"
                        className="my-0 mx-0"
                      >
                        <Form.Label className="my-0 mx-0 text-light">
                          Other wish
                        </Form.Label>{' '}
                        <div className="d-flex align-items-center">
                          {/* Wrap label and input in a flex container */}
                          <Form.Control
                            as="textarea"
                            maxLength={1000}
                            rows="5"
                            placeholder="Example: QS Ranking 300, 只要德國"
                            value={
                              this.state.application_preference &&
                              this.state.application_preference.special_wished
                                ? this.state.application_preference
                                    .special_wished
                                : ''
                            }
                            onChange={(e) =>
                              this.handleChange_ApplicationPreference(e)
                            }
                            className="mr-2"
                          ></Form.Control>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span className="text-light">
                      {this.state.application_preference.special_wished
                        ?.length || 0}
                      /1000
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col md={10} className="my-0 mx-0 text-light">
                    <br />
                    Last update at:{' '}
                    {this.props.application_preference &&
                    this.props.application_preference.updatedAt
                      ? convertDate(this.props.application_preference.updatedAt)
                      : ''}
                  </Col>
                  {this.props.user.archiv !== true && (
                    <Col md={2}>
                      <br />
                      {this.props.singlestudentpage_fromtaiger ? (
                        <>
                          <Button
                            variant="primary"
                            disabled={
                              !this.state.changed_application_preference
                            }
                            onClick={(e) =>
                              this.props.handleSubmit_ApplicationPreference_root(
                                e,
                                this.state.application_preference
                              )
                            }
                          >
                            Update
                          </Button>
                          <br />
                        </>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            disabled={
                              !this.state.changed_application_preference
                            }
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
                        </>
                      )}
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
            <Card className="my-4 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Languages Test and Certificates
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Banner
                  ReadOnlyMode={true}
                  bg={'primary'}
                  title={'Info:'}
                  path={'/'}
                  text={
                    '若還沒考過，請在 Passed 處選 No，並填上檢定以及預計考試時間。若不需要（如德語），請填 Not Needed。方便顧問了解你的進度。'
                  }
                  link_name={''}
                  removeBanner={this.removeBanner}
                  notification_key={'x'}
                />
                {(this.state.academic_background?.language?.english_isPassed ===
                  'X' ||
                  this.state.academic_background?.language?.german_isPassed ===
                    'X' ||
                  this.state.academic_background?.language?.gre_isPassed ===
                    'X' ||
                  this.state.academic_background?.language?.gmat_isPassed ===
                    'X') && (
                  <Banner
                    ReadOnlyMode={true}
                    bg={'danger'}
                    title={'Reminder:'}
                    path={'/'}
                    text={
                      <>
                        報名考試時，請確認 <b>護照</b> 有無過期。
                      </>
                    }
                    link_name={''}
                    removeBanner={this.removeBanner}
                    notification_key={'x'}
                  />
                )}
                <Row>
                  <Col md={4}>
                    <InputFormSelect
                      prop_name={'english_isPassed'}
                      title={'English Passed ? (IELTS 6.5 / TOEFL 88)'}
                      isReadonly={isReadonly}
                      value={
                        this.state.academic_background?.language
                          ?.english_isPassed
                      }
                      OPTIONS={IS_PASSED_OPTIONS()}
                      handleChange={this.handleChange_Language}
                    />
                  </Col>
                  {this.state.academic_background.language &&
                  this.state.academic_background.language.english_isPassed &&
                  (this.state.academic_background.language.english_isPassed ===
                    'O' ||
                    this.state.academic_background.language.english_isPassed ===
                      'X') ? (
                    this.state.academic_background.language.english_isPassed ===
                    'O' ? (
                      <>
                        <Col md={4}>
                          <InputFormSelect
                            prop_name={'english_certificate'}
                            title={'English Certificate'}
                            isReadonly={isReadonly}
                            value={
                              this.state.academic_background?.language
                                ?.english_certificate
                                ? this.state.academic_background.language
                                    .english_certificate
                                : ''
                            }
                            OPTIONS={ENGLISH_CERTIFICATE_OPTIONS()}
                            handleChange={this.handleChange_Language}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="english_score">
                            <Form.Label className="my-0 mx-0 text-light">
                              Overall
                            </Form.Label>
                            <Form.Control
                              type="text"
                              readOnly={isReadonly}
                              placeholder={`${
                                this.state.academic_background.language
                                  .english_certificate === 'IELTS'
                                  ? '6.5'
                                  : '92'
                              } `}
                              value={
                                this.state.academic_background.language &&
                                this.state.academic_background.language
                                  .english_score
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
                        <Col md={3}>
                          <Form.Group controlId="english_score_reading">
                            <Form.Label className="my-0 mx-0 text-light">
                              Reading
                            </Form.Label>
                            <Form.Control
                              type="text"
                              readOnly={isReadonly}
                              placeholder={`${
                                this.state.academic_background.language
                                  .english_certificate === 'IELTS'
                                  ? '7.5'
                                  : '21'
                              } `}
                              value={
                                this.state.academic_background?.language
                                  ?.english_score_reading
                                  ? this.state.academic_background.language
                                      .english_score_reading
                                  : ''
                              }
                              disabled={
                                this.state.academic_background.language
                                  ?.english_certificate === 'No'
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                          <br />
                        </Col>
                        <Col md={3}>
                          <Form.Group controlId="english_score_listening">
                            <Form.Label className="my-0 mx-0 text-light">
                              Listening
                            </Form.Label>
                            <Form.Control
                              type="text"
                              readOnly={isReadonly}
                              placeholder={`${
                                this.state.academic_background.language
                                  .english_certificate === 'IELTS'
                                  ? '6.0'
                                  : '21'
                              } `}
                              value={
                                this.state.academic_background?.language
                                  ?.english_score_listening
                                  ? this.state.academic_background.language
                                      .english_score_listening
                                  : ''
                              }
                              disabled={
                                this.state.academic_background?.language
                                  ?.english_certificate === 'No'
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                          <br />
                        </Col>
                        <Col md={3}>
                          <Form.Group controlId="english_score_writing">
                            <Form.Label className="my-0 mx-0 text-light">
                              Writing
                            </Form.Label>
                            <Form.Control
                              type="text"
                              readOnly={isReadonly}
                              placeholder={`${
                                this.state.academic_background.language
                                  .english_certificate === 'IELTS'
                                  ? '6.5'
                                  : '21'
                              } `}
                              value={
                                this.state.academic_background?.language
                                  ?.english_score_writing
                                  ? this.state.academic_background.language
                                      .english_score_writing
                                  : ''
                              }
                              disabled={
                                this.state.academic_background?.language
                                  ?.english_certificate === 'No'
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                          <br />
                        </Col>
                        <Col md={3}>
                          <Form.Group controlId="english_score_speaking">
                            <Form.Label className="my-0 mx-0 text-light">
                              Speaking
                            </Form.Label>
                            <Form.Control
                              type="text"
                              readOnly={isReadonly}
                              placeholder={`${
                                this.state.academic_background.language
                                  .english_certificate === 'IELTS'
                                  ? '6.5'
                                  : '21'
                              } `}
                              value={
                                this.state.academic_background?.language
                                  ?.english_score_speaking
                                  ? this.state.academic_background.language
                                      .english_score_speaking
                                  : ''
                              }
                              disabled={
                                this.state.academic_background?.language
                                  ?.english_certificate === 'No'
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                          <br />
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col md={4}>
                          <InputFormSelect
                            prop_name={'english_certificate'}
                            title={'Expected English Certificate'}
                            isReadonly={isReadonly}
                            value={
                              this.state.academic_background?.language
                                ?.english_certificate
                                ? this.state.academic_background.language
                                    .english_certificate
                                : ''
                            }
                            OPTIONS={ENGLISH_CERTIFICATE_OPTIONS()}
                            handleChange={this.handleChange_Language}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="english_test_date">
                            <Form.Label className="my-0 mx-0 text-light">
                              Expected Test Date
                            </Form.Label>
                            <Form.Control
                              type="date"
                              readOnly={isReadonly}
                              value={
                                this.state.academic_background.language &&
                                this.state.academic_background.language
                                  .english_test_date
                                  ? this.state.academic_background.language
                                      .english_test_date
                                  : ''
                              }
                              placeholder="Date of English Test"
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                        </Col>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </Row>
                <Row>
                  <Col md={4}>
                    <InputFormSelect
                      prop_name={'german_isPassed'}
                      title={
                        <>
                          German Passed ? (Set <b>Not need</b> if applying
                          English taught programs.)
                        </>
                      }
                      isReadonly={isReadonly}
                      value={
                        this.state.academic_background?.language
                          ?.german_isPassed
                      }
                      OPTIONS={IS_PASSED_OPTIONS()}
                      handleChange={this.handleChange_Language}
                    />
                  </Col>
                  {this.state.academic_background?.language?.german_isPassed &&
                  (this.state.academic_background?.language?.german_isPassed ===
                    'O' ||
                    this.state.academic_background?.language
                      ?.german_isPassed === 'X') ? (
                    this.state.academic_background?.language
                      ?.german_isPassed === 'O' ? (
                      <>
                        <Col md={4}>
                          <Form.Group
                            className="mt-3 mx-0"
                            controlId="german_certificate"
                          >
                            <Form.Label className="my-0 mx-0 text-light">
                              German Certificate
                            </Form.Label>
                            <Form.Control
                              as="select"
                              disabled={isReadonly}
                              value={
                                this.state.academic_background?.language
                                  ?.german_certificate
                                  ? this.state.academic_background.language
                                      .german_certificate
                                  : ''
                              }
                              onChange={(e) => this.handleChange_Language(e)}
                            >
                              <>{GERMAN_CERTIFICATE_OPTIONS()}</>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group
                            className="mt-3 mx-0"
                            controlId="german_score"
                          >
                            <Form.Label className="my-0 mx-0 text-light">
                              German Test Score
                            </Form.Label>
                            <Form.Control
                              type="text"
                              readOnly={isReadonly}
                              placeholder="(i.e. TestDaF: 4, or DSH: 2) "
                              value={
                                this.state.academic_background?.language
                                  ?.german_score
                                  ? this.state.academic_background.language
                                      .german_score
                                  : ''
                              }
                              disabled={
                                this.state.academic_background?.language
                                  ?.german_certificate === 'No'
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                          <br />
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col md={4}>
                          <Form.Group
                            className="mt-3 mx-0"
                            controlId="german_certificate"
                          >
                            <Form.Label className="my-0 mx-0 text-light">
                              German Certificate
                            </Form.Label>
                            <Form.Control
                              as="select"
                              disabled={isReadonly}
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
                              <>{GERMAN_CERTIFICATE_OPTIONS()}</>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group
                            className="mt-3 mx-0"
                            controlId="german_test_date"
                          >
                            <Form.Label className="my-0 mx-0 text-light">
                              Expected Test Date
                            </Form.Label>
                            <Form.Control
                              type="date"
                              readOnly={isReadonly}
                              value={
                                this.state.academic_background.language &&
                                this.state.academic_background.language
                                  .german_test_date
                                  ? this.state.academic_background.language
                                      .german_test_date
                                  : ''
                              }
                              placeholder="Date of Germa Test"
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                        </Col>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </Row>
                <Row>
                  <Col md={4}>
                    <InputFormSelect
                      prop_name={'gre_isPassed'}
                      title={'GRE Test ? (At least V145 Q160 )'}
                      isReadonly={isReadonly}
                      value={
                        this.state.academic_background?.language?.gre_isPassed
                      }
                      OPTIONS={IS_PASSED_OPTIONS()}
                      handleChange={this.handleChange_Language}
                    />
                  </Col>
                  {this.state.academic_background?.language?.gre_isPassed &&
                  (this.state.academic_background.language.gre_isPassed ===
                    'O' ||
                    this.state.academic_background.language.gre_isPassed ===
                      'X') ? (
                    this.state.academic_background.language.gre_isPassed ===
                    'O' ? (
                      <>
                        <Col md={4}>
                          <InputFormSelect
                            prop_name={'gre_certificate'}
                            title={'GRE Certificate'}
                            isReadonly={isReadonly}
                            value={
                              this.state.academic_background?.language
                                ?.gre_certificate
                                ? this.state.academic_background.language
                                    .gre_certificate
                                : ''
                            }
                            OPTIONS={GRE_CERTIFICATE_OPTIONS()}
                            handleChange={this.handleChange_Language}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="gre_score">
                            <Form.Label className="my-0 mx-0 text-light">
                              GRE Test Score
                            </Form.Label>
                            <Form.Control
                              type="text"
                              readOnly={isReadonly}
                              placeholder="(i.e. V152Q167A3.5) "
                              value={
                                this.state.academic_background?.language
                                  ?.gre_score
                                  ? this.state.academic_background.language
                                      .gre_score
                                  : ''
                              }
                              disabled={
                                this.state.academic_background?.language
                                  ?.gre_certificate === 'No'
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                          <br />
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col md={4}>
                          <InputFormSelect
                            prop_name={'gre_certificate'}
                            title={'Expected GRE Certificate'}
                            isReadonly={isReadonly}
                            value={
                              this.state.academic_background?.language
                                ?.gre_certificate
                                ? this.state.academic_background.language
                                    .gre_certificate
                                : ''
                            }
                            OPTIONS={GRE_CERTIFICATE_OPTIONS()}
                            handleChange={this.handleChange_Language}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="gre_test_date">
                            <Form.Label className="my-0 mx-0 text-light">
                              Expected Test Date
                            </Form.Label>
                            <Form.Control
                              type="date"
                              readOnly={isReadonly}
                              value={
                                this.state.academic_background?.language
                                  ?.gre_test_date
                                  ? this.state.academic_background.language
                                      .gre_test_date
                                  : ''
                              }
                              placeholder="Date of GRE General/Subject Test"
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                        </Col>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </Row>
                <Row>
                  <Col md={4}>
                    <InputFormSelect
                      prop_name={'gmat_isPassed'}
                      title={'GMAT Test ? (At least 600 )'}
                      isReadonly={isReadonly}
                      value={
                        this.state.academic_background?.language?.gmat_isPassed
                      }
                      OPTIONS={IS_PASSED_OPTIONS()}
                      handleChange={this.handleChange_Language}
                    />
                  </Col>
                  {this.state.academic_background?.language?.gmat_isPassed &&
                  (this.state.academic_background.language.gmat_isPassed ===
                    'O' ||
                    this.state.academic_background.language.gmat_isPassed ===
                      'X') ? (
                    this.state.academic_background.language.gmat_isPassed ===
                    'O' ? (
                      <>
                        <Col md={4}>
                          <InputFormSelect
                            prop_name={'gmat_certificate'}
                            title={'GMAT Certificate'}
                            isReadonly={isReadonly}
                            value={
                              this.state.academic_background?.language
                                ?.gmat_certificate
                                ? this.state.academic_background.language
                                    .gmat_certificate
                                : ''
                            }
                            OPTIONS={GMAT_CERTIFICATE_OPTIONS()}
                            handleChange={this.handleChange_Language}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="gmat_score">
                            <Form.Label className="my-0 mx-0 text-light">
                              GMAT Test Score
                            </Form.Label>
                            <Form.Control
                              type="text"
                              readOnly={isReadonly}
                              placeholder="(i.e. 550, 620) "
                              value={
                                this.state.academic_background?.language
                                  ?.gmat_score
                                  ? this.state.academic_background.language
                                      .gmat_score
                                  : ''
                              }
                              disabled={
                                this.state.academic_background?.language
                                  ?.gmat_certificate === 'No'
                                  ? true
                                  : false
                              }
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                          <br />
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col md={4}>
                          <InputFormSelect
                            prop_name={'gmat_certificate'}
                            title={'Expected GMAT Certificate'}
                            isReadonly={isReadonly}
                            value={
                              this.state.academic_background?.language
                                ?.gmat_certificate
                                ? this.state.academic_background.language
                                    .gmat_certificate
                                : ''
                            }
                            OPTIONS={GMAT_CERTIFICATE_OPTIONS()}
                            handleChange={this.handleChange_Language}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="gmat_test_date">
                            <Form.Label className="my-0 mx-0 text-light">
                              Expected Test Date
                            </Form.Label>
                            <Form.Control
                              type="date"
                              readOnly={isReadonly}
                              value={
                                this.state.academic_background.language &&
                                this.state.academic_background.language
                                  .gmat_test_date
                                  ? this.state.academic_background.language
                                      .gmat_test_date
                                  : ''
                              }
                              placeholder="Date of GMAT Phyical/Online Test"
                              onChange={(e) => this.handleChange_Language(e)}
                            />
                          </Form.Group>
                        </Col>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </Row>
                <Row>
                  <Col md={10} className="my-0 mx-0 text-light">
                    <br />
                    Last update at:{' '}
                    {this.props.academic_background.language &&
                    this.props.academic_background.language.updatedAt
                      ? convertDate(
                          this.props.academic_background.language.updatedAt
                        )
                      : ''}
                  </Col>
                  {this.props.user.archiv !== true && (
                    <Col md={2}>
                      <br />
                      {this.props.singlestudentpage_fromtaiger ? (
                        <>
                          <Button
                            variant="primary"
                            disabled={!this.state.changed_language}
                            onClick={(e) =>
                              this.props.handleSubmit_Language_root(
                                e,
                                this.state.academic_background.language
                              )
                            }
                          >
                            Update
                          </Button>

                          <br />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Offcanvas
          show={this.state.baseDocsflagOffcanvas}
          onHide={this.closeOffcanvasWindow}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Edit</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Documentation Link for <b>{this.props.docName}</b>
              </Form.Label>
              <Form.Control
                placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
                value={this.state.survey_link}
                onChange={(e) => this.onChangeURL(e)}
              />
            </Form.Group>
            <Button
              onClick={(e) => this.updateDocLink(e)}
              disabled={this.state.baseDocsflagOffcanvasButtonDisable}
            >
              Save
            </Button>
          </Offcanvas.Body>
        </Offcanvas>
      </Aux>
    );
  }
}

export default SurveyEditableComponent;
