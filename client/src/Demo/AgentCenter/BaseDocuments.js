import React from 'react';
import { Row, Col, Spinner, Table, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
// import DEMO from '../../store/constant';
import StudentBaseDocumentsStatus from './StudentBaseDocumentsStatus';
import EditFilesSubpage from './EditFilesSubpage';
import { SYMBOL_EXPLANATION } from '../Utils/contants';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  getStudents,
  downloadProfile
} from '../../api';
class BaseDocuments extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    data: null,
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
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
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

  onDownloadFilefromstudent(e, category, id) {
    e.preventDefault();
    // this.setState((state) => ({
    //   ...state,
    //   isLoaded: false
    // }));
    downloadProfile(category, id).then(
      (resp) => {
        const { status } = resp;
        if (status === 200) {
          const actualFileName =
            resp.headers['content-disposition'].split('"')[1];
          const { data: blob } = resp;
          if (blob.size === 0) return;

          var filetype = actualFileName.split('.'); //split file name
          filetype = filetype.pop(); //get the file type

          if (filetype === 'pdf') {
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: 'application/pdf' })
            );

            //Open the URL on new Window
            window.open(url); //TODO: having a reasonable file name, pdf viewer
          } else {
            //if not pdf, download instead.

            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', actualFileName);
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);
          }
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
        alert('The file is not available.');
      }
    );
  }

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
    const { unauthorizederror, timeouterror, isLoaded } = this.state;

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
        student={student}
        accordionKeys={this.state.accordionKeys}
        singleExpandtHandler={this.singleExpandtHandler}
        role={this.props.user.role}
        user={this.props.user}
        documentslist2={this.props.documentslist2}
        documentslist={this.props.documentslist}
        onDownloadFilefromstudent={this.onDownloadFilefromstudent}
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
        <EditFilesSubpage
          key={i}
          idx={i}
          student={student}
          accordionKeys={this.state.accordionKeys}
          singleExpandtHandler={this.singleExpandtHandler}
          role={this.props.user.role}
          user={this.props.user}
          documentslist2={this.props.documentslist2}
          documentslist={this.props.documentslist}
          onDownloadFilefromstudent={this.onDownloadFilefromstudent}
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
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                 Base Documents
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            {this.props.user.role === 'Admin' ||
            this.props.user.role === 'Agent' ||
            this.props.user.role === 'Editor' ? (
              <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                <Card.Body>
                  <Table
                    responsive
                    hover
                    className="my-0 mx-0"
                    //   variant="dark"
                    text="light"
                  >
                    <thead>
                      <tr className="my-0 mx-0 text-light">
                        <>
                          <th style={style2}>First-, Last Name</th>
                        </>
                        {profile_list_keys.map((doc_name, index) => (
                          <th key={index} style={style2}>
                            {doc_name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{student_profile}</tbody>
                  </Table>
                </Card.Body>
              </Card>
            ) : (
              <>{student_profile_student_view}</>
            )}

            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default BaseDocuments;
