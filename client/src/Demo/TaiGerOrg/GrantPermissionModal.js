import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

class GrantPermissionModal extends React.Component {
  state = {
    permissions: [],
    changed: false
  };
  componentDidMount() {
    this.setState({
      permissions:
        this.props.user_permissions.length > 0
          ? this.props.user_permissions[0]
          : { canAssignEditors: false, canAssignAgents: false }
    });
  }
  onChangePermissions = (e) => {
    const { value, checked } = e.target;
    this.setState((prevState) => ({
      permissions: {
        ...prevState.permissions,
        [value]: checked
      },
      changed: true
    }));
  };

  onChangePermissions_Quota = (e) => {
    const { value, id } = e.target;
    this.setState((prevState) => ({
      permissions: {
        ...prevState.permissions,
        [id]: value
      },
      changed: true
    }));
  };

  onSubmitHandler = (e) => {
    this.props.onUpdatePermissions(e, this.state.permissions);
  };
  render() {
    const permissions = [
      ['canModifyProgramList', 'Can modify program list'],
      [
        'canModifyAllBaseDocuments',
        'Can modify all Base Documents And Survey Data'
      ],
      ['canAccessAllChat', 'Can access all chat'],
      ['canAssignAgents', 'Can assign agents'],
      ['canAssignEditors', 'Can assign editors'],
      ['canModifyDocumentation', 'Can modify documentation'],
      ['canAccessStudentDatabase', 'Can access student database'],
      ['canUseTaiGerAI', 'Can use TaiGer AI']
    ];
    const permissionsQuota = [['taigerAiQuota', 'TaiGerAI Quota']];
    // console.log(this.state.permissions);
    return (
      <Modal
        show={this.props.modalShow}
        onHide={this.props.setModalHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit {this.props.firstname} - {this.props.lastname} permissions:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Permission</th>
                <th>Check</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, i) => (
                <tr key={i + 1}>
                  <td>{permission[1]}</td>
                  <td>
                    <Form.Group>
                      <Form.Check
                        // custom
                        type="checkbox"
                        // name="agent_id"
                        // defaultChecked={this.state.permissions[permission[0]]}
                        checked={this.state.permissions[permission[0]]}
                        onChange={(e) => this.onChangePermissions(e)}
                        value={permission[0]}
                      />
                    </Form.Group>
                  </td>
                </tr>
              ))}
              {permissionsQuota.map((permission_quota, j) => (
                <tr key={j + 1000}>
                  <td>{permission_quota[1]}</td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        type="number"
                        placeholder="1000"
                        id={permission_quota[0]}
                        value={this.state.permissions[permission_quota[0]]}
                        onChange={(e) => this.onChangePermissions_Quota(e)}
                      />
                    </Form.Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!this.state.changed}
            onClick={(e) => this.onSubmitHandler(e)}
          >
            Update
          </Button>
          <Button onClick={this.props.setModalHide} variant="light">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default GrantPermissionModal;
