import React from 'react';
import {
  Row,
  Col,
  Spinner,
  Table,
  Card,
  Modal,
  Button,
  Tab,
  Tabs
} from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import CVMLRLOverview from './CVMLRLOverview';
import CVMLRLProgress from '../Dashboard/MainViewTab/CVMLRLProgress/CVMLRLProgress';
import CVMLRLProgressClosed from '../Dashboard/MainViewTab/CVMLRLProgress/CVMLRLProgressClosed';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { getCVMLRLOverview, SetFileAsFinal, getStudents } from '../../api';

class index extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    doc_thread_id: '',
    student_id: '',
    program_id: '',
    SetAsFinalFileModel: false,
    isFinalVersion: false,
    status: '', //reject, accept... etc
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getCVMLRLOverview().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
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
    const { res_status, isLoaded } = this.state;

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

    return (
      <Aux>
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  CV ML RL Overview
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <CVMLRLOverview
          isLoaded={this.state.isLoaded}
          success={this.state.success}
          students={this.state.students}
          user={this.props.user}
        />
      </Aux>
    );
  }
}

export default index;
