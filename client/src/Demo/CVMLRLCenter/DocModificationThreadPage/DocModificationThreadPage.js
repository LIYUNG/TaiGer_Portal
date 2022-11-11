import React, { Component } from 'react';
import { Row, Col, Spinner, Button, Card, Form } from 'react-bootstrap';
import Aux from '../../../hoc/_Aux';
import MessageList from './MessageList';
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import DocThreadEditor from './DocThreadEditor';
import TimeOutErrors from '../../Utils/TimeOutErrors';
import UnauthorizedError from '../../Utils/UnauthorizedError';
import PageNotFoundError from '../../Utils/PageNotFoundError';

// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import '../../../components/DraftEditor.css';
import {
  getTemplateDownload,
  deleteDoc,
  SubmitMessageWithAttachment,
  getMessageFileDownload,
  getMessagThread
} from '../../../api';

// const steps = [
//   'Step 1: Get an account',
//   'Step 2: Fill personal information',
//   'Step 3: Choose programs',
//   'Step 4: Pay',
//   'Step 5: Send copy to Germany'
// ];
class DocModificationThreadPage extends Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    pagenotfounderror: null,
    file: null,
    isLoaded: false,
    articles: [],
    isEdit: false,
    thread: [],
    editFormOpen: false,
    defaultStep: 1,
    buttonDisabled: false,
    editorState: {},
    expand: true,
    accordionKeys: [0] // to expand all]
  };
  componentDidMount() {
    getMessagThread(this.props.match.params.documentsthreadId).then(
      (resp) => {
        const { success, data } = resp.data;
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
              .map((x, i) => (i === data.messages.length - 1 ? i : -1)) // to collapse all
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          } else if (resp.status === 400) {
            this.setState({ isLoaded: true, pagenotfounderror: true });
          }
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

  onDownloadFileInMessage = (e, message_id, file_id) => {
    e.preventDefault();
    getMessageFileDownload(
      this.state.documentsthreadId,
      message_id,
      file_id
    ).then(
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

  deleteArticle = (articleId) => {
    this.setState({
      articles: this.state.articles.filter(
        (article) => article._id !== articleId
      )
    });

    deleteDoc(articleId).then(
      (result) => {},
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
            ]
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          } else {
            this.setState({ isLoaded: true, pagenotfounderror: true });
          }
        }
      },
      (error) => {
        this.setState({ error });
      }
    );
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  render() {
    const { pagenotfounderror, unauthorizederror, timeouterror, isLoaded } =
      this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
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
    if (pagenotfounderror) {
      return (
        <div>
          <PageNotFoundError />
        </div>
      );
    }
    if (!isLoaded && !this.state.data) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    let template_obj = window.templatelist.find(({ prop }) =>
      prop.includes(this.state.thread.file_type.split('_')[0])
    );

    return (
      <Aux>
        {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        <Row>
          <Card className="mb-2 mx-0">
            <Card.Header>
              <Card.Title as="h5">
                {this.state.thread.student_id.firstname}{' '}
                {this.state.thread.student_id.lastname}
                {' - '}
                {this.state.thread.program_id
                  ? this.state.thread.program_id.school +
                    ' ' +
                    this.state.thread.program_id.program_name
                  : ''}{' '}
                {this.state.thread.file_type}
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
        <Row>
          <Card className="mb-2 mx-0">
            <Card.Body>
              <Col md={6}>
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
              <Col md={6}>
                <h6>
                  <b>Requirements:</b>
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
            onDownloadFileInMessage={this.onDownloadFileInMessage}
            accordionKeys={this.state.accordionKeys}
            singleExpandtHandler={this.singleExpandtHandler}
            thread={this.state.thread}
            onTrashClick={this.handleTrashClick}
            // role={this.props.user.role}
            isLoaded={this.state.isLoaded}
          />
        </Row>
        <Row>
          <Card className="my-0 mx-0">
            <Card.Header>
              <Card.Title as="h5">
                {this.props.user.firstname} {this.props.user.lastname}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row style={{ textDecoration: 'none' }}>
                <Col className="my-0 mx-0">
                  <DocThreadEditor
                    buttonDisabled={this.state.buttonDisabled}
                    doc_title={'this.state.doc_title'}
                    editorState={this.state.editorState}
                    handleClickSave={this.handleClickSave}
                    handleClickCancel={this.handleClickCancel}
                    // readOnlyMode={this.readOnlyMode}
                    role={this.props.role}
                    file={this.state.file}
                    onFileChange={this.onFileChange}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
      </Aux>
    );
  }
}

export default DocModificationThreadPage;
