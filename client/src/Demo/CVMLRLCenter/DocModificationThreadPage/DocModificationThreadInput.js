import React, { Component } from 'react';
import { Row, Col, Spinner, Button, Card, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';

import Aux from '../../../hoc/_Aux';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { spinner_style, templatelist } from '../../Utils/contants';

import {
  LinkableNewlineText,
  getRequirement,
  is_TaiGer_AdminAgent,
  is_TaiGer_Student,
  is_TaiGer_role
} from '../../Utils/checking-functions';
import { BASE_URL } from '../../../api/request';

import { SubmitMessageWithAttachment, getStudentInput } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import FilesList from './FilesList';

class DocModificationThreadInput extends Component {
  state = {
    error: '',
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  };
  componentDidMount() {
    getStudentInput(this.props.match?.params.documentsthreadId).then(
      (resp) => {
        const { success, data, editors, agents, deadline, conflict_list } =
          resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            success,
            thread: data,
            editors,
            agents,
            deadline,
            conflict_list,
            isLoaded: true,
            documentsthreadId: this.props.match.params.documentsthreadId,
            file: null,
            // accordionKeys: new Array(data.messages.length)
            //   .fill()
            //   .map((x, i) => i) // to expand all
            accordionKeys: new Array(data.messages?.length)
              .fill()
              .map((x, i) => (i === data.messages?.length - 1 ? i : -1)), // to collapse all
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

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    this.setState({ buttonDisabled: true });
    var message = JSON.stringify(editorState);
    const formData = new FormData();

    if (this.state.file) {
      this.state.file.forEach((file) => {
        formData.append('files', file);
      });
    }

    // formData.append('files', this.state.file);
    formData.append('message', message);

    SubmitMessageWithAttachment(
      this.state.documentsthreadId,
      this.state.thread.student_id?._id,
      formData
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
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
            ],
            res_modal_status: status
          });
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
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

  render() {
    const {
      isLoaded,
      isFilesListOpen,
      isSubmissionLoaded,
      conflict_list,
      res_status,
      res_modal_status,
      res_modal_message
    } = this.state;
    if (!isLoaded && !this.state.thread) {
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
    let docName;
    const student_name = `${this.state.thread.student_id.firstname} ${this.state.thread.student_id.lastname}`;
    if (this.state.thread.program_id) {
      docName =
        this.state.thread.program_id.school +
        '-(' +
        this.state.thread.program_id.degree +
        ') ' +
        this.state.thread.program_id.program_name +
        ' ' +
        this.state.thread.file_type;
    } else {
      docName = this.state.thread.file_type;
    }
    TabTitle(`${student_name} ${docName}`);
    return (
      <Aux>
        {!isLoaded && (
          <div style={spinner_style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        <Row>
          <Card className="mb-2 mx-0">
            <Card.Header>
              <h4 className="mt-1 ms-0" style={{ textAlign: 'left' }}>
                <Link
                  className="text-primary"
                  to={`/student-database/${this.state.thread.student_id?._id.toString()}/profile`}
                >
                  <b>{student_name}</b>
                </Link>
                {'   '}
                {docName}
                {' Discussion thread'}
                {'   '}
                <b>{' Online Input form'}</b>
              </h4>
            </Card.Header>
          </Card>
        </Row>
        {this.state.thread.isFinalVersion && (
          <Row className="sticky-top">
            <Card className="mb-2 mx-0" bg={'success'} text={'white'}>
              <Card.Header>
                <Card.Title as="h5" className="text-light">
                  Status: <b>Close</b>
                </Card.Title>
              </Card.Header>
            </Card>
          </Row>
        )}
        <Row className="pb-2">
          <Col className="px-0">
            <Card className="my-0 mx-0">
              <Link
                to={`${DEMO.DOCUMENT_MODIFICATION_LINK(
                  this.state.documentsthreadId
                )}`}
                // target="_blank"
              >
                <Button size="sm">回到討論串</Button>
              </Link>
              <Card.Body>
                <b>Requirements:</b>
                {this.state.thread?.program_id ? (
                  <>
                    <LinkableNewlineText
                      text={getRequirement(this.state.thread)}
                    />
                  </>
                ) : (
                  <p>No</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="px-0">
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Control type="textArea"></Form.Control>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Group>
                    <Form.Label>Use requirements?</Form.Label>
                    <Form.Check></Form.Check>
                  </Form.Group>
                </Form>
                <Button>Save</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default DocModificationThreadInput;
