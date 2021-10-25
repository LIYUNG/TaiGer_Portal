import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import UsersList from "./UsersList";

import { getUsers, deleteUser, updateUser, changeUserRole } from "../../api";

class UsersTable extends React.Component {
  state = {
    error: null,
    role: "",
    isLoaded: false,
    data: [],
    success: false,
  };

  componentDidMount() {
    getUsers().then(
      (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          return this.setState({ error: resp.status });
        }
        console.log(resp.data.data);
        const { data, success } = resp.data;
        this.setState({ isLoaded: true, data, success });
      },
      (error) => this.setState({ isLoaded: true, error })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getUsers().then(
        (resp) => {
          const { data, success } = resp.data;
          this.setState({ isLoaded: true, data });
        },
        (error) => this.setState({ isLoaded: true, error })
      );
    }
  }

  deleteUser = (user_id) => {
    // TODO: also delete files in file system
    deleteUser(user_id).then(
      (resp) => {},
      (error) => {
        console.log("error at deleteUser: " + deleteUser);
      }
    );
  };

  editUser = (edited_user) => {
    // update local
    this.setState({
      data: this.state.data.map((user) => {
        if (user._id === edited_user._id) {
          return Object.assign(user, edited_user);
        } else {
          return user;
        }
      }),
    });
    // update remote
    updateUser(edited_user).then(
      (resp) => {},
      (error) => {
        console.log("error at editUser: " + error);
      }
    );
  };

  onFormSubmit = (edited_user) => {
    this.editUser(edited_user);
  };

  RemoveUserHandler3 = (user_id) => {
    console.log("click delete user");
    console.log("id = " + user_id);
    this.deleteUser(user_id);
    this.setState({
      isLoaded: false,
    });
  };

  validate = () => {
    let isError = false;
    const errors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    };

    const { username, email } = this.state.values;

    if (username.length < 5) {
      isError = true;
      errors.username = "Username needs to be atleast 5 characters long";
    }

    if (email.indexOf("@") === -1) {
      isError = true;
      errors.email = "Requires valid email";
    }

    this.setState({
      errors,
    });

    return isError;
  };

  assignUserAs = (user_data) => {
    this.setState({
      data: this.state.data.map((user) => {
        if (user._id === user_data._id) {
          return Object.assign(user, user_data);
        } else {
          return user;
        }
      }),
    });
    console.log("click assign user role");
    console.log(user_data);
    changeUserRole(user_data._id, user_data.role_)
      // .then((res) => res.json())
      .then(
        (result) => {},
        (error) => {
          console.log(" error at assignUserAs" + error);
        }
      );
  };

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      //TODO: put error page component for timeout
      localStorage.removeItem("token");
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Aux>
          <Row>
            <Col>
              <Card>
                {/* <Card.Header>
                                </Card.Header> */}
                <Card.Body>
                  <Row>
                    <Col>
                      <Card.Title as="h4">Users List</Card.Title>
                    </Col>
                  </Row>
                  <UsersList
                    success={this.state.success}
                    onFormSubmit={this.onFormSubmit}
                    assignUserAs={this.assignUserAs}
                    data={this.state.data}
                    RemoveUserHandler3={this.RemoveUserHandler3}
                    onSubmit2={this.onSubmit2}
                    header={window.UserlistHeader}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default UsersTable;
