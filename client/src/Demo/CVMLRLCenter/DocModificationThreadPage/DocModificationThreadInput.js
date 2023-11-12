import React, { Component } from 'react';
import {
  Row,
  Col,
  Spinner,
  Button,
  Card,
  Modal,
  Form,
  Placeholder
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Aux from '../../../hoc/_Aux';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import {
  CVQuestions,
  MLQuestions,
  RLQuestions,
  convertDate,
  spinner_style
} from '../../Utils/contants';

import {
  LinkableNewlineText,
  getRequirement,
  is_TaiGer_role
} from '../../Utils/checking-functions';

import {
  cvmlrlAi,
  getStudentInput,
  putStudentInput,
  resetStudentInput
} from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';

class DocModificationThreadInput extends Component {
  state = {
    error: '',
    isGenerating: false,
    isSaving: false,
    isResetting: false,
    isSubmitting: false,
    student_input: [],
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };
  componentDidMount() {
    getStudentInput(this.props.match?.params.documentsthreadId).then(
      (resp) => {
        const { success, data, editors, agents, deadline } = resp.data;
        const { status } = resp;
        let temp_question = [];
        if (
          data?.file_type?.includes('RL') ||
          data?.file_type?.includes('Recommendation')
        ) {
          temp_question = RLQuestions(data);
        } else {
          switch (data?.file_type) {
            case 'ML':
              temp_question = MLQuestions(data);
              break;
            case 'CV':
              temp_question = CVQuestions();
              break;
            default:
              temp_question = [];
          }
        }

        if (success) {
          this.setState({
            success,
            thread: data,
            student_input: data?.student_input?.input_content
              ? {
                  input_content: JSON.parse(data?.student_input?.input_content),
                  updatedAt: data?.student_input.updatedAt
                }
              : {
                  input_content: temp_question,
                  updatedAt: data?.student_input?.updatedAt
                },
            document_requirements: {},
            editor_requirements: {},
            editors,
            agents,
            deadline,
            isLoaded: true,
            documentsthreadId: this.props.match.params.documentsthreadId,

            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  onChange = (e) => {
    const id = e.target.id;
    const ans = e.target.value;
    const temp_student_input = { ...this.state.student_input };
    const temp_q = temp_student_input.input_content.find(
      (qa) => qa.question_id === id
    );
    temp_q.answer = ans;
    this.setState({
      student_input: temp_student_input
    });
  };

  onChangeEditorRequirements = (e) => {
    const id = e.target.id;
    if (id === 'useProgramRequirementData') {
      const checked = e.target.checked;
      this.setState({
        editor_requirements: {
          ...this.state.editor_requirements,
          [id]: checked
        },
        document_requirements: checked ? getRequirement(this.state.thread) : ''
      });
      console.log('useProgramRequirementData');
      return;
    }

    const ans = e.target.value;
    this.setState({
      editor_requirements: {
        ...this.state.editor_requirements,
        [id]: ans
      }
    });
    console.log('ans');
  };
  onReset = () => {
    this.setState({
      isResetting: true
    });
    resetStudentInput(this.props.match?.params.documentsthreadId).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;

        let temp_question = [];
        if (
          this.state.thread?.file_type?.includes('RL') ||
          this.state.thread?.file_type?.includes('Recommendation')
        ) {
          temp_question = RLQuestions(this.state.thread);
        } else {
          switch (this.state.thread?.file_type) {
            case 'ML':
              temp_question = MLQuestions(this.state.thread);
              break;
            case 'CV':
              temp_question = CVQuestions();
              break;
            default:
              temp_question = [];
          }
        }

        if (success) {
          this.setState({
            success,
            student_input: {
              input_content: temp_question,
              updatedAt: new Date()
            },
            isResetting: false,
            isLoaded: true,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            isResetting: false,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          isResetting: false,
          error,
          res_status: 500
        }));
      }
    );
    this.setState({
      student_input: {
        ...this.state.student_input,
        input_content: [],
        updatedAt: new Date()
      }
    });
  };

  onSubmitInput = (student_input, informEditor) => {
    if (informEditor) {
      this.setState({
        isSubmitting: true
      });
    } else {
      this.setState({
        isSaving: true
      });
    }

    putStudentInput(
      this.props.match?.params.documentsthreadId,
      JSON.stringify(student_input.input_content),
      informEditor
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;

        if (success) {
          this.setState({
            success,
            isSaving: false,
            isSubmitting: false,
            student_input: {
              ...this.state.student_input,
              updatedAt: new Date()
            },
            isLoaded: true,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            isSaving: false,
            isSubmitting: false,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          isSaving: false,
          isSubmitting: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  // Example usage
  mockApiCall = async (data, timeout = 1000) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, timeout);
    });
  };
  // Example usage
  fetchData = async () => {
    try {
      console.log('Fetching data...');

      // Simulate an API call with a 2-second delay
      const result = await this.mockApiCall(
        `testing mocked api call testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call
        testing mocked api call`,
        2000
      );

      console.log('Data received:', result);
      this.setState({
        isLoaded: true,
        isGenerating: false,
        data: result,
        success: true
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  onSubmit = () => {
    this.setState({
      isGenerating: true
    });
    // Mock
    // this.fetchData();
    let program_full_name = '';
    if (this.state.thread.program_id) {
      program_full_name =
        this.state.thread.program_id.school +
        '-(' +
        this.state.thread.program_id.degree +
        ') ';
    }
    cvmlrlAi(
      JSON.stringify(this.state.student_input),
      JSON.stringify(this.state.document_requirements),
      JSON.stringify(this.state.editor_requirements),
      this.state.thread.student_id._id.toString(),
      program_full_name,
      this.state.thread.file_type
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            isGenerating: false,
            data,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            isGenerating: false,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          isGenerating: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  render() {
    const { isLoaded, res_status, res_modal_status, res_modal_message } =
      this.state;
    if (!isLoaded && !this.state.thread) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    let docName;
    const student_name = `${this.state.thread.student_id.firstname} ${this.state.thread.student_id.lastname}`;
    if (this.state.thread.program_id) {
      docName =
        this.state.thread.program_id.school +
        '-(' +
        this.state.thread.program_id.degree +
        ') ' +
        this.state.thread.program_id.program_name +
        ' ' +
        this.state.thread.file_type;
    } else {
      docName = this.state.thread.file_type;
    }
    TabTitle(`${student_name} ${docName}`);
    return (
      <Aux>
        {!isLoaded && (
          <div style={spinner_style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        <Row>
          <Card className="mb-2 mx-0">
            <Card.Header>
              <h4 className="mt-1 ms-0" style={{ textAlign: 'left' }}>
                <Link
                  className="text-primary"
                  to={`/student-database/${this.state.thread.student_id?._id.toString()}/profile`}
                >
                  <b>{student_name}</b>
                </Link>
                {'   '}
                {docName}
                {' Discussion thread'}
                {'   '}
                <b>{' Online Input form'}</b>
              </h4>
            </Card.Header>
          </Card>
        </Row>
        {this.state.thread.isFinalVersion && (
          <Row className="sticky-top">
            <Card className="mb-2 mx-0" bg={'success'} text={'white'}>
              <Card.Header>
                <Card.Title as="h5" className="text-light">
                  Status: <b>Close</b>
                </Card.Title>
              </Card.Header>
            </Card>
          </Row>
        )}
        <Row className="pb-2">
          <Col className="px-0">
            <Card className="mb-0 my-0 mx-0">
              <Row>
                <Col>
                  <Link
                    to={`${DEMO.DOCUMENT_MODIFICATION_LINK(
                      this.state.documentsthreadId
                    )}`}
                    // target="_blank"
                  >
                    <Button size="sm">回到討論串</Button>
                  </Link>
                </Col>
              </Row>
              <Card.Body>
                <b>Requirements:</b>
                {this.state.thread?.program_id ? (
                  <>
                    <LinkableNewlineText
                      text={getRequirement(this.state.thread)}
                    />
                  </>
                ) : (
                  <p>No</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="px-0">
            <Card>
              <Card.Body>
                <h4>
                  Please answer the following questions in <b>English</b>{' '}
                  {this.state.thread.program_id?.lang?.includes('German')
                    ? '( or German if you like ) '
                    : ''}
                  !
                </h4>
                <Row>
                  {this.state.student_input?.input_content.map((qa, i) => (
                    <Col md={qa.width || 12}>
                      <Form className="mb-2" key={i}>
                        <Form.Group controlId={qa.question_id}>
                          <Form.Label>{qa.question}</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={qa.rows || '1'}
                            placeholder={qa.placeholder}
                            defaultValue={qa.answer}
                            onChange={this.onChange}
                          ></Form.Control>
                        </Form.Group>
                      </Form>
                    </Col>
                  ))}
                </Row>
                <Button
                  size="sm"
                  disabled={this.state.isSaving}
                  onClick={(e) =>
                    this.onSubmitInput(this.state.student_input, true)
                  }
                >
                  {this.state.isSubmitting ? (
                    <>
                      <Spinner
                        size="sm"
                        animation="border"
                        role="status"
                      ></Spinner>
                      Submitting
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
                <Button
                  variant="outline-primary"
                  disabled={this.state.isSaving}
                  size="sm"
                  onClick={(e) =>
                    this.onSubmitInput(this.state.student_input, false)
                  }
                >
                  {this.state.isSaving ? (
                    <>
                      <Spinner
                        size="sm"
                        animation="border"
                        role="status"
                      ></Spinner>
                      {'  '}
                      Saving
                    </>
                  ) : (
                    'Save as draft'
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => this.onReset()}
                >
                  {this.state.isResetting ? (
                    <>
                      <Spinner
                        size="sm"
                        animation="border"
                        role="status"
                      ></Spinner>
                      {'  '}
                      Resetting
                    </>
                  ) : (
                    'Reset'
                  )}
                </Button>
                <span style={{ float: 'right' }}>
                  Updated At: {convertDate(this.state.student_input?.updatedAt)}
                </span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {is_TaiGer_role(this.props.user) && (
          <Row>
            <Col className="px-0">
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <Form>
                        <Form.Group controlId="useProgramRequirementData">
                          <Form.Label>Use program's requirements?</Form.Label>
                          <Form.Check
                            type="checkbox"
                            checked={
                              this.editor_requirements
                                ?.useProgramRequirementData
                            }
                            onChange={this.onChangeEditorRequirements}
                          ></Form.Check>
                        </Form.Group>
                      </Form>
                    </Col>
                    <Col>
                      <Form>
                        <Form.Group controlId="outputLanguage">
                          <Form.Label>Output language?</Form.Label>
                          <Form.Control
                            defaultValue="English"
                            onChange={(e) => {
                              this.onChangeEditorRequirements(e);
                            }}
                            as="select"
                          >
                            <option value="English">English</option>
                            <option value="German">German</option>
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </Col>
                    <Col>
                      <Form>
                        <Form.Group controlId="gptModel">
                          <Form.Label>GPT Model language?</Form.Label>
                          <Form.Control
                            defaultValue="gpt-3.5-turbo"
                            onChange={(e) => {
                              this.onChangeEditorRequirements(e);
                            }}
                            as="select"
                          >
                            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                            <option value="gpt-3.5-turbo-16k">
                              gpt-3.5-turbo-16k
                            </option>
                            <option value="gpt-4">gpt-4</option>
                            <option value="gpt-4-32k">gpt-4-32k</option>
                            <option value="text-embedding-ada-002">
                              text-embedding-ada-002
                            </option>
                            <option value="gpt-4-1106-preview">
                              gpt-4-1106-preview
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form>
                        <Form.Group controlId="additionalPrompt">
                          <Form.Label>Additional requirement?</Form.Label>
                          <Form.Control
                            onChange={(e) => {
                              this.onChangeEditorRequirements(e);
                            }}
                            placeholder="the length should be within 10000 characters / words, paragraph structure, etc."
                            as="textarea"
                          ></Form.Control>
                        </Form.Group>
                      </Form>
                    </Col>
                  </Row>

                  <br />
                  <Button
                    size="sm"
                    disabled={this.state.isGenerating}
                    onClick={this.onSubmit}
                  >
                    {this.state.isGenerating ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          role="status"
                        ></Spinner>
                        {'  '}
                        Generating
                      </>
                    ) : (
                      'Generate'
                    )}
                  </Button>
                  {this.state.isGenerating ? (
                    <Placeholder as={Card.Text} animation="glow">
                      <Placeholder xs={7} /> <Placeholder xs={5} />{' '}
                      <Placeholder xs={4} /> <Placeholder xs={8} />{' '}
                      <Placeholder xs={2} /> <Placeholder xs={3} />{' '}
                      <Placeholder xs={2} /> <Placeholder xs={3} />{' '}
                      <Placeholder xs={10} /> <Placeholder xs={1} />{' '}
                      <Placeholder xs={2} /> <Placeholder xs={3} />{' '}
                      <Placeholder xs={9} /> <Placeholder xs={2} />{' '}
                      <Placeholder xs={2} /> <Placeholder xs={3} />{' '}
                      <Placeholder xs={1} /> <Placeholder xs={9} />{' '}
                      <Placeholder xs={4} /> <Placeholder xs={8} />
                    </Placeholder>
                  ) : (
                    <p>
                      <LinkableNewlineText
                        text={this.state.data}
                      ></LinkableNewlineText>
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Aux>
    );
  }
}

export default DocModificationThreadInput;
