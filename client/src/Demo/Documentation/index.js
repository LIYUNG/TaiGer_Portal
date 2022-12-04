import React from 'react';
import { Spinner, Button, Row, Col, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import DocPageView from './DocPageView';
import DocPageEdit from './DocPageEdit';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import PageNotFoundError from '../Utils/PageNotFoundError';
import { valid_categories } from '../Utils/contants';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import {
  getCategorizedDocumentationPage,
  updateDocumentationPage
} from '../../api';

class ApplicationList extends React.Component {
  state = {
    isLoaded: false,
    success: false,
    error: null,
    editorState: null,
    unauthorizederror: null,
    unauthorizederror: null,
    isEdit: false,
    res_status: 0
  };

  componentDidMount() {
    getCategorizedDocumentationPage(this.props.match.params.category).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
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
            timeouterror: false,
            pagenotfounderror: false,
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
  // when changing category URL
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.category !== this.props.match.params.category) {
      // this.setState({
      //   isLoaded: false
      // });
      getCategorizedDocumentationPage(this.props.match.params.category).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
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
              timeouterror: false,
              pagenotfounderror: false,
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
    updateDocumentationPage(this.props.match.params.category, msg).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            timeouterror: false,
            pagenotfounderror: false,
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
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Student'
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
        <>
          <Row className="sticky-top ">
            <Col>
              <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                <Card.Header text={'dark'}>
                  <Card.Title>
                    <Row>
                      <Col className="my-0 mx-0 text-light">
                        {
                          valid_categories.find(
                            (categorie) =>
                              categorie.key === this.props.match.params.category
                          ).value
                        }
                      </Col>
                    </Row>
                  </Card.Title>
                </Card.Header>
              </Card>
            </Col>
          </Row>
          <DocPageEdit
            category={'category'}
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
          <Row className="sticky-top ">
            <Col>
              <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                <Card.Header text={'dark'}>
                  <Card.Title>
                    <Row>
                      <Col className="my-0 mx-0 text-light">
                        {
                          valid_categories.find(
                            (categorie) =>
                              categorie.key === this.props.match.params.category
                          ).value
                        }
                      </Col>
                    </Row>
                  </Card.Title>
                </Card.Header>
              </Card>
            </Col>
          </Row>
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
