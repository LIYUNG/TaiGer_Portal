import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

class GrantManagerModal extends React.Component {
  state = {
    payload: {},
    changed: false
  };
  componentDidMount() {}

  onChange = (e) => {
    const { id, value } = e.target;
    this.setState((prevState) => ({
      payload: {
        ...prevState.payload,
        [id]: value
      },
      changed: true
    }));
  };

  onSubmitHandler = (e) => {
    this.props.onUpdatePermissions(e, this.state.payload);
  };
  render() {
    return (
      <Modal
        show={this.props.managerModalShow}
        onHide={this.props.setManagerModalHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Set {this.props.firstname} - {this.props.lastname} as Manager:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="manager_type">
              <Form.Label>Configure Manager Type</Form.Label>
              <Form.Control as="select" controlId onChange={this.onChange}>
                <option>Please Select</option>
                <option value="Agent">Agent Manager</option>
                <option value="Editor">Editor Manager</option>
                <option value="AgentAndEditor">
                  Both Agent and Editor Manager
                </option>
              </Form.Control>
            </Form.Group>
          </Form>
          <br />
          configure agents
          <br />
          configure editors
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!this.state.changed}
            onClick={(e) => this.onSubmitHandler(e)}
          >
            Confirm
          </Button>
          <Button onClick={this.props.setManagerModalHide} variant="light">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default GrantManagerModal;
