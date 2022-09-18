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
            <InterviewStudentPage />
          </>
        )}
        {this.props.user.role === 'Editor' && (
          <>
            <InterviewTrainerPage />
          </>
        )}
      </Aux>
    );
  }
}

export default InterviewTraining;
