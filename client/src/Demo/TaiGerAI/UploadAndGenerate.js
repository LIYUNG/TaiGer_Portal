import React, { Component } from "react";
import {
  DropdownButton,
  Dropdown,
  Button,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";
class UploadAndGenerate extends Component {
  // TODO: replace by database
  state = {
    isGenerated: false,
    selected: "Please Select",
  };
  handleFormOpen = () => {
    this.setState({ isGenerated: true });
  };

  handleFormClose = () => {
    this.setState({ isGenerated: false });
  };

  handleFormSubmit = (article) => {
    this.props.onFormSubmit(article);
    this.setState({ isGenerated: false });
  };
  handleSelect = (eventKey) => {
    console.log(eventKey);
    this.setState({ selected: eventKey });
  };

  render() {
    if (this.props.generatedfileExisted) {
      return (
        <Card>
          <Card.Header>
            <Card.Title as="h5">Upload Your Transcript in Excel.</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form>
                  {/* <Form.Group>
                    <Form.Check
                      custom
                      type="checkbox"
                      id={this.props.checkboxid}
                      label="status"
                    />
                  </Form.Group> */}
                  <DropdownButton
                    alignRight
                    id="dropdown-menu-align-right"
                    onSelect={(e) => this.handleSelect(e)}
                    title={this.state.selected}
                  >
                    <Dropdown.Item eventKey="ee">
                      Electrical Engieering (ee)
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="cs">
                      Computer Science (cs)
                    </Dropdown.Item>
                  </DropdownButton>
                </Form>
              </Col>
              <Col md={5}>
                <Form
                  onChange={(e) => this.props.onFileChange(e)}
                  onClick={(e) => (e.target.value = null)}
                >
                  <Form.File id={this.props.id}>
                    {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                    <Form.File.Input />
                  </Form.File>
                </Form>
              </Col>
              <Col md={2}>
                <Form
                  onSubmit={(e) =>
                    this.props.submitFile(e, this.state.selected, this.props.id)
                  }
                >
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <div className="form-group">
                      <Button className="btn btn-primary" type="submit">
                        Upload
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={1.5}>
                <h5>Generated file download: </h5>
              </Col>
              <Col md={2}>
                <Form
                  onSubmit={(e) =>
                    this.props.onDownloadFile(
                      e,
                      "ToBeGenerated",
                      this.props.generatedfilename
                    )
                  }
                >
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <div className="form-group">
                      <Button className="btn btn-primary" type="submit">
                        Download
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <Card>
          <Card.Header>
            <Card.Title as="h5">Upload Your University Documets</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form>
                  {/* <Form.Group>
                    <Form.Check
                      custom
                      type="checkbox"
                      id={this.props.checkboxid}
                      label="status"
                    />
                  </Form.Group> */}
                  <DropdownButton
                    alignRight
                    id="dropdown-menu-align-right"
                    onSelect={(e) => this.handleSelect(e)}
                    title={this.state.selected}
                  >
                    <Dropdown.Item eventKey="ee">
                      Electrical Engieering (ee)
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="cs">
                      Computer Science (cs)
                    </Dropdown.Item>
                  </DropdownButton>
                </Form>
              </Col>
              <Col md={5}>
                <Form
                  onChange={(e) => this.props.onFileChange(e)}
                  onClick={(e) => (e.target.value = null)}
                >
                  <Form.File id={this.props.id}>
                    {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                    <Form.File.Input />
                  </Form.File>
                </Form>
              </Col>
              <Col md={2}>
                <Form
                  onSubmit={(e) =>
                    this.props.submitFile(e, this.state.selected, this.props.id)
                  }
                >
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <div className="form-group">
                      <Button className="btn btn-primary" type="submit">
                        Upload
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      );
    }
  }
}

export default UploadAndGenerate;
