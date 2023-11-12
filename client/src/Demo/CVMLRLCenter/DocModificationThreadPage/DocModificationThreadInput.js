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
  spinner_style
} from '../../Utils/contants';

import {
  LinkableNewlineText,
  getRequirement,
  is_TaiGer_role
} from '../../Utils/checking-functions';

import { cvmlrlAi, getStudentInput } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';

class DocModificationThreadInput extends Component {
  state = {
    error: '',
    isGenerating: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };
  componentDidMount() {
    getStudentInput(this.props.match?.params.documentsthreadId).then(
      (resp) => {
        const { success, data, editors, agents, deadline, conflict_list } =
          resp.data;
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
            questions: temp_question,
            program_requirements: {},
            editor_requirements: {},
            editors,
            agents,
            deadline,
            conflict_list,
            isLoaded: true,
            documentsthreadId: this.props.match.params.documentsthreadId,
            file: null,
            // accordionKeys: new Array(data.messages.length)
            //   .fill()
            //   .map((x, i) => i) // to expand all
            accordionKeys: new Array(data.messages?.length)
              .fill()
              .map((x, i) => (i === data.messages?.length - 1 ? i : -1)), // to collapse all
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
    const temp_questions = [...this.state.questions];
    const temp_q = temp_questions.find((qa) => qa.question_id === id);
    temp_q.answer = ans;
    this.setState({
      questions: temp_questions
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
        program_requirements: checked ? getRequirement(this.state.thread) : ''
      });
      console.log('useProgramRequirementData');
      return;
    }
    if (id === 'useStudentBackgroundData') {
      const checked = e.target.checked;
      this.setState({
        editor_requirements: {
          ...this.state.editor_requirements,
          [id]: checked
        }
      });
      console.log('useStudentBackgroundData');
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

  onSaveAsDraft = (Questions) => {
    console.log(Questions);
    console.log(JSON.stringify(Questions));
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
    console.log(JSON.stringify(this.state.questions));
    console.log(JSON.stringify(this.state.program_requirements));
    console.log(JSON.stringify(this.state.editor_requirements));

    // this.fetchData();

    cvmlrlAi(
      JSON.stringify(this.state.questions),
      JSON.stringify(this.state.program_requirements),
      JSON.stringify(this.state.editor_requirements),
      this.state.thread.student_id._id.toString()
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
                {this.state.questions.map((qa, i) => (
                  <Form className="mb-2" key={i}>
                    <Form.Group controlId={qa.question_id}>
                      <Form.Label>{qa.question}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={qa.rows || '1'}
                        placeholder={qa.placeholder}
                        defaultValue={qa.anwser}
                        onChange={this.onChange}
                      ></Form.Control>
                    </Form.Group>
                  </Form>
                ))}

                <Button
                  size="sm"
                  onClick={(e) => this.onSaveAsDraft(this.state.questions)}
                >
                  <b>Submit</b>
                </Button>
                <Button variant="outline-primary" size="sm">
                  Save as draft
                </Button>
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
                        <Form.Group controlId="useStudentBackgroundData">
                          <Form.Label>
                            Use student's background data (major,
                            current/graduated university)?
                          </Form.Label>
                          <Form.Check
                            type="checkbox"
                            value={
                              this.editor_requirements?.useStudentBackgroundData
                            }
                            checked={
                              this.editor_requirements?.useStudentBackgroundData
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
                            {/* <option value="gpt-3.5-turbo-16k">
                              gpt-3.5-turbo-16k
                            </option>
                            <option value="gpt-4">gpt-4</option>
                            <option value="gpt-4-32k">gpt-4-32k</option>
                            <option value="text-embedding-ada-002">
                              text-embedding-ada-002
                            </option> */}
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
