import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import SingleDocView from './SingleDocView';
import SingleDocEdit from './SingleDocEdit';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import {
  updateInternalDocumentation,
  getInternalDocumentation
} from '../../api';

class SingleDoc extends React.Component {
  state = {
    isLoaded: false,
    success: false,
    error: null,
    editorState: null,
    isEdit: false,
    internal: false,
    res_status: 0
  };
  componentDidMount() {
    getInternalDocumentation(this.props.match.params.documentation_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (!data) {
          this.setState({ isLoaded: true, pagenotfounderror: true });
        }
        if (success) {
          var initialEditorState = null;
          if (data.text) {
            initialEditorState = JSON.parse(data.text);
          } else {
            initialEditorState = {};
          }
          initialEditorState = JSON.parse(data.text);
          this.setState({
            isLoaded: true,
            document_title: data.title,
            category: data.category,
            internal: data.internal,
            editorState: initialEditorState,
            success: success,
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
          isLoaded: true,
          error: true
        });
      }
    );
  }

  handleClickCancel = (e) => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  handleClickSave = (e, category, doc_title, editorState) => {
    e.preventDefault();
    const message = JSON.stringify(editorState);
    const msg = {
      title: doc_title,
      category,
      prop: this.props.item,
      text: message
    };
    updateInternalDocumentation(
      this.props.match.params.documentation_id,
      msg
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            document_title: data.title,
            editorState,
            isEdit: !this.state.isEdit,
            isLoaded: true,
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
        this.setState({ error });
      }
    );
    this.setState((state) => ({ ...state, in_edit_mode: false }));
  };

  handleClick = () => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent'
    ) {
      return <Redirect to="/dashboard/default" />;
    }

    const { res_status, editorState, isLoaded } = this.state;

    if (!isLoaded && !editorState) {
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

    if (this.state.isEdit) {
      return (
        <SingleDocEdit
          category={this.state.category}
          internal={this.state.internal}
          document={document}
          document_title={this.state.document_title}
          editorState={this.state.editorState}
          isLoaded={isLoaded}
          handleClick={this.handleClick}
          handleClickCancel={this.handleClickCancel}
          handleClickSave={this.handleClickSave}
        />
      );
    } else {
      return (
        <SingleDocView
          category={this.state.category}
          internal={this.state.internal}
          document={document}
          document_title={this.state.document_title}
          editorState={this.state.editorState}
          isLoaded={isLoaded}
          role={this.props.user.role}
          handleClick={this.handleClick}
        />
      );
    }
  }
}
export default SingleDoc;
