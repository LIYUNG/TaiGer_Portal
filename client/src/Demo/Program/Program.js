import React from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
class Program extends React.Component {
  state = {
    program: this.props.program || "",
  };

  render() {
    if (this.props.success) {
      return (
        <tr key={this.props.program._id}>
          <td>
            <Form.Group>
              <Form.Check
                custom
                type="checkbox"
                id={this.props.program._id}
                onChange={(e) => this.props.selectPrograms(e)}
              />
            </Form.Group>
          </td>
          {window.ProgramlistHeader.map((y, k) => (
            <td key={k}>
              <Link
                to={'/programs/' + this.props.program._id}
                style={{ textDecoration: 'none' }}
              >
                {this.props.program[y.prop]}
              </Link>
            </td>
          ))}
        </tr>
      );
    } else {
      return (
        <tr key={this.props.program._id}>
          <th>
            <DropdownButton
              size="sm"
              title="Option"
              variant="primary"
              id={`dropdown-variants-${this.props.program._id}`}
              key={this.props.program._id}
            >
              <Dropdown.Item eventKey="1">See details</Dropdown.Item>
              {/* <Dropdown.Item
                eventKey="2"
                // onSelect={() => setModalShow(program.University, program.Program, program._id)}
              >
                Others...
              </Dropdown.Item> */}
            </DropdownButton>
          </th>
          {window.ProgramlistHeader.map((y, k) => (
            <td key={k}>{this.props.program[y.prop]}</td>
          ))}
        </tr>
      );
    }
  }
}

export default Program;
