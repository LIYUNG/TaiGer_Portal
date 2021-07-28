import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import UsersList from "./UsersList";

import { getUsers, deleteUser, updateUser, changeUserRole } from "../../api";

class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      role: "",
      isLoaded: false,
      data: [],
    };
  }

  componentDidMount() {
    getUsers().then(
      (resp) => {
        if (resp.status === 401) {
          return this.setState({ error: resp.status });
        }
        const { data, role } = resp.data;
        this.setState({ isLoaded: true, data, role });
      },
      (error) => this.setState({ isLoaded: true, error })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getUsers().then(
        (resp) => {
          const { data } = resp.data;
          this.setState({ isLoaded: true, data });
        },
        (error) => this.setState({ isLoaded: true, error })
      );
    }
  }

  deleteUser = (user_id) => {
    deleteUser(user_id).then(
      (resp) => {},
      (error) => {}
    );
  };

  editUser = (edited_user) => {
    // TODO: modify the following comment and delete resp setState to prevent update Fetch
    // this.setState({
    //   articles: this.state.articles.map((article) => {
    //     if (article._id === attrs._id) {
    //       return Object.assign({}, article, {
    //         _id: attrs._id,
    //         Titel_: attrs.Titel_,
    //         Content_: attrs.Content_,
    //         Category_: attrs.Category_,
    //         LastUpdate_: attrs.LastUpdate_,
    //       });
    //     } else {
    //       return article;
    //     }
    //   }),
    // });
    updateUser(edited_user).then(
      (resp) => {
        this.setState({
          isLoaded: false,
        });
      },
      (error) => {}
    );
  };

  handleRemove = (i) => {
    this.setState((state) => ({
      data: state.data.filter((row, j) => j !== i),
    }));
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
    console.log(this.state.data);
    changeUserRole(user_data)
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
                    role={this.state.role}
                    ModalShow={this.state.modalShow}
                    setModalShow={this.setModalShow}
                    setModalHide={this.setModalHide}
                    onFormSubmit={this.onFormSubmit}
                    handleRemove={this.handleRemove}
                    handleChange2={this.handleChange2}
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
