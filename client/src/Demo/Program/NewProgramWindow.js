import React from "react";
import { Row, Col, Card, Form, Modal } from "react-bootstrap";
import {
  Button,
  // OverlayTrigger,
  // Tooltip,
  ButtonToolbar,
  // Dropdown,
  // DropdownButton,
  // SplitButton
} from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import Programlist from "./ProgramList";

class NewProgramWindow extends React.Component {
  constructor(props) {
    super(props);
    this.setModalHide2 = props.setModalHide2.bind(this);
    this.handleChangeNewProgram = props.handleChangeNewProgram.bind(this);
    this.submitNewProgram = props.submitNewProgram.bind(this);
    this.state = {
      data: [],
    };
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.setModalHide2}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            New Program:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.header.map((head, i) => (
            <>
              <h5 key={i}>{head.name}:</h5>
              <Form>
                <Form.Group>
                  {/* <p>{prop}:</p> */}
                  <Form.Control
                    type="text"
                    onChange={(e) =>
                      this.handleChangeNewProgram(e, head.prop, i)
                    }
                    value={this.props.newProgramData[head.prop]}
                  />
                </Form.Group>
              </Form>
            </>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.submitNewProgram()}>Assign</Button>
          <Button onClick={this.setModalHide2}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default NewProgramWindow;
