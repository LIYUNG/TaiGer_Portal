import React from 'react';
import { Row, Col, Spinner, Table, Card } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import StudentBaseDocumentsStatus from './StudentBaseDocumentsStatus';
import BaseDocument_StudentView from './BaseDocument_StudentView';
import {
  SYMBOL_EXPLANATION,
  split_header,
  spinner_style,
  spinner_style2
} from '../Utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import ErrorPage from '../Utils/ErrorPage';

import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  getStudentsAndDocLinks
} from '../../api';

class BaseDocuments extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    data: null,
    base_docs_link: null,
    success: false,
    students: null,
    file: '',
    student_id: '',
    status: '', //reject, accept... etc
    category: '',
    feedback: '',
    expand: false,
    CommentModel: false,
    accordionKeys:
      this.props.user.students &&
      (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
        ? new Array(this.props.user.students.length).fill().map((x, i) => i)
        : [0], // to expand all]
    res_status: 0,
    res_modal_status: ''
  };

  componentDidMount() {
    getStudentsAndDocLinks().then(
      (resp) => {
        const { base_docs_link, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            base_docs_link,
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

  render() {
    const {
      res_status,
      base_docs_link,
      isLoaded,
      res_modal_status,
      res_modal_message
    } = this.state;

    if (!isLoaded && !this.state.students) {
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

    let profile_list_keys = Object.values(window.profile_list);

    const student_profile = this.state.students.map((student, i) => (
      <StudentBaseDocumentsStatus
        key={i}
        idx={i}
        student={student}
        role={this.props.user.role}
        user={this.props.user}
        SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        isLoaded={isLoaded}
      />
    ));

    const student_profile_student_view = this.state.students.map(
      (student, i) => (
        <BaseDocument_StudentView
          key={i}
          idx={i}
          base_docs_link={base_docs_link}
          student={student}
          role={this.props.user.role}
          user={this.props.user}
          SubmitGeneralFile={this.SubmitGeneralFile}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
          isLoaded={isLoaded}
          deleteFileWarningModel={this.state.deleteFileWarningModel}
          CommentModel={this.state.CommentModel}
        />
      )
    );

    return (
      <Aux>
        {/* <Row className="sticky-top"> */}
        <Row>
          {this.props.user.role === 'Admin' ||
          this.props.user.role === 'Agent' ||
          this.props.user.role === 'Editor' ? (
            // <Card bg={'dark'} text={'light'}>
            <Card className="mb-0 mx-0" bg={'dark'} text={'light'}>
              <Card.Header as="h5">Base Documents</Card.Header>{' '}
              <Table
                size="sm"
                responsive
                hover
                // className="mt-2 mx-0"
                // style={{
                //   background: 'black'
                // }}
                text="light"
              >
                <thead>
                  <tr className="my-0 mx-0 text-light">
                    <>
                      <th style={spinner_style2}>First-, Last Name</th>
                    </>
                    {profile_list_keys.map((doc_name, index) => (
                      <th key={index} style={spinner_style2}>
                        {split_header(doc_name)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{student_profile}</tbody>
              </Table>
            </Card>
          ) : (
            <>{student_profile_student_view}</>
          )}
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
        </Row>
      </Aux>
    );
  }
}

export default BaseDocuments;
