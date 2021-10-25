import React from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import UcFirst from "../../App/components/UcFirst";

class UserForm extends React.Component {
  state = {
    user: this.props.user || "",
  };

  handleChange = (e, name) => {
    const { value } = e.target;
    this.setState((state) => ({
      user: { ...state.user, [name]: value },
    }));
  };

  handleSubmit = () => {
    this.props.onFormSubmit(this.state.user);
  };

  render() {
    // TODO: emailaddress should be gray out <not allowed to change>
    if (this.props.success) {
      return (
        <tr key={this.state.user._id}>
          <th>
            <div>
              <Button
                className="btn-square"
                variant="danger"
                onClick={() => this.handleSubmit()}
              >
                <UcFirst text="Save" />
              </Button>
              <Button
                className="btn-square"
                variant="info"
                onClick={() => this.props.handleFormClose()}
              >
                <UcFirst text="Cancel" />
              </Button>
            </div>
          </th>
          {this.props.header.map((y, k) => (
            <td key={k}>
              <Form>
                <Form.Group>
                  <Form.Control
                    type="text"
                    onChange={(e) => this.handleChange(e, y.prop)}
                    value={this.state.user[y.prop]}
                  />
                </Form.Group>
              </Form>
            </td>
          ))}
        </tr>
      );
    } else {
      return (
        <tr key={this.state.user._id}>
          <th>
            <div>
              <Button
                className="btn-square"
                variant="danger"
                onClick={() => this.handleSubmit()}
              >
                <UcFirst text="Save" />
              </Button>
              <Button
                className="btn-square"
                variant="info"
                onClick={() => this.props.handleFormClose()}
              >
                <UcFirst text="Cancel" />
              </Button>
            </div>
          </th>
          {this.props.header.map((y, k) => (
            <td key={k}>
              <Form>
                <Form.Group>
                  <Form.Control
                    type="text"
                    onChange={(e) => this.handleChange(e, y.prop)}
                    value={this.state.user[y.prop]}
                  />
                </Form.Group>
              </Form>
            </td>
          ))}
        </tr>
      );
    }
  }
}

export default UserForm;
