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
  downloadVPDProfile,
  getStudent
} from '../../api';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

class UniAssistListCard extends React.Component {
  state = {
    student_id: '',
    program_id: '',
    isLoaded: false,
    student: this.props.student,
    timeouterror: null,
    unauthorizederror: null,
    deleteVPDFileWarningModel: false
  };
  componentDidMount() {
    if (!this.props.student) {
    console.log(this.props.student);
      getStudent(this.props.user._id.toString()).then(
        (resp) => {
          const { data, success } = resp.data;
          if (success) {
            this.setState({ isLoaded: true, student: data, success: success });
          } else {
            if (resp.status === 401 || resp.status === 500) {
              this.setState({ isLoaded: true, timeouterror: true });
            } else if (resp.status === 403) {
              this.setState({ isLoaded: true, unauthorizederror: true });
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
    } else {
      this.setState({
        isLoaded: true
      });
    }
  }
  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteVPDFileWarningModel: false }));
  };
  handleUniAssistDocSubmit = (e, student_id, program_id) => {
    e.preventDefault();
    this.onSubmitGeneralFile(e, e.target.files[0], student_id, program_id);
  };

  handleUniAssistDocDelete = (e) => {
    deleteVPDFile(this.state.student_id, this.state.program_id).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            student: data,
            success: success,
            deleteVPDFileWarningModel: false
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
  onDeleteVPDFileWarningPopUp = (e, student_id, program_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      program_id,
      deleteVPDFileWarningModel: true
    }));
  };

  handleUniAssistDocDownload = (e, student_id, program_id) => {
    e.preventDefault();
    downloadVPDProfile(student_id, program_id).then(
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
  };
  onSubmitGeneralFile = (e, NewFile, student_id, program_id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    uploadVPDforstudent(student_id, program_id, formData).then(
      (resp) => {
        const { data, success } = resp.data;

        if (success) {
          this.setState((state) => ({
            ...state,
            student: data, // resp.data = {success: true, data:{...}}
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

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    const app_name = this.state.student.applications.map((application, i) => (
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
                      this.state.student._id.toString(),
                      application.programId._id.toString()
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
                <Button
                  onClick={(e) =>
                    this.handleUniAssistDocDownload(
                      e,
                      this.state.student._id.toString(),
                      application.programId._id.toString()
                    )
                  }
                >
                  Download
                </Button>
                <Button
                  onClick={(e) =>
                    this.onDeleteVPDFileWarningPopUp(
                      e,
                      this.state.student._id.toString(),
                      application.programId._id.toString()
                    )
                  }
                >
                  Delete
                </Button>
              </>
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
            application.uni_assist.status === 'missing' ||
            application.uni_assist.status === 'notstarted' ? (
              <Form>
                <Form.File.Label
                  onChange={(e) =>
                    this.handleUniAssistDocSubmit(
                      e,
                      this.state.student._id.toString(),
                      application.programId._id.toString()
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
                <Button
                  onClick={(e) =>
                    this.handleUniAssistDocDownload(
                      e,
                      this.state.student._id.toString(),
                      application.programId._id.toString()
                    )
                  }
                >
                  Download
                </Button>
                <Button
                  onClick={(e) =>
                    this.onDeleteVPDFileWarningPopUp(
                      e,
                      this.state.student._id.toString(),
                      application.programId._id.toString()
                    )
                  }
                >
                  Delete
                </Button>
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
        <Modal
          show={this.state.deleteVPDFileWarningModel}
          onHide={this.closeWarningWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete?</Modal.Body>
          <Modal.Footer>
            <Button
              //   disabled={!this.state.isLoaded}
              onClick={(e) => this.handleUniAssistDocDelete(e)}
            >
              Yes
            </Button>
            <Button onClick={this.closeWarningWindow}>No</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default UniAssistListCard;