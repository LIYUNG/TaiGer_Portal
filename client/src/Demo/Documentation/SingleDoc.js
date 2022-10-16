import React from 'react';
import { Spinner, Button } from 'react-bootstrap';
// import { useParams } from "react-router-dom";
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { getDocumentation } from '../../api';
import SingleDocView from './SingleDocView';
import SingleDocEdit from './SingleDocEdit';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { updateDocumentation } from '../../api';
class SingleDoc extends React.Component {
  state = {
    isLoaded: false,
    document: null,
    success: false,
    error: null,
    editorState: null,
    unauthorizederror: null,
    unauthorizederror: null,
    isEdit: false
  };
  componentDidMount() {
    getDocumentation(this.props.match.params.documentation_id).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          var initialEditorState = null;
          // if (data.text) {
          //   const rawContentFromStore = convertFromRaw(JSON.parse(data.text));
          //   initialEditorState =
          //     EditorState.createWithContent(rawContentFromStore);
          // } else {
          //   initialEditorState = EditorState.createEmpty();
          // }
          initialEditorState = JSON.parse(data.text);
          // ConvertedContent = JSON.parse(data.text);

          this.setState({
            isLoaded: true,
            document_title: data.title,
            editorState: initialEditorState,
            // ConvertedContent: initialEditorState,
            success: success
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  handleClickCancel = (e) => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  handleClickSave = (e, doc_title, editorState) => {
    e.preventDefault();
    // const message = JSON.stringify(
    //   convertToRaw(editorState.getCurrentContent())
    // );
    const message = JSON.stringify(editorState);
    const msg = { title: doc_title, prop: this.props.item, text: message };
    updateDocumentation(this.props.match.params.documentation_id, msg).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            editorState,
            isEdit: !this.state.isEdit,
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

  handleClick = () => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  render() {
    const { unauthorizederror, timeouterror, error, document, isLoaded } =
      this.state;

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
    if (!isLoaded && !document) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    if (this.state.isEdit) {
      return (
        <>
          <SingleDocEdit
            document={document}
            document_title={this.state.document_title}
            editorState={this.state.editorState}
            isLoaded={isLoaded}
            handleClick={this.handleClick}
            handleClickCancel={this.handleClickCancel}
            handleClickSave={this.handleClickSave}
          />
        </>
      );
    } else {
      return (
        <>
          <SingleDocView
            document={document}
            document_title={this.state.document_title}
            editorState={this.state.editorState}
            isLoaded={isLoaded}
            role={this.props.user.role}
            handleClick={this.handleClick}
          />
        </>
      );
    }
  }
}
export default SingleDoc;
