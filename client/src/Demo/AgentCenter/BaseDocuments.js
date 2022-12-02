import React from 'react';
import { Row, Col, Spinner, Table, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import StudentBaseDocumentsStatus from './StudentBaseDocumentsStatus';
import BaseDocument_StudentView from './BaseDocument_StudentView';
import { SYMBOL_EXPLANATION, split_header } from '../Utils/contants';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  getStudentsAndDocLinks
} from '../../api';
class BaseDocuments extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
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
    // accordionKeys: new Array(-1, this.props.user.students.length), // To collapse all
    accordionKeys:
      this.props.user.students &&
      (this.props.user.role === 'Editor' || this.props.user.role === 'Agent')
        ? new Array(this.props.user.students.length).fill().map((x, i) => i)
        : [0] // to expand all]
    // accordionKeys:
    //   this.props.user.students &&
    //   new Array(this.props.user.students.length).fill().map((x, i) => i)
    // // to expand all]
  };

  componentDidMount() {
    getStudentsAndDocLinks().then(
      (resp) => {
        const { base_docs_link, data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            base_docs_link,
            success: success
            // accordionKeys: new Array(data.length).fill().map((x, i) => i), // to expand all
            // accordionKeys: new Array(-1, data.length) // to collapse all
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

  singleExpandtHandler = (idx) => {
    let accordionKeys = [...this.state.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    this.setState((state) => ({
      ...state,
      accordionKeys: accordionKeys
    }));
  };

  AllCollapsetHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: false,
      accordionKeys:
        this.props.user.role === 'Editor' || this.props.user.role === 'Agent'
          ? new Array(this.props.user.students.length).fill().map((x, i) => -1)
          : [-1] // to collapse all]
    }));
  };

  AllExpandtHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys:
        this.props.user.role === 'Editor' || this.props.user.role === 'Agent'
          ? new Array(this.props.user.students.length).fill().map((x, i) => i)
          : [0] // to expand all]
    }));
  };

  onUpdateProfileFilefromstudent = (category, student_id, status, feedback) => {
    var student_arrayidx = this.state.students.findIndex(
      (student) => student._id === student_id
    );
    // var student = this.state.students.find(
    //   (student) => student._id === student_id
    // );
    var students = [...this.state.students];
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (resp) => {
        students[student_arrayidx] = resp.data.data;
        const { success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            students: students,
            success,
            isLoaded: true
          }));
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
          error
        });
      }
    );
  };

  onDeleteFilefromstudent = (category, student_id) => {
    // e.preventDefault();
    let student_arrayidx = this.state.students.findIndex(
      (student) => student._id === student_id
    );
    let student = this.state.students.find(
      (student) => student._id === student_id
    );
    let idx = student.profile.findIndex((doc) => doc.name === category);
    let students = [...this.state.students];
    deleteFile(category, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        students[student_arrayidx].profile[idx] = data;
        // std.profile[idx] = resp.data.data; // resp.data = {success: true, data:{...}}
        if (success) {
          this.setState((state) => ({
            ...state,
            student_id: '',
            category: '',
            isLoaded: true,
            students: students,
            success: success,
            deleteFileWarningModel: false
          }));
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
  };

  SubmitGeneralFile = (e, studentId, fileCategory) => {
    this.onSubmitGeneralFile(e, e.target.files[0], studentId, fileCategory);
  };

  onSubmitGeneralFile = (e, NewFile, category, student_id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);
    let student_arrayidx = this.state.students.findIndex(
      (student) => student._id === student_id
    );
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    uploadforstudent(category, student_id, formData).then(
      (resp) => {
        let students = [...this.state.students];
        const { data, success } = resp.data;
        students[student_arrayidx] = data;

        if (success) {
          this.setState((state) => ({
            ...state,
            students: students, // resp.data = {success: true, data:{...}}
            success,
            category: '',
            isLoaded: true,
            file: ''
          }));
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
          error
        });
      }
    );
  };

  render() {
    const { unauthorizederror, base_docs_link, timeouterror, isLoaded } =
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
    let profile_list_keys = Object.values(window.profile_list);

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

    const style2 = {
      transform: 'rotate(360deg)',
      textAlign: 'left',
      verticalAlign: 'left',
      overflowWrap: 'break-word'
    };

    if (!isLoaded && !this.state.students) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    const student_profile = this.state.students.map((student, i) => (
      <StudentBaseDocumentsStatus
        key={i}
        idx={i}
        base_docs_link={base_docs_link}
        student={student}
        accordionKeys={this.state.accordionKeys}
        singleExpandtHandler={this.singleExpandtHandler}
        role={this.props.user.role}
        user={this.props.user}
        SubmitGeneralFile={this.SubmitGeneralFile}
        onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
        onDeleteFilefromstudent={this.onDeleteFilefromstudent}
        SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        isLoaded={isLoaded}
        CommentModel={this.state.CommentModel}
        rejectProfileFileModel={this.state.rejectProfileFileModel}
        acceptProfileFileModel={this.state.acceptProfileFileModel}
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
          rejectProfileFileModel={this.state.rejectProfileFileModel}
          acceptProfileFileModel={this.state.acceptProfileFileModel}
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
                      <th style={style2}>First-, Last Name</th>
                    </>
                    {profile_list_keys.map((doc_name, index) => (
                      <th key={index} style={style2}>
                        {split_header(doc_name)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{student_profile}</tbody>
              </Table>
            </Card>
          ) : (
            // </Card>
            <>{student_profile_student_view}</>
          )}
        </Row>
        <Row>
          {!isLoaded && (
            <div style={style}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            </div>
          )}
        </Row>
      </Aux>
    );
  }
}

export default BaseDocuments;
