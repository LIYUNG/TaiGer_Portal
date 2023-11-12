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
  COUNTRIES_MAPPING,
  spinner_style,
  spinner_style2,
  templatelist
} from '../../Utils/contants';

import {
  LinkableNewlineText,
  getRequirement,
  is_TaiGer_AdminAgent,
  is_TaiGer_Student,
  is_TaiGer_role
} from '../../Utils/checking-functions';
import { BASE_URL } from '../../../api/request';

import {
  SubmitMessageWithAttachment,
  cvmlrlAi,
  getStudentInput
} from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import FilesList from './FilesList';

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
        if (success) {
          this.setState({
            success,
            thread: data,
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

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    var message = JSON.stringify(editorState);
    const formData = new FormData();

    if (this.state.file) {
      this.state.file.forEach((file) => {
        formData.append('files', file);
      });
    }

    // formData.append('files', this.state.file);
    formData.append('message', message);

    SubmitMessageWithAttachment(
      this.state.documentsthreadId,
      this.state.thread.student_id?._id,
      formData
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            file: null,
            editorState: {},
            thread: data,
            isLoaded: true,
            buttonDisabled: false,
            accordionKeys: [
              ...this.state.accordionKeys,
              data.messages.length - 1
            ],
            res_modal_status: status
          });
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  onChange = (e) => {
    const prompt_temp = e.target.value;
    console.log(prompt_temp);
    this.setState({
      prompt: prompt_temp
    });
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
      const result = await this.mockApiCall('testing mocked api call', 2000);

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
    this.fetchData();
    // cvmlrlAi(this.state.prompt).then(
    //   (resp) => {
    //     const { data, success } = resp.data;
    //     const { status } = resp;
    //     if (success) {
    //       this.setState({
    //         isLoaded: true,
    //         isGenerating: false,
    //         data,
    //         success: success,
    //         res_status: status
    //       });
    //     } else {
    //       this.setState({
    //         isLoaded: true,
    //         isGenerating: false,
    //         res_status: status
    //       });
    //     }
    //   },
    //   (error) => {
    //     this.setState((state) => ({
    //       ...state,
    //       isLoaded: true,
    //       isGenerating: false,
    //       error,
    //       res_status: 500
    //     }));
    //   }
    // );
  };

  render() {
    const {
      isLoaded,
      isFilesListOpen,
      isSubmissionLoaded,
      conflict_list,
      res_status,
      res_modal_status,
      res_modal_message
    } = this.state;
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
                  Please answer the following questions in <b>English</b>! Your
                  editor can only undertand English.
                </h4>
                <Form>
                  <Form.Group>
                    <Form.Label>
                      1. Why do you want to study in{' '}
                      {COUNTRIES_MAPPING[
                        this.state.thread.program_id.country
                      ] || 'this country'}{' '}
                      and not in your home country or any other country?
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>
                      2. What is your dream job you want to do after you have
                      graduated? What do you want to become professionally?
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>
                      3. Why do you think your field of interest (= area of the
                      programs you want to apply for) is important now and in
                      the future?
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>
                      4. How did your previous education/academic experience
                      (學術界的相關經驗) prepare you for your future studies?
                      What did you learn so far? (e.g. courses, projects,
                      achievements, …)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>
                      5. How did your previous practical experience
                      (實習、工作的相關經驗) prepare you for your future
                      studies? What did you learn? (e.g. experiences during
                      internship/jobs/…)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>
                      6. What are your 3 biggest strengths? (abilities, personal
                      characteristics, …)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>
                      7. Why should the {this.state.thread.program_id.school}{' '}
                      select you as their student? What can you contribute to
                      the universities?
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>
                      8. Anything else you want to tell us?
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>
                      9. Why do you want to study exactly at the{' '}
                      {this.state.thread.program_id
                        ? `${this.state.thread.program_id.school} - ${this.state.thread.program_id.program_name}`
                        : ''}
                      ? What is special about them?
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={this.onChange}
                    ></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Button size="sm">
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
                        <Form.Group>
                          <Form.Label>Use requirements?</Form.Label>
                          <Form.Check></Form.Check>
                        </Form.Group>
                      </Form>
                    </Col>
                    <Col>
                      <Form>
                        <Form.Group controlId="outputLanguage">
                          <Form.Label>Output language?</Form.Label>
                          <Form.Control
                            defaultValue="English"
                            onChange={(e) => {}}
                            as="select"
                          >
                            <option value="English">English</option>
                            <option value="German">German</option>
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </Col>
                    <Col>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form>
                        <Form.Group controlId="additionalPrompt">
                          <Form.Label>Additional requirement?</Form.Label>
                          <Form.Control
                            onChange={(e) => {}}
                            placeholder="the length should be within 10000 characters / words"
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
