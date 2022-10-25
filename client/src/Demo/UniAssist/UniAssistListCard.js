import React from 'react';
import {
  Row,
  Col,
  Form,
  Table,
  Button,
  Card,
  Collapse,
  Modal,
  Spinner
} from 'react-bootstrap';
import { IoMdCloudUpload } from 'react-icons/io';
import {
  uploadVPDforstudent,
  deleteVPDFile,
  downloadVPDProfile
} from '../../api';
class UniAssistListCard extends React.Component {
  SubmitGeneralFile = (e, studentId, fileCategory) => {
    this.onSubmitGeneralFile(e, e.target.files[0], studentId, fileCategory);
  };
  handleUniAssistDocSubmit = (e, studentId, fileCategory) => {
    e.preventDefault();
    this.SubmitGeneralFile(e, studentId, fileCategory);
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
    uploadVPDforstudent(category, student_id, formData).then(
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
    const app_name = this.props.student.applications.map((application, i) => (
      <div key={i}>
        {application.programId.uni_assist === 'Yes-FULL' && (
          <>
            <p className="text-info">
              {application.programId.school}{' '}
              {application.programId.program_name}
              {' Yes-FULL'}
            </p>{' '}
            {!application.uni_assist ||
            application.uni_assist.status === 'notstarted' ? (
              <Form>
                <Form.File.Label
                  onChange={(e) =>
                    this.handleUniAssistDocSubmit(
                      e,
                      this.props.k,
                      this.props.student._id.toString()
                    )
                  }
                  onClick={(e) => (e.target.value = null)}
                >
                  <Form.File.Input hidden />
                  <IoMdCloudUpload color={'lightgray'} size={32} />
                </Form.File.Label>
              </Form>
            ) : (
              <Button>Download</Button>
            )}
          </>
        )}
        {application.programId.uni_assist === 'Yes-VPD' && (
          <>
            <p className="text-info">
              {application.programId.school}{' '}
              {application.programId.program_name}
              {' Yes-VPD'}
            </p>
            {!application.uni_assist ||
            application.uni_assist.status === 'notstarted' ? (
              <Form>
                <Form.File.Label
                  onChange={(e) =>
                    this.handleUniAssistDocSubmit(
                      e,
                      this.props.k,
                      this.props.student._id.toString()
                    )
                  }
                  onClick={(e) => (e.target.value = null)}
                >
                  <Form.File.Input hidden />
                  <IoMdCloudUpload color={'lightgray'} size={32} />
                </Form.File.Label>
              </Form>
            ) : (
              <>
                <Button>Download</Button>
              </>
            )}
          </>
        )}
        {application.programId.uni_assist === 'No' && (
          <>
            <p className="text-info">
              {application.programId.school}{' '}
              {application.programId.program_name}
            </p>
            <p className="text-light"> 'Not uni-assist needed'</p>
          </>
        )}
        {application.programId.uni_assist === undefined && (
          <>
            <p className="text-info">
              {application.programId.school}{' '}
              {application.programId.program_name}{' '}
            </p>
            <p className="text-light"> 'Not uni-assist needed'</p>
          </>
        )}
      </div>
    ));
    return (
      <>
        <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
          <Card.Body>{app_name}</Card.Body>
        </Card>
      </>
    );
  }
}
export default UniAssistListCard;
