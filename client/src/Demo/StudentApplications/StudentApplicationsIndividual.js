import React from 'react';
import { Spinner } from 'react-bootstrap';
import StudentApplicationsTableTemplate from './StudentApplicationsTableTemplate';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getStudent } from '../../api';

class StudentApplicationsIndividual extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    student: null,
    success: false,
    res_status: 0
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
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.student) {
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
      <StudentApplicationsTableTemplate
        isLoaded={isLoaded}
        role={this.props.user.role}
        student={this.state.student}
      />
    );
  }
}

export default StudentApplicationsIndividual;
