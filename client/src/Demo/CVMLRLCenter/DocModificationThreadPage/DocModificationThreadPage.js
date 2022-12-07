import React, { Component } from 'react';
import { Row, Col, Spinner, Button, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Aux from '../../../hoc/_Aux';
import MessageList from './MessageList';
import DocThreadEditor from './DocThreadEditor';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { spinner_style } from '../../Utils/contants';

import {
  getTemplateDownload,
  deleteDoc,
  SubmitMessageWithAttachment,
  getMessagThread,
  SetFileAsFinal
} from '../../../api';

class DocModificationThreadPage extends Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    pagenotfounderror: null,
    file: null,
    isLoaded: false,
    isSubmissionLoaded: true,
    articles: [],
    isEdit: false,
    thread: [],
    editFormOpen: false,
    defaultStep: 1,
    buttonDisabled: false,
    editorState: {},
    expand: true,
    SetAsFinalFileModel: false,
    accordionKeys: [0], // to expand all]
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };
  componentDidMount() {
    getMessagThread(this.props.match.params.documentsthreadId).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            thread: data,
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
        this.setState({
          isLoaded: false,
          error
        });
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
    this.setState({ file: e.target.files[0] });
  };

  handleEditorChange = (newstate) => {
    this.setState((state) => ({ ...state, editorState: newstate }));
  };

  onDownloadTemplate = (e, category) => {
    e.preventDefault();
    getTemplateDownload(category).then(
      (resp) => {
        const actualFileName =
          resp.headers['content-disposition'].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split('.'); //split file name
        filetype = filetype.pop(); //get the file type

        if (filetype === 'pdf') {
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: 'application/pdf' })
          );

          // Open the URL on new Window
          var newWindow = window.open(url, '_blank'); //TODO: having a reasonable file name, pdf viewer
          newWindow.document.title = actualFileName;
        } else {
          //if not pdf, download instead.

          const url = window.URL.createObjectURL(new Blob([blob]));

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', actualFileName);
          // Append to html link element page
          document.body.appendChild(link);
          // Start download
          link.click();
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        }
      },
      (error) => {
        alert('The file is not available.');
      }
    );
  };

  handleTrashClick = (articleId) => {
    this.deleteArticle(articleId);
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  deleteArticle = (articleId) => {
    this.setState({
      articles: this.state.articles.filter(
        (article) => article._id !== articleId
      )
    });

    deleteDoc(articleId).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
        } else {
          this.setState({
            isLoaded: true,
            res_modal_status: status
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: false,
          error
        });
      }
    );
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
      if (thread.program_id.essay_required === 'yes') {
        return (
          <p>
            {this.state.thread.program_id.essay_requirements
              ? this.state.thread.program_id.essay_requirements
              : 'No'}
          </p>
        );
      } else {
        return <p>No</p>;
      }
    } else if (thread.file_type.includes('ML')) {
      if (thread.program_id.ml_required === 'yes') {
        return (
          <p>
            {this.state.thread.program_id.ml_requirements
              ? this.state.thread.program_id.ml_requirements
              : 'No'}
          </p>
        );
      } else {
        return <p>No</p>;
      }
    } else if (thread.file_type.includes('RL')) {
      if (thread.program_id.rl_required === 'yes') {
        return (
          <p>
            {this.state.thread.program_id.rl_requirements
              ? this.state.thread.program_id.rl_requirements
              : 'No'}
          </p>
        );
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
    formData.append('file', this.state.file);
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
        this.setState({ error });
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
      temp_program_id,
      true
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isSubmissionLoaded: true,
            thread: { ...state.thread, isFinalVersion: data },
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
        this.setState({ error });
      }
    );
  };

  render() {
    const {
      isLoaded,
      isSubmissionLoaded,
      res_status,
      res_modal_status,
      res_modal_message
    } = this.state;

    if (!isLoaded && !this.state.data) {
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

    let template_obj = window.templatelist.find(({ prop }) =>
      prop.includes(this.state.thread.file_type.split('_')[0])
    );

    let docName;
    if (this.state.thread.program_id) {
      docName =
        this.state.thread.student_id.firstname +
        ' ' +
        this.state.thread.student_id.lastname +
        ' - ' +
        this.state.thread.program_id.school +
        ' ' +
        this.state.thread.program_id.program_name +
        ' ' +
        this.state.thread.file_type;
    } else {
      docName =
        this.state.thread.student_id.firstname +
        ' ' +
        this.state.thread.student_id.lastname +
        ' - ' +
        this.state.thread.file_type;
    }

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
              <Card.Title as="h5">
                {docName}
                {' Discussion thread'}
                {'   '}
                {this.state.expand ? (
                  <Button
                    className="btn-sm float-right"
                    onClick={() => this.AllCollapsetHandler()}
                  >
                    Collaspse
                  </Button>
                ) : (
                  <Button
                    className="btn-sm float-right"
                    onClick={() => this.AllExpandtHandler()}
                  >
                    Expand
                  </Button>
                )}
              </Card.Title>
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

        <Row>
          <Card className="mb-2 mx-0">
            <Card.Body>
              <Col>
                <h5>Instruction</h5>
                <p>
                  Please fill our TaiGer template and attach the filled template
                  in this discussion.
                </p>
                <p>
                  Download template:{' '}
                  {template_obj ? (
                    <b
                      style={{ cursor: 'pointer' }}
                      onClick={(e) =>
                        this.onDownloadTemplate(e, template_obj.prop)
                      }
                    >
                      Link
                    </b>
                  ) : (
                    <>Not available</>
                  )}
                </p>
              </Col>
              <Col>
                <h6>
                  <b>Requirements:</b>
                  {(this.props.user.role === 'Agent' ||
                    this.props.user.role === 'Admin') &&
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
                  <>
                    <p>No</p>
                  </>
                )}
                <h6>
                  <b>Deadline</b>
                  {(this.props.user.role === 'Agent' ||
                    this.props.user.role === 'Admin') &&
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
                {this.state.thread.program_id && (
                  <h6>
                    {this.state.thread.student_id.application_preference &&
                    this.state.thread.student_id.application_preference
                      .expected_application_date
                      ? this.state.thread.student_id.application_preference
                          .expected_application_date + '-'
                      : ''}
                    {this.state.thread.program_id.application_deadline}
                  </h6>
                )}
              </Col>
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <MessageList
            documentsthreadId={this.state.documentsthreadId}
            accordionKeys={this.state.accordionKeys}
            singleExpandtHandler={this.singleExpandtHandler}
            thread={this.state.thread}
            onTrashClick={this.handleTrashClick}
            isLoaded={this.state.isLoaded}
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
        {(this.props.user.role === 'Editor' ||
          this.props.user.role === 'Agent' ||
          this.props.user.role === 'Admin') &&
          (!this.state.thread.isFinalVersion ? (
            <Row className="mt-2">
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
            </Row>
          ) : (
            <Row className="mt-2">
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
            Do you want to set {docName} as{' '}
            {this.state.thread.isFinalVersion ? 'open' : 'final'}?
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
