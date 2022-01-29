import React from "react";
import { Row, Col, Card, Form, Button, Spinner, Modal } from "react-bootstrap";

import Aux from "../../hoc/_Aux";
import { updatePersonalData, getStudents } from "../../api";
class Profile extends React.Component {
  state = {
    error: null,
    role: "",
    isLoaded: false,
    data: null,
    success: false,
    user: {},
    personaldata: {
      firstname: this.props.user.firstname,
      lastname: this.props.user.lastname,
    },
    updateconfirmed: false,
  };

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          console.log(data);
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            personaldata: {
              firstname: this.props.user.firstname,
              lastname: this.props.user.lastname,
            },
            success: success,
          }));
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  }

  handleChange_PersonalData = (e) => {
    console.log(e.target.value);
    console.log(e.target.id);
    // e.preventDefault();
    var personaldata_temp = { ...this.state.personaldata };
    personaldata_temp[e.target.id] = e.target.value;
    console.log(personaldata_temp);
    this.setState((state) => ({
      ...state,
      personaldata: personaldata_temp,
    }));
  };

  handleSubmit_PersonalData = (e, personaldata) => {
    console.log(personaldata);
    // e.preventDefault();
    updatePersonalData(personaldata).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          console.log(data);
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            personaldata: data,
            success: success,
            updateconfirmed: true,
          }));
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  };

  onHide = () => {
    this.setState({
      updateconfirmed: false,
    });
  };

  setmodalhide = () => {
    window.location.reload(true);
    // this.setState({
    //   updateconfirmed: false,
    // });
  };

  render() {
    const { error, isLoaded } = this.state;
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <Aux>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Personal Data</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="firstname">
                      <Form.Label>Firstname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        autoComplete="nope"
                        defaultValue={this.state.personaldata.firstname}
                        onChange={(e) => this.handleChange_PersonalData(e)}
                      />
                    </Form.Group>
                    <br />
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={this.props.user.email}
                      />
                    </Form.Group>
                    {/* <Form.Group controlId="birthday">
                      <Form.Label>Birthday Date</Form.Label>
                      <Form.Control type="date" placeholder="Date of Birth" />
                    </Form.Group> */}
                    {/* <Form.Group controlId="form.BasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group> */}
                    {/* </Form> */}
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastname">
                      <Form.Label>Lastname</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        defaultValue={this.state.personaldata.lastname}
                        onChange={(e) => this.handleChange_PersonalData(e)}
                      />
                    </Form.Group>
                    <br />
                    <br />
                    <Button
                      variant="primary"
                      onClick={(e) =>
                        this.handleSubmit_PersonalData(
                          e,
                          this.state.personaldata
                        )
                      }
                    >
                      Update
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Col>
        </Row>
        <Modal
          show={this.state.updateconfirmed}
          onHide={this.setmodalhide}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Update Success
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Personal Data is updated successfully!</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setmodalhide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Aux>
    );
  }
}

export default Profile;
