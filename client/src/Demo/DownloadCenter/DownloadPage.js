import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';

import EditDownloadFilesSubpage from './EditDownloadFilesSubpage';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import {
  deleteTemplateFile,
  getTemplates,
  uploadtemplate,
  getTemplateDownload
} from '../../api';

class DownloadPage extends React.Component {
  state = {
    error: null,
    file: '',
    isLoaded: false,
    students: [],
    templates: null,
    success: false,
    res_status: 0
  };
  componentDidMount() {
    getTemplates().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true, //false to reload everything
            templates: data,
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
          error
        });
      }
    );
  }

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
        const { status } = resp;
        //TODO: backend logic
        if (success) {
          this.setState({
            isLoaded: true, //false to reload everything
            templates: data,
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

  onDeleteTemplateFile = (e, category) => {
    e.preventDefault();
    deleteTemplateFile(category).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        //TODO: backend logic
        if (success) {
          this.setState({
            isLoaded: true, //false to reload everything
            templates: data,
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
          error
        });
      }
    );
  };

  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Student'
    ) {
      return <Redirect to="/dashboard/default" />;
    }

    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.templates) {
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
              />
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default DownloadPage;
