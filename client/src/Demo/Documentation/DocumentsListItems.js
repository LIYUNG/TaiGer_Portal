import React from 'react';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { HiX } from 'react-icons/hi';

import '../../components/DraftEditor.css';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { updateChecklistDocument } from '../../api';

class DocumentsListItems extends React.Component {
  state = {
    error: '',
    student: this.props.student,
    in_edit_mode: false,
    student_id: '',
    editorState: null,
    ConvertedContent: '',
    isLoaded: false,
    file: '',
    res_status: 0
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
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            editorState,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
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

  handleEditorChange = (newstate) => {
    this.setState((state) => ({ ...state, editorState: newstate }));
  };

  render() {
    const { res_status, error, isLoaded } = this.state;

    if (!isLoaded && !this.state.student) {
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

    return (
      <>
        <Row>
          <Col sm={10}>
            {(this.props.role === 'Agent' || this.props.role === 'Admin') && (
              <HiX
                size={24}
                color="red"
                title="Delete"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  this.props.openDeleteDocModalWindow(this.props.document)
                }
              />
            )}

            {this.props.idx}
            {'. '}
            <Link to={`${this.props.path}/${this.props.document._id}`}>
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
