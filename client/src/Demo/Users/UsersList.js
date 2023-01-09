import React from 'react';
import { Table } from 'react-bootstrap';

import User from './User';
import UsersListSubpage from './UsersListSubpage';
import UserDeleteWarning from './UserDeleteWarning';
import { spinner_style } from '../Utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { deleteUser, updateUser, changeUserRole } from '../../api';

class UsersList extends React.Component {
  state = {
    modalShow: false,
    delete_field: '',
    timeouterror: null,
    unauthorizederror: null,
    firstname: '',
    lastname: '',
    selected_user_role: '',
    selected_user_id: '',
    data: this.props.user,
    modalShowNewProgram: false,
    deleteUserWarning: false,
    success: this.props.success,
    isLoaded: this.props.isLoaded,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user !== prevProps.user) {
      this.setState({
        data: this.props.user
      });
    }
  }

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
      deleteUserWarning: false,
      delete_field: ''
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
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));

    deleteUser(user_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          var array = [...this.state.data];
          let idx = this.state.data.findIndex((user) => user._id === user_id);
          if (idx !== -1) {
            array.splice(idx, 1);
          }
          this.setState({
            isLoaded: true,
            success,
            delete_field: '',
            deleteUserWarning: false,
            data: array,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
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
  onChangeDeleteField = (e) => {
    this.setState({ delete_field: e.target.value });
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
        const { status } = resp;
        if (success) {
          this.setState({
            modalShow: false,
            isLoaded: true,
            success,
            data: updated_user,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
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

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_modal_message, res_modal_status } = this.state;

    const headers = (
      <tr>
        <th> </th>
        {this.props.header.map((x, i) => (
          <th key={i}>{x.name}</th>
        ))}
        <th>Last Login</th>
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
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Table
          responsive
          className="my-0 mx-0"
          variant="dark"
          text="light"
          size="sm"
        >
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
          isLoaded={this.state.isLoaded}
          deleteUserWarning={this.state.deleteUserWarning}
          onChangeDeleteField={this.onChangeDeleteField}
          delete_field={this.state.delete_field}
          setModalHideDDelete={this.setModalHideDDelete}
          firstname={this.state.firstname}
          lastname={this.state.lastname}
          selected_user_id={this.state.selected_user_id}
          RemoveUserHandler3={this.RemoveUserHandler3}
        />
      </>
    );
  }
}

export default UsersList;
