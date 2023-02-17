import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';

import EditDownloadFiles from './EditDownloadFiles';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { deleteTemplateFile, getTemplates, uploadtemplate } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

class DownloadPage extends React.Component {
  state = {
    error: '',
    file: '',
    isLoaded: false,
    areLoaded: {},
    templates: null,
    success: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };
  componentDidMount() {
    getTemplates().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let areLoaded_temp = {};
          for (let i = 0; i < window.templatelist.length; i++) {
            areLoaded_temp[window.templatelist[i].prop] = true;
          }
          this.setState({
            isLoaded: true, //false to reload everything
            templates: data,
            success: success,
            res_status: status,
            areLoaded: areLoaded_temp
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

  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0]
    });
  };

  onSubmitFile = (e, category) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file);
    let areLoaded_temp = { ...this.state.areLoaded };
    areLoaded_temp[category] = false;
    this.setState({ areLoaded: areLoaded_temp });
    uploadtemplate(category, formData).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          areLoaded_temp[category] = true;
          let templates_temp = [...this.state.templates];
          templates_temp.push(data);
          this.setState({
            isLoaded: true,
            templates: templates_temp,
            success: success,
            areLoaded: areLoaded_temp,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            areLoaded: areLoaded_temp,
            res_modal_status: status,
            res_modal_message: message
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          areLoaded: areLoaded_temp,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
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
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState({
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
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
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Student'
    ) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('Download Center');
    const { res_status, isLoaded, res_modal_status, res_modal_message } =
      this.state;

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
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row>
          <Col>
            <Card className="my-0 mx-0" bg={'primary'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Download TaiGer Document Templates
                </Card.Title>
              </Card.Header>
              <EditDownloadFiles
                isLoaded={isLoaded}
                role={this.props.user.role}
                userId={this.props.user._id}
                templates={this.state.templates}
                submitFile={this.submitFile}
                onFileChange={this.onFileChange}
                templatelist={window.templatelist}
                areLoaded={this.state.areLoaded}
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
