import React from "react";
import { Table, Form } from "react-bootstrap";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import UcFirst from "../../App/components/UcFirst";

class ProgramForm extends React.Component {
  state = {
    program: this.props.program || "",
    Content_: this.props.content || "",
  };

  handleChange = (e, name) => {
    const { value } = e.target;
    this.setState((state) => ({
      program: { ...state.program, [name]: value },
    }));
  };

  handleSubmit = () => {
    this.props.onFormSubmit(this.state.program);
  };

  render() {
    if (
      this.props.role === "Agent" ||
      this.props.role === "Editor" ||
      this.props.role === "Admin"
    ) {
      return (
        <tr key={this.state.program._id}>
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
                    value={this.state.program[y.prop]}
                  />
                </Form.Group>
              </Form>
            </td>
          ))}
        </tr>
      );
    } else {
      return (
        <tr key={this.state.program._id}>
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
                    value={this.state.program[y.prop]}
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

export default ProgramForm;
