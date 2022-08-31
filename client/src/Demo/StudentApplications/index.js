import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
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
          // alert(resp.data.message);
          this.setState({
            isLoaded: true,
            error: true
          });
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
    const { error, isLoaded } = this.state;
    if (error) {
      return (
        <div>
          This is for Premium only. We encourage you to fill the Academic
          Background before contact our consultant!
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
    if (this.props.user.role === 'Student') {
      return <StudentApplicationsTableTemplate student={this.state.student} />;
    } else {
      return <>This Page is only for paid student.</>;
    }
  }
}

export default StudentApplication;
