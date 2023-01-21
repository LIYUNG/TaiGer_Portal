import React from 'react';
import { Spinner, Row, Col, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import DocPageView from './DocPageView';
import DocPageEdit from './DocPageEdit';
import { valid_categories } from '../Utils/contants';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  getCategorizedDocumentationPage,
  updateDocumentationPage
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

class Documentation extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    success: false,
    editorState: null,
    isEdit: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
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
            success: success,
            res_status: status
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
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }

  handleClickEditToggle = (e) => {
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
            document_title: data.title,
            editorState,
            isEdit: !this.state.isEdit,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
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

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Student'
    ) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const {
      res_status,
      editorState,
      isLoaded,
      res_modal_status,
      res_modal_message
    } = this.state;

    if (!isLoaded || !editorState) {
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

    const category_name = valid_categories.find(
      (categorie) => categorie.key === this.props.match.params.category
    ).value;
    TabTitle(`Doc: ${category_name}`);
    if (this.state.isEdit) {
      return (
        <>
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
          <Row className="sticky-top ">
            <Col>
              <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                <Card.Header text={'dark'}>
                  <Card.Title>
                    <Row>
                      <Col className="my-0 mx-0 text-light">
                        {category_name}
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
            handleClickEditToggle={this.handleClickEditToggle}
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
            user={this.props.user}
            handleClickEditToggle={this.handleClickEditToggle}
          />
        </>
      );
    }
  }
}

export default Documentation;
