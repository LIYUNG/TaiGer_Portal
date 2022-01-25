import React, { Component } from "react";
import {
  // DropdownButton,
  // Dropdown,
  Button,
  Row,
  Col,
  Form,
  Card,
  Spinner,
} from "react-bootstrap";

import { transcriptanalyser, generatedFileDownload } from "../../api";

class UploadAndGenerate extends Component {
  // TODO: replace by database
  state = {
    isGenerated: false,
    selected: "Please Select",
    isLoaded: false,
    error: null,
    file: "",
    generatedfileExisted: false,
    generatedfilename: "",
    category: "",
  };
  componentDidMount() {
    this.setState({ isLoaded: true });
  }
  handleSelect = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ category: e.target.value });
  };

  onFileChange = (e) => {
    e.preventDefault();
    this.setState({
      file: e.target.files[0],
    });
  };

  //from /upload
  submitFile = (e, category) => {
    if (this.state.file === "") {
      e.preventDefault();
      alert("Please select file");
    } else if (category === "Please Select") {
      e.preventDefault();
      alert("Please select program group");
    } else {
      this.setState((state) => ({
        isLoaded: false,
      }));
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", this.state.file);
      transcriptanalyser(
        this.props.user._id,
        this.state.category,
        formData
      ).then(
        (res) => {
          if (res.status === 200) {
            // alert("Upload success");
            console.log("res.generatedfile = " + res.data.generatedfile);
            this.setState((state) => ({
              ...state,
              file: "",
              category: "",
              generatedfilename: res.data.generatedfile,
              generatedfileExisted: true,
              isLoaded: true,
            }));
          } else {
            alert("Upload failed");
            this.setState((state) => ({
              ...state,
              file: "",
              generatedfileExisted: false,
              isLoaded: true,
            }));
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            generatedfileExisted: false,
            error,
          });
        }
      );
    }
  };

  onDownloadFile(e, filename) {
    e.preventDefault();
    var actualFileName;
    generatedFileDownload(this.props.user._id, filename).then(
      (resp) => {
        actualFileName = resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;
        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type
        if (filetype === "pdf") {
          console.log(blob);
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
          console.log(url);
          window.open(url); //TODO: having a reasonable file name, pdf viewer
        } else {
          //if not pdf, download instead.
          const url = window.URL.createObjectURL(new Blob([blob]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", actualFileName);
          // Append to html link element page
          document.body.appendChild(link);
          // Start download
          link.click();
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        }
      },
      (error) => {
        alert("The file is not available.");
      }
    );
  }

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
    if (!isLoaded && !this.state.data) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Upload Your Transcript in Excel.</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form>
                  {/* <DropdownButton
                  size="sm"
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
                  <Dropdown.Item eventKey="me">
                    Mechanical Engineering (me)
                  </Dropdown.Item>
                </DropdownButton> */}
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleSelect(e)}
                    >
                      <option value="ee">Please Select</option>
                      <option value="ee">Electrical Engieering (ee)</option>
                      <option value="cs">Computer Science (cs)</option>
                      <option value="me">Mechanical Engineering (me)</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={3}>
                <Form
                  onChange={(e) => this.onFileChange(e)}
                  onClick={(e) => (e.target.value = null)}
                >
                  <Form.File>
                    <Form.File.Input />
                  </Form.File>
                </Form>
              </Col>
              <Col md={2}>
                <Form onSubmit={(e) => this.submitFile(e, this.state.category)}>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <div className="form-group">
                      <Button
                        size="sm"
                        className="btn btn-primary"
                        type="submit"
                        disabled={!this.state.isLoaded}
                      >
                        {this.state.isLoaded ? "Upload" : "Generating..."}
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </Col>
              {this.state.generatedfileExisted ? (
                <>
                  <Col md={2}>
                    <h5>Generated file download: </h5>
                  </Col>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDownloadFile(e, this.state.generatedfilename)
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
                </>
              ) : (
                <></>
              )}
              {!isLoaded && (
                <div style={style}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              )}
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default UploadAndGenerate;
