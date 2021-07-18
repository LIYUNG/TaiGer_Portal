import React from "react";
import { Table, Form, Modal } from "react-bootstrap";
import {
  Button,
  // OverlayTrigger,
  // Tooltip,
  // ButtonToolbar,
  Dropdown,
  DropdownButton,
  // SplitButton
} from "react-bootstrap";

// import Aux from "../../hoc/_Aux";
import UcFirst from "../../App/components/UcFirst";
import ProgramListSubpage from "./ProgramListSubpage";

const row = (
  x,
  i,
  header,
  handleRemove,
  startEditing,
  editIdx,
  handleChange,
  stopEditing,
  RemoveProgramHandler3,
  cancelEditing,
  setModalShow
) => {
  const currentlyEditing = editIdx === i;
  return (
    <tr key={x._id}>
      <th>
        {currentlyEditing ? (
          <div>
            <Button
              className="btn-square"
              variant="danger"
              onClick={() => stopEditing(x)}
            >
              <UcFirst text="Save" />
            </Button>
            <Button
              className="btn-square"
              variant="info"
              onClick={() => cancelEditing()}
            >
              <UcFirst text="Cancel" />
            </Button>
          </div>
        ) : (
          <DropdownButton
            size="sm"
            title="Option"
            variant="primary"
            id={`dropdown-variants-${x._id}`}
            key={x._id}
          >
            <Dropdown.Item eventKey="1" onSelect={() => startEditing(i)}>
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              onSelect={() => setModalShow(x.University, x.Program, x._id)}
            >
              Assign to student...
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="3"
              onSelect={() => RemoveProgramHandler3(x._id)}
            >
              Delete
            </Dropdown.Item>
          </DropdownButton>
        )}
      </th>
      {header.map((y, k) => (
        <td key={k}>
          {currentlyEditing ? (
            <Form>
              <Form.Group>
                <Form.Control
                  type="text"
                  onChange={(e) => handleChange(e, y.prop, i)}
                  value={x[y.prop]}
                />
              </Form.Group>
            </Form>
          ) : (
            x[y.prop]
          )}
        </td>
      ))}
    </tr>
  );
};

class Programlist extends React.Component {
  render() {
    return (
      <>
        <Table responsive>
          <thead>
            <tr>
              <th> </th>
              {this.props.header.map((x, i) => (
                <th key={i}>{x.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((program, i) =>
              row(
                program,
                i,
                this.props.header,
                this.props.handleRemove,
                this.props.startEditing,
                this.props.editIdx,
                this.props.handleChange,
                this.props.stopEditing,
                this.props.RemoveProgramHandler3,
                this.props.cancelEditing,
                this.props.setModalShow
              )
            )}
          </tbody>
        </Table>
        <ProgramListSubpage
          show={this.props.ModalShow}
          setModalHide={this.props.setModalHide}
          uni_name={this.props.Uni_Name}
          program_name={this.props.Program_Name}
          handleChange2={this.props.handleChange2}
          onSubmit2={this.props.onSubmit2}
        />
      </>
    );
  }
}

export default Programlist;
