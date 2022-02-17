import React from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
class Program extends React.Component {
  state = {
    program: this.props.program || "",
    Content_: this.props.content || "",
  };

  render() {
    if (this.props.success) {
      return (
        <tr key={this.props.program._id}>
          <td>
            {this.props.role === "Student" ? (
              <DropdownButton
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.program._id}`}
                key={this.props.program._id}
              >
                <Dropdown.Item
                  eventKey="2"
                  onSelect={(e) =>
                    this.props.onSubmit3(
                      e,
                      this.props.userId,
                      this.props.program._id,
                      this.props.program.school,
                      this.props.program.program
                    )
                  }
                >
                  Add to my watch list
                </Dropdown.Item>
              </DropdownButton>
            ) : (
              <DropdownButton
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.program._id}`}
                key={this.props.program._id}
              >
                <Dropdown.Item
                  eventKey="2"
                  onSelect={() =>
                    this.props.setModalShow(
                      this.props.program.school,
                      this.props.program.program,
                      this.props.program._id
                    )
                  }
                >
                  Assign to student...
                </Dropdown.Item>

                {/* <Dropdown.Item
                  eventKey="3"
                  onSelect={() =>
                    this.props.setModalShowDelete(
                      this.props.program.school,
                      this.props.program.program,
                      this.props.program._id
                    )
                  }
                >
                  Delete
                </Dropdown.Item> */}
              </DropdownButton>
            )}
          </td>
          <td>
            <Form.Group>
              <Form.Check custom type="checkbox" id={this.props.program._ids} />
            </Form.Group>
          </td>
          {this.props.header.map((y, k) => (
            <td key={k}>
              <Link to={"/programs/" + this.props.program._id}>
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
          {this.props.header.map((y, k) => (
            <td key={k}>{this.props.program[y.prop]}</td>
          ))}
        </tr>
      );
    }
  }
}

export default Program;
