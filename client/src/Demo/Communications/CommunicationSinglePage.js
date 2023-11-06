import React, { Component } from 'react';
import { Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';

import Aux from '../../hoc/_Aux';
import MessageList from './MessageList';
import DocThreadEditor from './DocThreadEditor';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { spinner_style } from '../Utils/contants';

import {
  getCommunicationThread,
  postCommunicationThread,
  deleteAMessageInCommunicationThread,
  loadCommunicationThread
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { is_TaiGer_Student } from '../Utils/checking-functions';

class CommunicationSinglePage extends Component {
  state = {
    error: '',
    isLoaded: false,
    thread: null,
    upperThread: [],
    buttonDisabled: false,
    editorState: {},
    expand: true,
    pageNumber: 1,
    deadline: '',
    SetAsFinalFileModel: false,
    uppderaccordionKeys: [], // to expand all]
    accordionKeys: [0], // to expand all]
    loadButtonDisabled: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };
  componentDidMount() {
    getCommunicationThread(this.props.match.params.student_id).then(
      (resp) => {
        const { success, data, student } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            thread: data.reverse(),
            isLoaded: true,
            student_id: this.props.match.params.student_id,
            student,
            // accordionKeys: new Array(data.length)
            //   .fill()
            //   .map((x, i) => i) // to expand all
            accordionKeys: new Array(data.length)
              .fill()
              .map((x, i) => (i >= data.length - 2 ? i : -1)), // only expand latest 2
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

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.student_id !== this.props.match.params.student_id
    ) {
      getCommunicationThread(this.props.match.params.student_id).then(
        (resp) => {
          const { success, data, student } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              success,
              thread: data.reverse(),
              upperThread: [],
              isLoaded: true,
              loadButtonDisabled: false,
              pageNumber: 1,
              student_id: this.props.match.params.student_id,
              student,
              // accordionKeys: new Array(data.length)
              //   .fill()
              //   .map((x, i) => i) // to expand all
              accordionKeys: new Array(data.length)
                .fill()
                .map((x, i) => (i >= data.length - 2 ? i : -1)), // only expand latest 2
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
  }

  closeSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: false
    }));
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  singleExpandtUpperHandler = (idx) => {
    let uppderaccordionKeys = [...this.state.uppderaccordionKeys];
    uppderaccordionKeys[idx] = uppderaccordionKeys[idx] !== idx ? idx : -1;
    this.setState((state) => ({
      ...state,
      uppderaccordionKeys: uppderaccordionKeys
    }));
  };

  singleExpandtHandler = (idx) => {
    let accordionKeys = [...this.state.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    this.setState((state) => ({
      ...state,
      accordionKeys: accordionKeys
    }));
  };

  AllCollapsetHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: false,
      accordionKeys: new Array(this.state.thread.length)
        .fill()
        .map((x, i) => -1) // to collapse all]
    }));
  };

  AllExpandtHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys: new Array(this.state.thread.length)
        .fill()
        .map((x, i) => this.state.thread.length - i - 1) // to expand all]
    }));
  };

  handleLoadMessages = () => {
    this.setState({
      loadButtonDisabled: true
    });
    loadCommunicationThread(
      this.props.match.params.student_id,
      this.state.pageNumber + 1
    ).then(
      (resp) => {
        const { success, data, student } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            upperThread: [...data.reverse(), ...this.state.upperThread],
            isLoaded: true,
            student,
            pageNumber: this.state.pageNumber + 1,
            uppderaccordionKeys: [
              ...new Array(this.state.uppderaccordionKeys.length)
                .fill()
                .map((x, i) => i),
              ...new Array(data.length)
                .fill()
                .map((x, i) =>
                  this.state.uppderaccordionKeys !== -1
                    ? i + this.state.uppderaccordionKeys.length
                    : -1
                )
            ],
            loadButtonDisabled: data.length === 0 ? true : false,
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
  };

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    var message = JSON.stringify(editorState);

    postCommunicationThread(this.state.student._id.toString(), message).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            editorState: {},
            thread: [...this.state.thread, ...data],
            isLoaded: true,
            buttonDisabled: false,
            accordionKeys: [
              ...this.state.accordionKeys,
              this.state.accordionKeys.length
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
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: error
        }));
      }
    );
  };

  onDeleteSingleMessage = (e, message_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    deleteAMessageInCommunicationThread(
      this.props.match.params.student_id,
      message_id
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          // TODO: remove that message
          const new_messages = [...this.state.thread];
          let idx = new_messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx !== -1) {
            new_messages.splice(idx, 1);
          }
          const new_upper_messages = [...this.state.upperThread];
          let idx2 = new_upper_messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx2 !== -1) {
            new_upper_messages.splice(idx2, 1);
          }
          this.setState((state) => ({
            ...state,
            success,
            isLoaded: true,
            upperThread: new_upper_messages,
            thread: new_messages,
            buttonDisabled: false,
            res_modal_status: status
          }));
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

    const student_name = `${this.state.student.firstname} ${
      this.state.student.lastname
    } ${
      this.state.student.firstname_chinese
        ? this.state.student.firstname_chinese
        : ''
    } ${
      this.state.student.lastname_chinese
        ? this.state.student.lastname_chinese
        : ''
    }`;
    const template_input = JSON.parse(
      `{"time":1689452160435,"blocks":[{"id":"WHsFbpmWmH","type":"paragraph","data":{"text":"<b>我的問題：</b>"}},{"id":"F8K_f07R8l","type":"paragraph","data":{"text":"&lt;Example&gt; 我想選課，不知道下學期要選什麼"}},{"id":"yYUL0bYWSB","type":"paragraph","data":{"text":"<b>我想和顧問討論</b>："}},{"id":"wJu56jmAKC","type":"paragraph","data":{"text":"&lt;Example&gt; 課程符合度最佳化"}}],"version":"2.27.2"}`
    );
    TabTitle(`${student_name}`);
    return (
      <Aux>
        {!isLoaded && (
          <div style={spinner_style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        {this.state.student.archiv && (
          <Row className="sticky-top">
            <Col>
              <Card className="mb-2 mx-0" bg={'success'} text={'white'}>
                <Card.Header>
                  <Card.Title as="h5" className="text-light">
                    Status: <b>Close</b>
                  </Card.Title>
                </Card.Header>
              </Card>
            </Col>
          </Row>
        )}
        <Row>
          <Card className="mb-2 mx-0">
            <Card.Header>
              <h4 className="mt-1 ms-0" style={{ textAlign: 'left' }}>
                <Link
                  className="text-primary"
                  to={`/student-database/${this.state.student._id.toString()}/profile`}
                >
                  <b>{student_name}</b>
                </Link>
                {' - '}
                {' Contact your Agent'}
                {'   '}
                <span
                  className="text-light mb-0 me-2 "
                  style={{ float: 'right' }}
                >
                  {/* {this.state.expand ? (
                    <Button
                      className="btn-sm float-right"
                      onClick={() => this.AllCollapsetHandler()}
                    >
                      Collapse
                    </Button>
                  ) : (
                    <Button
                      className="btn-sm float-right"
                      onClick={() => this.AllExpandtHandler()}
                    >
                      Expand
                    </Button>
                  )} */}
                </span>
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
            <Card className="my-0 mx-0">
              <Card.Body>
                <Row>
                  <Col md={9}>
                    <h6>
                      <b>Instructions:</b> <br />
                      <br />
                      <p>
                        TaiGer顧問皆位於中歐時區，無法及時回復，為確保有
                        <b>效率溝通</b>，留言時請注意以下幾點：
                        <ul>
                          <li>
                            <b>
                              1. 請把{' '}
                              <Link
                                to={
                                  is_TaiGer_Student(this.props.user)
                                    ? `${DEMO.SURVEY_LINK}`
                                    : `${DEMO.STUDENT_DATABASE_LINK}/${this.state.student_id}/background`
                                }
                                className="text-primary"
                                target="_blank"
                              >
                                My Survey{' '}
                                <FiExternalLink
                                  className="mx-0 mb-1"
                                  style={{ cursor: 'pointer' }}
                                />
                              </Link>
                              填好,{' '}
                              <Link
                                to={
                                  is_TaiGer_Student(this.props.user)
                                    ? `${DEMO.BASE_DOCUMENTS_LINK}`
                                    : `${DEMO.STUDENT_DATABASE_LINK}/${this.state.student_id}/profile`
                                }
                                className="text-primary"
                                target="_blank"
                              >
                                Base Document{' '}
                                <FiExternalLink
                                  className="mx-0 mb-1"
                                  style={{ cursor: 'pointer' }}
                                />
                              </Link>
                              , 文件有的都盡量先掃描上傳,{' '}
                              <Link
                                to={`${DEMO.COURSES_LINK}/${this.state.student_id}`}
                                className="text-primary"
                                target="_blank"
                              >
                                My Courses{' '}
                                <FiExternalLink
                                  className="mx-0 mb-1"
                                  style={{ cursor: 'pointer' }}
                                />
                              </Link>
                              課程填好，之後 Agent 在回答問題時比較能掌握狀況。
                            </b>
                          </li>
                          <li>
                            2.
                            描述你的問題，請盡量一次列出所有問題，顧問可以一次回答。
                          </li>
                          <li>3. 你想要完成事項。</li>
                          <li>
                            註：或想一次處理，請準備好所有問題，並和顧問約時間通話。
                          </li>
                          <li>
                            TaiGer顧問平時的工作時段位於美國或歐洲時區，因此可能無法立即回覆您的訊息，敬請諒解。依據您的問題複雜度，顧問將會在一至五個工作日內回覆您。因此，請在訊息來往時保持有效率的溝通，以確保迅速解決問題。
                            顧問隨時需要了解您的進展情況，為了避免不必要的來回詢問學生資料進度，為此，請務必將您在TaiGer
                            Portal平台上的個人資訊保持最新，以確保訊息的準確性。
                          </li>
                        </ul>
                      </p>
                    </h6>
                  </Col>
                  <Col md={3}>
                    <b>Agents:</b>
                    <br />
                    {this.state.student?.agents?.map((agent, i) => (
                      // <Link>{`${agent.firstname} ${agent.lastname}`}</Link>
                      <p key={i}>
                        <Link
                          to={`/teams/agents/profile/${agent._id.toString()}`}
                        >{`${agent.firstname} ${agent.lastname}`}</Link>
                      </p>
                    ))}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Button
          onClick={this.handleLoadMessages}
          disabled={this.state.loadButtonDisabled}
        >
          Load
        </Button>
        <Row>
          {this.state.upperThread.length > 0 && (
            <MessageList
              accordionKeys={this.state.uppderaccordionKeys}
              student_id={this.state.student._id.toString()}
              isUpperMessagList={true}
              singleExpandtHandler={this.singleExpandtUpperHandler}
              thread={this.state.upperThread}
              isLoaded={this.state.isLoaded}
              user={this.props.user}
              onDeleteSingleMessage={this.onDeleteSingleMessage}
            />
          )}
          <MessageList
            accordionKeys={this.state.accordionKeys}
            student_id={this.state.student._id.toString()}
            isUpperMessagList={false}
            singleExpandtHandler={this.singleExpandtHandler}
            thread={this.state.thread}
            isLoaded={this.state.isLoaded}
            user={this.props.user}
            onDeleteSingleMessage={this.onDeleteSingleMessage}
          />
        </Row>
        {this.state.student.archiv !== true ? (
          <Row>
            <Card className="my-0 mx-0">
              <Card.Header>
                <Card.Title as="h5">
                  {this.props.user.firstname} {this.props.user.lastname}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {/* {this.state.student.agents?.length === 0 ? (
                  <Row style={{ textDecoration: 'none' }}>
                    <Col className="my-0 mx-0">
                      You don't have Agent yet. Please wait until you have
                      Agent.
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col className="my-0 mx-0">
                      <DocThreadEditor
                        thread={this.state.thread}
                        buttonDisabled={this.state.buttonDisabled}
                        editorState={this.state.editorState}
                        handleClickSave={this.handleClickSave}
                      />
                    </Col>
                  </Row>
                )} */}
                <Row>
                  <Col className="my-0 mx-0">
                    <DocThreadEditor
                      thread={this.state.thread}
                      buttonDisabled={this.state.buttonDisabled}
                      editorState={this.state.editorState}
                      handleClickSave={this.handleClickSave}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        ) : (
          <Row>
            <Card className="my-0 mx-0">
              <Card.Body>
                <Row style={{ textDecoration: 'none' }}>
                  <Col className="my-0 mx-0">
                    The service is finished. Therefore, it is readonly.
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
        )}
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
      </Aux>
    );
  }
}

export default CommunicationSinglePage;
