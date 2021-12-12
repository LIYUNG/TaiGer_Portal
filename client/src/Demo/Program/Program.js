import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

class ProgramForm extends React.Component {
  state = {
    program: this.props.program || "",
    Content_: this.props.content || "",
  };

  render() {
    if (this.props.success) {
      return (
        <tr key={this.props.program._id}>
          <th>
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
                      this.props.program.University_,
                      this.props.program.Program_
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
                  eventKey="1"
                  onSelect={() => this.props.onEditClick(this.props.i)}
                >
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onSelect={() =>
                    this.props.setModalShow(
                      this.props.program.University_,
                      this.props.program.Program_,
                      this.props.program._id
                    )
                  }
                >
                  Assign to student...
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onSelect={() =>
                    this.props.setModalShowDelete(
                      this.props.program.University_,
                      this.props.program.Program_,
                      this.props.program._id
                    )
                  }
                >
                  Delete
                </Dropdown.Item>
              </DropdownButton>
            )}
          </th>
          {this.props.header.map((y, k) => (
            <td key={k}>{this.props.program[y.prop]}</td>
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

export default ProgramForm;
