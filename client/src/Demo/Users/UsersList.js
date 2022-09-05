import React from 'react';
import { Table } from 'react-bootstrap';
import User from './User';
import UsersListSubpage from './UsersListSubpage';
import UserDeleteWarning from './UserDeleteWarning';
import { deleteUser, updateUser, changeUserRole } from '../../api';

class Userslist extends React.Component {
  state = {
    modalShow: false,
    firstname: '',
    lastname: '',
    selected_user_role: '',
    selected_user_id: '',
    data: this.props.user,
    modalShowNewProgram: false,
    deleteUserWarning: false,
    success: this.props.success
  };
  setModalShow = (user_firstname, user_lastname, user_role, user_id) => {
    this.setState({
      modalShow: true,
      firstname: user_firstname,
      lastname: user_lastname,
      selected_user_role: user_role,
      selected_user_id: user_id
    });
  };

  setModalHide = () => {
    this.setState({
      modalShow: false
    });
  };

  setModalHideDDelete = () => {
    this.setState({
      deleteUserWarning: false
    });
  };

  setModalShowDelete = (user_firstname, user_lastname, user_id) => {
    this.setState({
      deleteUserWarning: true,
      firstname: user_firstname,
      lastname: user_lastname,
      selected_user_id: user_id
    });
  };

  handleChange2 = (e) => {
    const { value } = e.target;
    this.setState((state) => ({
      selected_user_role: value
    }));
  };

  deleteUser = (user_id) => {
    // TODO: also delete files in file system
    var array = [...this.state.data];
    let idx = this.state.data.findIndex((user) => user._id === user_id);
    if (idx !== -1) {
      array.splice(idx, 1);
    }
    deleteUser(user_id).then(
      (resp) => {
        const { success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            success,
            deleteUserWarning: false,
            data: array
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  assignUserAs = (user_data) => {
    var updated_user = this.state.data.map((user) => {
      if (user._id === user_data._id) {
        return Object.assign(user, user_data);
      } else {
        return user;
      }
    });

    changeUserRole(user_data._id, user_data.role).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            modalShow: false,
            isLoaded: true,
            success,
            data: updated_user
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  onSubmit2 = (e) => {
    e.preventDefault();
    const user_role = this.state.selected_user_role;
    const user_id = this.state.selected_user_id;
    this.assignUserAs({ role: user_role, _id: user_id });
  };

  RemoveUserHandler3 = (user_id) => {
    this.deleteUser(user_id);
  };

  render() {
    if (this.state.success) {
      const headers = (
        <tr>
          <th> </th>
          {this.props.header.map((x, i) => (
            <th key={i}>{x.name}</th>
          ))}
        </tr>
      );
      const users = this.state.data.map((user) => (
        <User
          key={user._id}
          user={user}
          header={this.props.header}
          setModalShowDelete={this.setModalShowDelete}
          setModalShow={this.setModalShow}
          success={this.state.success}
        />
      ));
      return (
        <>
          <Table table-responsive>
            <thead>{headers}</thead>
            <tbody>{users}</tbody>
          </Table>
          <UsersListSubpage
            show={this.state.modalShow}
            setModalHide={this.setModalHide}
            firstname={this.state.firstname}
            lastname={this.state.lastname}
            selected_user_role={this.state.selected_user_role}
            selected_user_id={this.state.selected_user_id}
            handleChange2={this.handleChange2}
            onSubmit2={this.onSubmit2}
          />
          <UserDeleteWarning
            deleteUserWarning={this.state.deleteUserWarning}
            setModalHideDDelete={this.setModalHideDDelete}
            firstname={this.state.firstname}
            lastname={this.state.lastname}
            selected_user_id={this.state.selected_user_id}
            RemoveUserHandler3={this.RemoveUserHandler3}
          />
        </>
      );
    } else {
      return (
        <>
          <p>This is for Admin only.</p>
        </>
      );
    }
  }
}

export default Userslist;
