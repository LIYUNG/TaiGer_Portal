import React from 'react';
import { Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
import InterviewTrainerPage from './InterviewTrainerPage';
import InterviewStudentPage from './InterviewStudentPage';
import Aux from '../../hoc/_Aux';

class InterviewTraining extends React.Component {
  render() {
    return (
      <Aux>
        {this.props.user.role === 'Student' && (
          <>
            <InterviewStudentPage user={this.props.user} />
          </>
        )}
        {(this.props.user.role === 'Editor' ||
          this.props.user.role === 'Agent' ||
          this.props.user.role === 'Admin') && (
          <>
            <InterviewTrainerPage user={this.props.user} />
          </>
        )}
      </Aux>
    );
  }
}

export default InterviewTraining;
