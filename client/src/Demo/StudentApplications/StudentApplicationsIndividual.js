import React from 'react';
import { Row, Col, Spinner, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StudentApplicationsTableTemplate from './StudentApplicationsTableTemplate';
// import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
import { getStudent } from '../../api';

class StudentApplication extends React.Component {
  state = {
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
          alert(resp.data.message);
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
    const { error, isLoaded } = this.state;
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    
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
        role={this.props.user.role}
        student={this.state.student}
      />
    );
  }
}

export default StudentApplication;
