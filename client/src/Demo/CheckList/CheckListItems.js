import React from 'react';

import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Link } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../components/DraftEditor.css';

// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import {
  Row,
  Col,
  Button,
  Card,
  Collapse,
  Modal,
  Spinner
} from 'react-bootstrap';
import { updateChecklistDocument } from '../../api';
import {
  // AiOutlineDownload,
  // AiOutlineDelete,
  // AiOutlineCheck,
  AiOutlineMore
  // AiOutlineUndo,
  // AiFillMessage
} from 'react-icons/ai';

class CheckListItems extends React.Component {
  state = {
    timeouterror: null,
    unauthorizederror: null,
    student: this.props.student,
    deleteFileWarningModel: false,
    SetAsFinalFileModel: false,
    Requirements_Modal: false,
    in_edit_mode: false,
    student_id: '',
    doc_thread_id: '',
    applicationId: '',
    editorState: null,
    ConvertedContent: '',
    isLoaded: false,
    requirements: '',
    file: '',
    isThreadExisted: false
  };
  componentDidMount() {
    var initialEditorState = null;
    if (this.props.message) {
      const rawContentFromStore = convertFromRaw(
        JSON.parse(this.props.message)
      );
      initialEditorState = EditorState.createWithContent(rawContentFromStore);
    } else {
      initialEditorState = EditorState.createEmpty();
    }
    this.setState((state) => ({
      ...state,
      editorState: initialEditorState,
      ConvertedContent: initialEditorState,
      isLoaded: true
    }));

    // this.setState((state) => ({
    //   isLoaded: true
    // }));
  }
  handleClickEdit = (e) => {
    e.preventDefault();
    this.setState((state) => ({ ...state, in_edit_mode: true }));
  };
  handleClickCancel = (e) => {
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };
  handleClickSave = (e, editorState) => {
    e.preventDefault();
    const message = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    // TODO: API to save in database
    const msg = { prop: this.props.item, text: message };
    updateChecklistDocument(msg).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            isLoaded: true
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
        this.setState({ error });
      }
    );
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  handleEditorChange = (newstate) => {
    this.setState((state) => ({ ...state, editorState: newstate }));
  };

  render() {
    const { timeouterror, unauthorizederror, error, isLoaded } = this.state;
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
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
    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <>
        <Collapse
          in={this.props.accordionKeys[this.props.idx] === this.props.idx}
        >
          <div id="accordion1">
            {this.state.in_edit_mode ? (
              <>
                <Row style={{ textDecoration: 'none' }}>
                  <Col className="my-0 mx-0">
                    <Editor
                      // toolbarOnFocus
                      // toolbarHidden
                      spellCheck={true}
                      // onFocus={onClick={this.handle}}
                      placeholder={'Write comments'}
                      editorState={this.state.editorState}
                      onEditorStateChange={this.handleEditorChange}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      toolbar={{
                        // options: [
                        //   'inline',
                        //   'fontSize',
                        //   'fontFamily',
                        //   'list',
                        //   'textAlign',
                        //   // "colorPicker",
                        //   'link',
                        //   'image'
                        //   // "file",
                        // ],
                        link: {
                          defaultTargetOption: '_blank',
                          popupClassName: 'mail-editor-link'
                        },
                        image: {
                          urlEnabled: true,
                          uploadEnabled: true,
                          uploadCallback: this.uploadImageCallBack,
                          alignmentEnabled: true,
                          defaultSize: {
                            height: 'auto',
                            width: 'auto'
                          },
                          inputAccept:
                            'application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel'
                        }
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="my-0 mx-4">
                    {(this.props.role === 'Admin' ||
                      this.props.role === 'Agent') && (
                      <>
                        <Button
                          onClick={(e) =>
                            this.handleClickSave(e, this.state.editorState)
                          }
                        >
                          Save
                        </Button>
                        <Button
                          onClick={(e) =>
                            this.handleClickCancel(e, this.state.editorState)
                          }
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </Col>
                </Row>
              </>
            ) : (
              <Card.Body>
                <Row>
                  <Col sm={10}>
                    <Editor
                      spellCheck={true}
                      readOnly={true}
                      toolbarHidden={true}
                      editorState={this.state.editorState}
                      onEditorStateChange={this.handleEditorChange}
                    />
                    {(this.props.role === 'Admin' ||
                      this.props.role === 'Agent') && (
                      <Button onClick={(e) => this.handleClickEdit(e)}>
                        Edit
                      </Button>
                    )}{' '}
                  </Col>
                  <Col md={2}>
                    {this.props.role === 'Student' ? (
                      this.props.student.checklist &&
                      this.props.student.checklist[this.props.item].status ===
                        'finished' ? (
                        <Button
                          onClick={(e) =>
                            this.props.handleClickChangeStatus(
                              e,
                              this.props.student._id,
                              this.props.item
                            )
                          }
                        >
                          Mark as Incomplete
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) =>
                            this.props.handleClickChangeStatus(
                              e,
                              this.props.student._id,
                              this.props.item
                            )
                          }
                        >
                          Mark as Complete
                        </Button>
                      )
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            )}
          </div>
        </Collapse>
      </>
    );
  }
}

export default CheckListItems;
