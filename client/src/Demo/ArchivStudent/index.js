import React from 'react';
import { Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { SYMBOL_EXPLANATION } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getArchivStudents, updateArchivStudents } from '../../api';

class Dashboard extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    students: [],
    success: false,
    isArchivPage: true,
    res_status: 0
  };

  componentDidMount() {
    getArchivStudents().then(
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
          error
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getArchivStudents().then(
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
  }

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
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
          error
        });
      }
    );
  };

  render() {
    const { res_status, isLoaded } = this.state;

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (!isLoaded && !this.state.data) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    if (this.state.success) {
      return (
        <Aux>
          <Row>
            <Col>
              {this.props.user.role === 'Admin' ||
              this.props.user.role === 'Agent' ||
              this.props.user.role === 'Editor' ? (
                <TabStudBackgroundDashboard
                  role={this.props.user.role}
                  students={this.state.students}
                  updateStudentArchivStatus={this.updateStudentArchivStatus}
                  isArchivPage={this.state.isArchivPage}
                  SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
                />
              ) : (
                <></>
              )}
              {/* </Card> */}

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
}

export default Dashboard;
