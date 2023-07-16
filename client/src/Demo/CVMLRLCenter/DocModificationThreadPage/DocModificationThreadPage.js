import React, { Component } from 'react';
import { Row, Col, Spinner, Button, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';

import Aux from '../../../hoc/_Aux';
import MessageList from './MessageList';
import DocThreadEditor from './DocThreadEditor';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { spinner_style, templatelist } from '../../Utils/contants';

import {
  is_TaiGer_AdminAgent,
  is_TaiGer_role,
  showButtonIfMyStudentB
} from '../../Utils/checking-functions';
import { BASE_URL } from '../../../api/request';

import {
  SubmitMessageWithAttachment,
  getMessagThread,
  deleteAMessageInThread,
  SetFileAsFinal
} from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';

class DocModificationThreadPage extends Component {
  state = {
    error: '',
    file: null,
    isLoaded: false,
    isSubmissionLoaded: true,
    articles: [],
    isEdit: false,
    thread: null,
    buttonDisabled: false,
    editorState: {},
    expand: true,
    editors: [],
    agents: [],
    deadline: '',
    SetAsFinalFileModel: false,
    accordionKeys: [0], // to expand all]
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };
  componentDidMount() {
    getMessagThread(this.props.match.params.documentsthreadId).then(
      (resp) => {
        const { success, data, editors, agents, deadline } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            thread: data,
            editors,
            agents,
            deadline,
            isLoaded: true,
            documentsthreadId: this.props.match.params.documentsthreadId,
            file: null,
            // accordionKeys: new Array(data.messages.length)
            //   .fill()
            //   .map((x, i) => i) // to expand all
            accordionKeys: new Array(data.messages.length)
              .fill()
              .map((x, i) => (i === data.messages.length - 1 ? i : -1)), // to collapse all
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

  closeSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: false
    }));
  };

  onFileChange = (e) => {
    e.preventDefault();
    const file_num = e.target.files.length;
    if (file_num <= 3) {
      this.setState({ file: Array.from(e.target.files) });
    } else {
      this.setState({
        res_modal_message: 'You can only select up to 3 files.',
        res_modal_status: 423
      });
    }
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
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
      accordionKeys: new Array(this.state.thread.messages.length)
        .fill()
        .map((x, i) => -1) // to collapse all]
    }));
  };

  AllExpandtHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys: new Array(this.state.thread.messages.length)
        .fill()
        .map((x, i) => i) // to expand all]
    }));
  };

  getRequirement = (thread) => {
    if (thread.file_type.includes('Essay')) {
      return (
        <p>
          {thread.program_id.essay_required === 'yes'
            ? this.state.thread.program_id.essay_requirements || 'No'
            : 'No'}
        </p>
      );
    } else if (thread.file_type.includes('ML')) {
      if (thread.program_id.ml_required === 'yes') {
        return <p>{this.state.thread.program_id.ml_requirements || 'No'}</p>;
      } else {
        return <p>No</p>;
      }
    } else if (thread.file_type.includes('Portfolio')) {
      if (thread.program_id.portfolio_required === 'yes') {
        return (
          <p>{this.state.thread.program_id.portfolio_requirements || 'No'}</p>
        );
      } else {
        return <p>No</p>;
      }
    } else if (thread.file_type.includes('Supplementary_Form')) {
      if (thread.program_id.supplementary_form_required === 'yes') {
        return (
          <p>
            {this.state.thread.program_id.supplementary_form_requirements ||
              'No'}
          </p>
        );
      } else {
        return <p>No</p>;
      }
    } else if (thread.file_type.includes('RL')) {
      if (['1', '2', '3'].includes(thread.program_id.rl_required)) {
        return <p>{this.state.thread.program_id.rl_requirements || 'No'}</p>;
      } else {
        return <p>No</p>;
      }
    }
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
      this.state.thread.student_id._id,
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

  handleAsFinalFile = (doc_thread_id, student_id, program_id) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      student_id,
      program_id,
      SetAsFinalFileModel: true
    }));
  };

  ConfirmSetAsFinalFileHandler = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isSubmissionLoaded: false // false to reload everything
    }));
    const temp_program_id = this.state.program_id
      ? this.state.program_id._id.toString()
      : undefined;
    SetFileAsFinal(
      this.state.doc_thread_id,
      this.state.student_id,
      temp_program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isSubmissionLoaded: true,
            thread: {
              ...state.thread,
              isFinalVersion: data.isFinalVersion,
              updatedAt: data.updatedAt
            },
            success: success,
            SetAsFinalFileModel: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            isSubmissionLoaded: true,
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

  onDeleteSingleMessage = (e, message_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    deleteAMessageInThread(this.state.documentsthreadId, message_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          // TODO: remove that message
          var new_messages = [...this.state.thread.messages];
          let idx = this.state.thread.messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx !== -1) {
            new_messages.splice(idx, 1);
          }
          this.setState((state) => ({
            ...state,
            success,
            isLoaded: true,
            thread: {
              ...this.state.thread,
              messages: new_messages
            },
            buttonDisabled: false,
            // accordionKeys: [
            //   ...this.state.accordionKeys,
            //   new_messages.length - 1
            // ],
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
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  render() {
    const {
      isLoaded,
      isSubmissionLoaded,
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
    let widths = [];
    if (this.state.thread.file_type === 'CV') {
      widths = [9, 2, 1];
    } else {
      widths = [10, 2];
    }

    // Only CV, ML RL has instructions and template.
    let template_obj = templatelist.find(
      ({ prop, alias }) =>
        prop.includes(this.state.thread.file_type.split('_')[0]) ||
        alias.includes(this.state.thread.file_type.split('_')[0])
    );
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
                  to={`/student-database/${this.state.thread.student_id._id.toString()}/profile`}
                >
                  <b>{student_name}</b>
                </Link>
                {'   '}
                {docName}
                {' Discussion thread'}
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
                  <Col md={widths[0]}>
                    <h5>Instruction</h5>
                    {template_obj ? (
                      <>
                        <p>
                          請填好我們的 TaiGer
                          Template，並在這個討論串夾帶在和您的 Editor
                          討論。回覆時請用 <b>英語(English)</b>{' '}
                          好讓外籍顧問方便溝通。有任何流程疑問{' '}
                          <Link to={`${DEMO.CV_ML_RL_DOCS_LINK}`}>
                            <Button size="sm" variant="info">
                              點我
                            </Button>
                          </Link>
                          <br />
                          Please fill our TaiGer template and attach the filled
                          template and reply in
                          <b> English</b> in this discussion. Any process
                          question:{' '}
                          <Link to={`${DEMO.CV_ML_RL_DOCS_LINK}`}>
                            <Button size="sm" variant="info">
                              Read More
                            </Button>
                          </Link>
                        </p>
                        <p>
                          模板下載 Download template:{' '}
                          {template_obj ? (
                            template_obj.prop.includes('RL') ||
                            template_obj.alias.includes('Recommendation') ? (
                              <b>
                                教授：
                                <a
                                  href={`${BASE_URL}/api/account/files/template/${'RL_academic_survey_lock'}`}
                                  target="_blank"
                                >
                                  <Button size="sm" variant="secondary">
                                    <b>Link [點我下載]</b>
                                  </Button>
                                </a>
                                主管：
                                <a
                                  href={`${BASE_URL}/api/account/files/template/${`RL_employer_survey_lock`}`}
                                  target="_blank"
                                >
                                  <Button size="sm" variant="secondary">
                                    <b>Link [點我下載]</b>
                                  </Button>
                                </a>
                              </b>
                            ) : (
                              <b>
                                <a
                                  href={`${BASE_URL}/api/account/files/template/${template_obj.prop}`}
                                  target="_blank"
                                >
                                  <Button size="sm" variant="secondary">
                                    <b>Link [點我下載]</b>
                                  </Button>
                                </a>
                              </b>
                            )
                          ) : (
                            <>Not available</>
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          {this.state.thread.file_type === 'Portfolio'
                            ? 'Please upload the portfolio in Microsoft Word form here so that your Editor can help you for the text modification'
                            : this.state.thread.file_type ===
                              'Supplementary_Form'
                            ? '請填好這個 program 的 Supplementory Form / Curriculum Analysis，並在這討論串夾帶該檔案 (通常為 .xls, xlsm, .pdf 檔) 上傳。'
                            : '-'}
                        </p>
                      </>
                    )}

                    <h6>
                      <b>Requirements:</b>
                      {is_TaiGer_AdminAgent(this.props.user) &&
                        this.state.thread.program_id && (
                          <Link
                            to={`/programs/${this.state.thread.program_id._id.toString()}`}
                            target="_blank"
                          >
                            {' '}
                            [Update]
                          </Link>
                        )}
                    </h6>
                    {this.state.thread.program_id ? (
                      <>{this.getRequirement(this.state.thread)}</>
                    ) : (
                      <p>No</p>
                    )}
                  </Col>
                  <Col md={widths[1]}>
                    <h6>
                      <b>Agent:</b>
                      {this.state.agents.map((agent, i) => (
                        <p>
                          {is_TaiGer_role(this.props.user) ? (
                            <Link
                              to={`/teams/agents/${agent._id.toString()}`}
                              target="_blank"
                            >
                              {agent.firstname} {agent.lastname}
                            </Link>
                          ) : (
                            <>
                              {agent.firstname} {agent.lastname}
                            </>
                          )}
                        </p>
                      ))}
                    </h6>
                    <h6>
                      <b>Editor:</b>
                      {this.state.editors.map((editor, i) => (
                        <p>
                          {is_TaiGer_role(this.props.user) ? (
                            <Link
                              to={`/teams/editors/${editor._id.toString()}`}
                              target="_blank"
                            >
                              {editor.firstname} {editor.lastname}
                            </Link>
                          ) : (
                            <>
                              {editor.firstname} {editor.lastname}
                            </>
                          )}
                        </p>
                      ))}
                    </h6>

                    <h6>
                      <b>Deadline:</b>
                      {is_TaiGer_AdminAgent(this.props.user) &&
                        this.state.thread.program_id && (
                          <Link
                            to={`/programs/${this.state.thread.program_id._id.toString()}`}
                            target="_blank"
                          >
                            {' '}
                            [Update]
                          </Link>
                        )}
                    </h6>
                    <p>{this.state.deadline}</p>
                  </Col>
                  {this.state.thread.file_type === 'CV' && (
                    <Col md={widths[2]}>
                      <h6>
                        <b>Profile photo:</b>
                        <img
                          // className="d-block w-100"
                          src={`${BASE_URL}/api/students/${this.state.thread.student_id._id}/files/Passport_Photo`}
                          height="100%"
                          width="100%"
                        />
                      </h6>
                      If image not shown, please go to{' '}
                      <a href="/base-documents">
                        <b>Base Documents</b>
                        <FiExternalLink
                          className="mx-1 mb-1"
                          style={{ cursor: 'pointer' }}
                        />
                      </a>{' '}
                      and upload the Passport Photo.
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <MessageList
            documentsthreadId={this.state.documentsthreadId}
            accordionKeys={this.state.accordionKeys}
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
                        file={this.state.file}
                        onFileChange={this.onFileChange}
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
        {is_TaiGer_role(this.props.user) &&
          (!this.state.thread.isFinalVersion ? (
            <Row className="mt-2">
              {showButtonIfMyStudentB(
                this.props.user,
                this.state.thread.student_id
              ) && (
                <Button
                  variant="success"
                  onClick={(e) =>
                    this.handleAsFinalFile(
                      this.state.thread._id,
                      this.state.thread.student_id._id,
                      this.state.thread.program_id,
                      this.state.thread.isFinalVersion
                    )
                  }
                >
                  {isSubmissionLoaded ? (
                    'Mark as finished'
                  ) : (
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  )}
                </Button>
              )}
            </Row>
          ) : (
            <Row className="mt-2">
              {showButtonIfMyStudentB(
                this.props.user,
                this.state.thread.student_id
              ) && (
                <Button
                  variant="danger"
                  onClick={(e) =>
                    this.handleAsFinalFile(
                      this.state.thread._id,
                      this.state.thread.student_id._id,
                      this.state.thread.program_id,
                      this.state.thread.isFinalVersion
                    )
                  }
                >
                  {isSubmissionLoaded ? (
                    'Mark as open'
                  ) : (
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  )}
                </Button>
              )}
            </Row>
          ))}
        <Modal
          show={this.state.SetAsFinalFileModel}
          onHide={this.closeSetAsFinalFileModelWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set{' '}
            <b>
              {student_name} {docName}
            </b>{' '}
            as <b>{this.state.thread.isFinalVersion ? 'open' : 'final'}</b>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!isLoaded || !isSubmissionLoaded}
              onClick={(e) => this.ConfirmSetAsFinalFileHandler(e)}
            >
              {isSubmissionLoaded ? (
                'Yes'
              ) : (
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden"></span>
                </Spinner>
              )}
            </Button>
            <Button onClick={this.closeSetAsFinalFileModelWindow}>No</Button>
          </Modal.Footer>
        </Modal>
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

export default DocModificationThreadPage;
