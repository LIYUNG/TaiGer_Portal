import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getAllActiveStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { Redirect } from 'react-router-dom';
import DEMO from '../../store/constant';
import StudentOverviewTable from '../../components/StudentOverviewTable';

class StudentOverviewPage extends React.Component {
  state = {
    error: '',
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
    getAllActiveStudents().then(
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
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const { res_status, isLoaded } = this.state;
    TabTitle('CV ML RL Center');
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
                  All Active Student Overview
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <StudentOverviewTable
          title="All"
          students={this.state.students}
          user={this.props.user}
        />
      </Aux>
    );
  }
}

export default StudentOverviewPage;
