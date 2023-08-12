import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class AddUserModal extends React.Component {
  state = { user_information: {} };
  handleChange = (e) => {
    e.preventDefault();
    var user_information_temp = { ...this.state.user_information };
    user_information_temp[e.target.id] = e.target.value;
    this.setState((state) => ({
      ...state,
      user_information: user_information_temp
    }));
  };
  AddUserSubmit = (e, user_information) => {
    e.preventDefault();
    if (
      !user_information.firstname ||
      !user_information.lastname ||
      !user_information.email
    ) {
    } else {
      this.props.AddUserSubmit(e, user_information);
    }
  };

  render() {
    return (
      <Modal
        show={this.props.addUserModalState}
        onHide={this.props.cloaseAddUserModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="my-2" controlId="firstname">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Shiao-Ming"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="lastname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Chen"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="firstname_chinese">
            <Form.Label>名 (中文)</Form.Label>
            <Form.Control
              type="text"
              placeholder="小明"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="lastname_chinese">
            <Form.Label>姓 (中文)</Form.Label>
            <Form.Control
              type="text"
              placeholder="陳"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="chung.ming.wang@gmail.com"
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={
              !this.state.user_information.firstname ||
              !this.state.user_information.lastname ||
              !this.state.user_information.email ||
              !this.props.isLoaded
            }
            onClick={(e) => this.AddUserSubmit(e, this.state.user_information)}
          >
            {this.props.isLoaded ? 'Add User' : 'Loading'}
          </Button>
          <Button onClick={this.props.cloaseAddUserModal} variant="light">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default AddUserModal;
