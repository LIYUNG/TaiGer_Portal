import React from 'react';

import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Link } from 'react-router-dom';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';
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
  Form,
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

class DocumentsListItems extends React.Component {
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
    const msg = { prop: this.props.item, text: message };
    updateChecklistDocument(msg).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            editorState,
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
        <Row>
          <Col sm={10}>
            <Link to={`/docs/search/${this.props.document._id}`}>
              {this.props.document.title}
            </Link>
            {/* <Editor
              spellCheck={true}
              readOnly={true}
              toolbarHidden={true}
              editorState={this.state.editorState}
            /> */}
          </Col>
        </Row>
      </>
    );
  }
}

export default DocumentsListItems;
