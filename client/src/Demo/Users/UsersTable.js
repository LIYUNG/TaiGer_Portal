import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import UsersList from './UsersList';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getUsers } from '../../api';

class UsersTable extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    role: '',
    isLoaded: false,
    user: null,
    unauthorizederror: null,
    success: false,
    res_status: 0
  };

  componentDidMount() {
    getUsers().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            user: data,
            success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
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
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              user: data,
              success,
              res_status: status
            });
          } else {
            this.setState({
              isLoaded: true,
              res_status: status
            });
          }
        },
        (error) => this.setState({ isLoaded: true, error })
      );
    }
  }

  render() {
    if (this.props.user.role !== 'Admin') {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.data) {
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
              <div style={spinner_style}>
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
