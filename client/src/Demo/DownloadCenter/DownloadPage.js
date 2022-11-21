import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
// import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
import {
  deleteTemplateFile,
  getTemplates,
  uploadtemplate,
  getTemplateDownload
} from '../../api';
import EditDownloadFilesSubpage from './EditDownloadFilesSubpage';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

class DownloadPage extends React.Component {
  state = {
    error: null,
    file: '',
    isLoaded: false,
    students: [],
    templates: null,
    success: false
  };
  componentDidMount() {
    getTemplates().then(
      (resp) => {
        const { data, success } = resp.data;
        //TODO: backend logic
        if (success) {
          this.setState({
            isLoaded: true, //false to reload everything
            templates: data,
            success: success
          });
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
          error
        });
      }
    );
  }

  // componentDidUpdate(prevProps, prevState) {}

  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0]
    });
  };

  onSubmitFile = (e, category) => {
    const formData = new FormData();
    formData.append('file', this.state.file);
    uploadtemplate(category, formData).then(
      (resp) => {
        const { data, success } = resp.data;
        //TODO: backend logic
        if (success) {
          this.setState({
            isLoaded: true, //false to reload everything
            templates: data,
            success: success
          });
        } else {
          alert(resp.data.message);
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

  submitFile = (e, docName) => {
    if (this.state.file === '') {
      e.preventDefault();
      alert('Please select file');
    } else {
      e.preventDefault();
      this.onSubmitFile(e, docName);
    }
  };

  getFileNameFromContentDisposition(contentDisposition) {
    if (!contentDisposition) return null;

    const match = contentDisposition.match(/filename="?([^"]+)"?/);

    return match ? match[1] : null;
  }

  onDeleteTemplateFile = (e, category) => {
    e.preventDefault();
    deleteTemplateFile(category).then(
      (resp) => {
        const { data, success } = resp.data;
        //TODO: backend logic
        if (success) {
          this.setState({
            isLoaded: true, //false to reload everything
            templates: data,
            success: success
          });
        } else {
          alert(resp.data.message);
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

  onDownloadFilefromstudent = (e, category) => {
    e.preventDefault();
    getTemplateDownload(category).then(
      (resp) => {
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

          // Open the URL on new Window
          var newWindow = window.open(url, '_blank'); //TODO: having a reasonable file name, pdf viewer
          newWindow.document.title = actualFileName;
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
      },
      (error) => {
        alert('The file is not available.');
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

    if (!isLoaded && !this.state.templates) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    if (
      this.props.user.role === 'Student' ||
      this.props.user.role === 'Admin' ||
      this.props.user.role === 'Editor' ||
      this.props.user.role === 'Agent'
    ) {
      return (
        <Aux>
          <Row>
            <Col>
              <Card className="my-0 mx-0" bg={'primary'} text={'white'}>
                <Card.Header>
                  <Card.Title className="my-0 mx-0 text-light">
                    Download TaiGer Document Templates
                  </Card.Title>
                </Card.Header>
                <EditDownloadFilesSubpage
                  isLoaded={isLoaded}
                  role={this.props.user.role}
                  userId={this.props.user._id}
                  student={this.state.student}
                  templates={this.state.templates}
                  submitFile={this.submitFile}
                  onFileChange={this.onFileChange}
                  templatelist={window.templatelist}
                  onDeleteTemplateFile={this.onDeleteTemplateFile}
                  onDownloadFilefromstudent={this.onDownloadFilefromstudent}
                />
              </Card>
            </Col>
          </Row>
        </Aux>
      );
    } else {
      // Guest
      return (
        <Aux>
          <Row>
            <Col>
              <div> This is for Premium only. Please contact our sales! </div>
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default DownloadPage;
