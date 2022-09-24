import React from 'react';
import { Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
// import DEMO from '../../store/constant';
import EditFilesSubpage from './EditFilesSubpage';
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BsDash } from 'react-icons/bs';
import { SYMBOL_EXPLANATION } from '../Utils/contants';

import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  getStudents,
  downloadProfile
} from '../../api';
class AgentCenter extends React.Component {
  state = {
    error: null,
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
        : [0], // to expand all]
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
            success: success,
            // accordionKeys: new Array(data.length).fill().map((x, i) => i), // to expand all
            // accordionKeys: new Array(-1, data.length) // to collapse all
          });
        } else {
          alert(resp.data.message);
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
      (res) => {
        students[student_arrayidx] = res.data.data;
        const { success } = res.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            students: students,
            success,
            isLoaded: true
          }));
        } else {
          alert(res.data.message);
          this.setState((state) => ({
            ...state,
            isLoaded: true
          }));
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
      (res) => {
        const { data, success } = res.data;
        students[student_arrayidx].profile[idx] = data;
        // std.profile[idx] = res.data.data; // res.data = {success: true, data:{...}}
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
          alert(res.data.message);
          this.setState((state) => ({
            ...state,
            isLoaded: true
          }));
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
          alert('resp.data.message');
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
      (res) => {
        let students = [...this.state.students];
        const { data, success } = res.data;
        students[student_arrayidx] = data;

        if (success) {
          this.setState((state) => ({
            ...state,
            students: students, // res.data = {success: true, data:{...}}
            success,
            category: '',
            isLoaded: true,
            file: ''
          }));
        } else {
          alert(res.data.message);
          this.setState((state) => ({
            ...state,
            isLoaded: true
          }));
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
    const { error, isLoaded } = this.state;
   
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
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
    ));
    return (
      <Aux>
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title>
                  <Row>
                    <Col>Base Documents</Col>
                    <Col md={{ span: 2, offset: 0 }}>
                      {this.state.expand ? (
                        <Button
                          className="btn-sm"
                          onClick={() => this.AllCollapsetHandler()}
                        >
                          Collaspse
                        </Button>
                      ) : (
                        <Button
                          className="btn-sm"
                          onClick={() => this.AllExpandtHandler()}
                        >
                          Expand
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            {student_profile}{' '}
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

export default AgentCenter;
