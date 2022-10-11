import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
// import Card from '../../App/components/MainCard';
import Aux from '../../hoc/_Aux';
import UsersList from './UsersList';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

import { getUsers } from '../../api';

class UsersTable extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    role: '',
    isLoaded: false,
    user: null,
    unauthorizederror: null,
    success: false
  };

  componentDidMount() {
    getUsers().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({ isLoaded: true, user: data, success });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
        }
      },
      (error) => this.setState({ isLoaded: true, error })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getUsers().then(
        (resp) => {
          const { data, success } = resp.data;
          if (success) {
            this.setState({ isLoaded: true, user: data, success });
          } else {
            if (resp.status === 401 || resp.status === 500) {
              this.setState({ isLoaded: true, timeouterror: true });
            } else if (resp.status === 403) {
              this.setState({ isLoaded: true, unauthorizederror: true });
            }
          }
        },
        (error) => this.setState({ isLoaded: true, error })
      );
    }
  }

  validate = () => {
    let isError = false;
    const errors = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    };

    const { username, email } = this.state.values;

    if (username.length < 5) {
      isError = true;
      errors.username = 'Username needs to be atleast 5 characters long';
    }

    if (email.indexOf('@') === -1) {
      isError = true;
      errors.email = 'Requires valid email';
    }

    this.setState({
      errors
    });

    return isError;
  };

  render() {
    const { unauthorizederror, timeouterror, isLoaded } = this.state;
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
    if (!isLoaded && !this.state.data) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    return (
      <Aux>
        <Row>
          <Col>
            <Card bg={'primary'} text="light">
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Users List
                </Card.Title>
              </Card.Header>
              <UsersList
                success={this.state.success}
                user={this.state.user}
                onSubmit2={this.onSubmit2}
                header={window.UserlistHeader}
              />
            </Card>
            {!this.state.isLoaded && (
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

export default UsersTable;
