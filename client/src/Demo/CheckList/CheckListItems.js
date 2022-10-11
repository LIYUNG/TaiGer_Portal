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
    studentId: '',
    in_edit_mode: false,
    student_id: '',
    doc_thread_id: '',
    applicationId: '',
    editorState: null,
    ConvertedContent: '',
    docName: '',
    whoupdate: '',
    isLoaded: false,
    requirements: '',
    file: '',
    isThreadExisted: false
  };
  componentDidMount() {
    // console.log(this.props.student);
    var initialEditorState = null;
    if (this.props.message) {
      const rawContentFromStore = convertFromRaw(
        JSON.parse(this.props.message.message)
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
            file: null,
            editorState: null,
            thread: data,
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
  closeSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: false
    }));
  };
  openRequirements_ModalWindow = (ml_requirements) => {
    this.setState((state) => ({
      ...state,
      Requirements_Modal: true,
      requirements: ml_requirements
    }));
  };
  close_Requirements_ModalWindow = () => {
    this.setState((state) => ({
      ...state,
      Requirements_Modal: false,
      requirements: ''
    }));
  };
  closeDocExistedWindow = () => {
    this.setState((state) => ({ ...state, isThreadExisted: false }));
  };
  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
  };

  onDeleteFileThread = (doc_thread_id, application, studentId) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      program_id: application ? application.programId._id : null,
      student_id: studentId,
      deleteFileWarningModel: true
    }));
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
                  <Button
                    onClick={(e) =>
                      this.handleClickSave(e, this.state.editorState)
                    }
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            ) : (
              <Card.Body>
                <Editor
                  spellCheck={true}
                  readOnly={true}
                  toolbarHidden={true}
                  editorState={this.state.editorState}
                  onEditorStateChange={this.handleEditorChange}
                />
                <Button onClick={(e) => this.handleClickEdit(e)}>Edit</Button>
              </Card.Body>
            )}
          </div>
        </Collapse>{' '}
        {/* {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        <Modal
          show={this.state.Requirements_Modal}
          onHide={this.close_Requirements_ModalWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Special Requirements
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.requirements}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close_Requirements_ModalWindow}>Close</Button>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.isThreadExisted}
          onHide={this.closeDocExistedWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Attention
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.docName} is already existed</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeDocExistedWindow}>Close</Button>
          </Modal.Footer>
        </Modal> */}
      </>
    );
  }
}

export default CheckListItems;
