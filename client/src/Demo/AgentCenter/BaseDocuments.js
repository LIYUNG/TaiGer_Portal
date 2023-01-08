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

import { getStudentsAndDocLinks } from '../../api';

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
        <Card className="mb-2 mx-0" bg={'dark'} text={'light'} key={i}>
          <Card.Header>
            <Card.Title className="my-0 mx-0 text-light">
              {student.firstname}
              {' ,'}
              {student.lastname}
            </Card.Title>
          </Card.Header>
          <BaseDocument_StudentView
            base_docs_link={base_docs_link}
            student={student}
            user={this.props.user}
            SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
          />
        </Card>
      )
    );

    return (
      <Aux>
        {/* <Row className="sticky-top"> */}
        <Row className="pt-0">
          {this.props.user.role === 'Admin' ||
          this.props.user.role === 'Agent' ||
          this.props.user.role === 'Editor' ? (
            // <Card bg={'dark'} text={'light'}>
            <Card className="mb-0 mx-0" bg={'dark'} text={'light'}>
              {/* <Card.Header as="h5">Base Documents</Card.Header> */}
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Base Documents
                </Card.Title>
              </Card.Header>
              <Table
                size="sm"
                responsive
                hover
                // bordered
                // className="mt-2 mx-0"
                // style={{
                //   background: 'black'
                // }}
                text="light"
              >
                <thead>
                  <tr className="my-0 mx-0 text-light">
                    <th
                      className="headcol"
                      style={{
                        background: 'black'
                      }}
                    >
                      First-, Last <br /> Name
                    </th>
                    <th
                      style={{
                        background: 'black',
                        color: 'black'
                      }}
                    >
                      First-, Last Na
                    </th>
                    {profile_list_keys.map((doc_name, index) => (
                      <th
                        style={{
                          background: 'black'
                        }}
                        key={index}
                        // style={spinner_style2}
                      >
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
