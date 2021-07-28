import React from "react";
import { Form, Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

class UsersListSubpage extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange2 = props.handleChange2.bind(this);
    this.setModalHide = props.setModalHide.bind(this);
    this.onSubmit2 = props.onSubmit2.bind(this);
    this.state = {
      data: [],
    };
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.setModalHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Assign {this.props.firstname} - {this.props.lastname} as
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <tr>
            <th>
              <div>
                <Form.Group>
                  <Form.Check
                    custom
                    type="radio"
                    name="user_role"
                    defaultChecked={
                      this.props.selected_user_role === "Student" ? true : false
                    }
                    id="Student"
                    value="Student"
                    onChange={this.handleChange2}
                  />
                </Form.Group>
              </div>
            </th>
            <td>
              <td>
                <h4 className="mb-1">Student</h4>
              </td>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <Form.Group>
                  <Form.Check
                    custom
                    type="radio"
                    name="user_role"
                    defaultChecked={
                      this.props.selected_user_role === "Editor" ? true : false
                    }
                    id="Editor"
                    value="Editor"
                    onChange={this.handleChange2}
                  />
                </Form.Group>
              </div>
            </th>
            <td>
              <td>
                <h4 className="mb-1">Editor</h4>
              </td>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <Form.Group>
                  <Form.Check
                    custom
                    type="radio"
                    name="user_role"
                    defaultChecked={
                      this.props.selected_user_role === "Agent" ? true : false
                    }
                    id="Agent"
                    value="Agent"
                    onChange={this.handleChange2}
                  />
                </Form.Group>
              </div>
            </th>
            <td>
              <td>
                <h4 className="mb-1">Agent</h4>
              </td>
            </td>
          </tr>
          <tr>
            <th>
              <div>
                <Form.Group>
                  <Form.Check
                    custom
                    type="radio"
                    name="user_role"
                    defaultChecked={
                      this.props.selected_user_role === "Admin" ? true : false
                    }
                    id="Admin"
                    value="Admin"
                    onChange={this.handleChange2}
                  />
                </Form.Group>
              </div>
            </th>
            <td>
              <td>
                <h4 className="mb-1">Admin</h4>
              </td>
            </td>
          </tr>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSubmit2}>Assign</Button>
          <Button onClick={this.setModalHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default UsersListSubpage;
