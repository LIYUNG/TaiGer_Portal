import React, { Component } from 'react';
import { Row, Col, Spinner, Button, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
              .map((x, i) =>
                i === data.length - 1 ? data.length - i - 1 : -1
              ), // to collapse all
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
              isLoaded: true,
              student_id: this.props.match.params.student_id,
              student,
              // accordionKeys: new Array(data.length)
              //   .fill()
              //   .map((x, i) => i) // to expand all
              accordionKeys: new Array(data.length)
                .fill()
                .map((x, i) =>
                  i === data.length - 1 ? data.length - i - 1 : -1
                ), // to collapse all
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
          console.log(new_upper_messages);
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

    const student_name = `${this.state.student.firstname} ${this.state.student.lastname}`;

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
                {'   '}
                {' Communication with Agent'}
                {'   '}
                <span
                  className="text-light mb-0 me-2 "
                  style={{ float: 'right' }}
                >
                  {this.state.expand ? (
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
                  )}
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
                  <Col>
                    <h5>Instruction</h5>
                    <h6>
                      <b>Requirements:</b>
                    </h6>
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
            isUpperMessagList={false}
            singleExpandtHandler={this.singleExpandtHandler}
            thread={this.state.thread}
            isLoaded={this.state.isLoaded}
            user={this.props.user}
            onDeleteSingleMessage={this.onDeleteSingleMessage}
          />
        </Row>
        {this.props.user.archiv !== true ? (
          <Row>
            <Card className="my-0 mx-0">
              <Card.Header>
                <Card.Title as="h5">
                  {this.props.user.firstname} {this.props.user.lastname}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {this.state.thread.isFinalVersion ? (
                  <Row style={{ textDecoration: 'none' }}>
                    <Col className="my-0 mx-0">
                      This discussion thread is close.
                    </Col>
                  </Row>
                ) : (
                  <Row style={{ textDecoration: 'none' }}>
                    <Col className="my-0 mx-0">
                      <DocThreadEditor
                        thread={this.state.thread}
                        buttonDisabled={this.state.buttonDisabled}
                        doc_title={'this.state.doc_title'}
                        editorState={this.state.editorState}
                        handleClickSave={this.handleClickSave}
                      />
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Row>
        ) : (
          <Row>
            <Card className="my-0 mx-0">
              <Card.Body>
                <Row style={{ textDecoration: 'none' }}>
                  <Col className="my-0 mx-0">
                    You service is finished. Therefore, you are in read only
                    mode.
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
