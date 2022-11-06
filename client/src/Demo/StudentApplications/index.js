import React from 'react';
import { Spinner } from 'react-bootstrap';
import StudentApplicationsTableTemplate from './StudentApplicationsTableTemplate';
// import Card from '../../App/components/MainCard';
// import Aux from '../../hoc/_Aux';
import { getStudent } from '../../api';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import PremiumOnlyError from '../Utils/PremiumOnlyError';

class StudentApplication extends React.Component {
  state = {
    isLoaded: false,
    student: null,
    success: false,
    error: null,
    timeouterror: null,
    unauthorizederror: null
  };
  componentDidMount() {
    getStudent(this.props.user._id).then(
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
            if (this.props.user.role !== 'Guest') {
              this.setState({ isLoaded: true, unauthorizederror: true });
            } else {
              this.setState({ isLoaded: true });
            }
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true
          // error: true
        });
      }
    );
  }
  render() {
    const { unauthorizederror, timeouterror, isLoaded, accordionKeys } =
      this.state;
    if (timeouterror) {
      return <TimeOutErrors />;
    }
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
        </div>
      );
    }
    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    if (this.props.user.role === 'Student') {
      return (
        <StudentApplicationsTableTemplate
          isLoaded={isLoaded}
          role={this.props.user.role}
          student={this.state.student}
        />
      );
    } else {
      return <PremiumOnlyError />;
    }
  }
}

export default StudentApplication;
