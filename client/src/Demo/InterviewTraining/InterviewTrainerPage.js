import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import PageNotFoundError from '../Utils/PageNotFoundError';
import ProgramsInterview from './ProgramsInterview';

// import Aux from '../../hoc/_Aux';
import { getAllInterviews } from '../../api';

class InterviewTrainerPage extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    pagenotfounderror: null,
    role: '',
    isLoaded: false,
    interviews: [],
    success: false,
    academic_background: {},
    updateconfirmed: false
  };

  componentDidMount() {
    getAllInterviews().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            interviews: data,
            success: success
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          } else if (resp.status === 400) {
            this.setState({ isLoaded: true, pagenotfounderror: true });
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
    this.setState({ isLoaded: true });
  }
  render() {
    const { pagenotfounderror, unauthorizederror, timeouterror, isLoaded } =
      this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
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
    if (pagenotfounderror) {
      return (
        <div>
          <PageNotFoundError />
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <>
        <Card className="mt-0">
          <Card.Header>
            <Card.Title>Interview Training page </Card.Title>
          </Card.Header>
        </Card>
        <Card className="mt-0">
          <Card.Body>
            <ProgramsInterview interviews={this.state.interviews} />
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default InterviewTrainerPage;
