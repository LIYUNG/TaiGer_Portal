import React from 'react';
import { Spinner, Card, Row, Col, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import AdminMainView from './AdminDashboard/AdminMainView';
import AgentMainView from './AgentDashboard/AgentMainView';
import EditorMainView from './EditorDashboard/EditorMainView';
import StudentDashboard from './StudentDashboard/StudentDashboard';
import GuestDashboard from './GuestDashboard/GuestDashboard';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { SYMBOL_EXPLANATION, spinner_style } from '../Utils/contants';

import { getStudent } from '../../api';

class DashboardStudentView extends React.Component {
  state = {
    error: null,
    modalShow: false,
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    student: {},
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isDashboard: true,
    file: '',
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getStudent(this.props.match.params.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getStudent(this.props.match.params.student_id).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              student: data,
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
  }

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
      this.props.user.role !== 'Agent'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_modal_status, res_modal_message, isLoaded, res_status } =
      this.state;

    if (!isLoaded && !this.state.data) {
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
            <Card className="my-1 mx-0" bg={'secondary'} text={'light'}>
              {/* <Card.Header>
                <Card.Title className="text-light">
                  Student View: {this.state.student.firstname}{' '}
                  {this.state.student.lastname}
                </Card.Title>
              </Card.Header> */}
              <h4
                className="text-light mt-4 ms-4"
                style={{ textAlign: 'left' }}
              >
                Student View: {this.state.student.firstname}{' '}
                {this.state.student.lastname}
                <span style={{ float: 'right', cursor: 'pointer' }}>
                  <Link
                    to={`/student-database/${this.props.match.params.student_id}/background`}
                  >
                    <Button
                      size="sm"
                      className="text-light mb-3 me-4" // onClick={(e) =>
                    >
                      Switch Back
                    </Button>
                  </Link>
                </span>
              </h4>
            </Card>
          </Col>
        </Row>
        <StudentDashboard
          user={this.state.student}
          role={this.state.student.role}
          student={this.state.student}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        />
      </Aux>
    );
  }
}

export default DashboardStudentView;
