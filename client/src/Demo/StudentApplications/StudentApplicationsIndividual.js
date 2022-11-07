import React from 'react';
import { Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import StudentApplicationsTableTemplate from './StudentApplicationsTableTemplate';
// import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { getStudent } from '../../api';
import { Redirect } from 'react-router-dom';

class StudentApplicationsIndividual extends React.Component {
  state = {
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    student: null,
    success: false,
    error: null
  };
  componentDidMount() {
    getStudent(this.props.match.params.student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success
          });
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
  }

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
    // if (this.props.user.role === 'Student') {
    //   return <Redirect to="/student-applications" />;
    // }
    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
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
