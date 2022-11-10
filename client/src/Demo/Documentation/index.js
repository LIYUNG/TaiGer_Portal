import React from 'react';
import { Spinner, Button } from 'react-bootstrap';
// import { useParams } from "react-router-dom";
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { getDocumentation } from '../../api';
import DocPageView from './DocPageView';
import DocPageEdit from './DocPageEdit';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import PageNotFoundError from '../Utils/PageNotFoundError';
import { updateDocumentationPage } from '../../api';

import {
  getCategorizedDocumentationPage,
  createDocumentation,
  deleteDocumentation
} from '../../api';

class ApplicationList extends React.Component {
  state = {
    isLoaded: false,
    success: false,
    error: null,
    editorState: null,
    unauthorizederror: null,
    unauthorizederror: null,
    isEdit: false
  };

  componentDidMount() {
    getCategorizedDocumentationPage(this.props.match.params.category).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          var initialEditorState = null;
          if (data.text) {
            initialEditorState = JSON.parse(data.text);
          } else {
            initialEditorState = { time: new Date(), blocks: [] };
          }
          // initialEditorState = JSON.parse(data.text);

          this.setState({
            isLoaded: true,
            editorState: initialEditorState,
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
          } else {
            this.setState({ isLoaded: true, pagenotfounderror: true });
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
  // when changing category URL
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.category !== this.props.match.params.category) {
      // this.setState({
      //   isLoaded: false
      // });
      // window.location.reload(true);
      console.log('DDD');
      getCategorizedDocumentationPage(this.props.match.params.category).then(
        (resp) => {
          const { data, success } = resp.data;
          if (success) {
            var initialEditorState = null;
            if (data.text) {
              initialEditorState = JSON.parse(data.text);
            } else {
              initialEditorState = {
                time: new Date(),
                blocks: []
              };
            }
            this.setState({
              isLoaded: true,
              editorState: initialEditorState,
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
            } else {
              this.setState({ isLoaded: true, pagenotfounderror: true });
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
  }

  handleClickCancel = (e) => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  handleClickSave = (e, doc_title, editorState) => {
    e.preventDefault();
    const message = JSON.stringify(editorState);
    const msg = {
      category: this.props.match.params.category,
      title: doc_title,
      prop: this.props.item,
      text: message
    };
    console.log(msg);
    updateDocumentationPage(this.props.match.params.category, msg).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            document_title: data.title,
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

  handleClick = () => {
    this.setState((state) => ({ ...state, isEdit: !this.state.isEdit }));
  };
  render() {
    const {
      unauthorizederror,
      timeouterror,
      pagenotfounderror,
      error,
      editorState,
      isLoaded
    } = this.state;

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

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (!isLoaded && !editorState) {
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
          <DocPageEdit
            category={"category"}
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
          <DocPageView
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

export default ApplicationList;
