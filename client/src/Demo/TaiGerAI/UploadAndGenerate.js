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
import { IoMdCloudUpload } from "react-icons/io";

import { transcriptanalyser, generatedFileDownload } from "../../api";

class UploadAndGenerate extends Component {
  // TODO: replace by database
  state = {
    isGenerated: false,
    isLoaded: false,
    error: null,
    file: "",
    generatedfileExisted: false,
    generatedfilename: "",
    category: "",
    course_feedback: "",
    student: this.props.student,
  };
  componentDidMount() {
    this.setState({ isLoaded: true });
  }
  handleSelect = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ category: e.target.value });
  };
  handleContentChange = (e) => {
    this.setState({ course_feedback: e.target.value });
  };
  //from /upload
  submitFile = (e, category) => {
    if (!this.state.category) {
      e.preventDefault();
      alert("Please select program group");
    } else {
      this.setState((state) => ({
        isLoaded: false,
      }));
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      transcriptanalyser(
        this.props.user._id,
        this.state.category,
        formData
      ).then(
        (res) => {
          const { data, success } = res.data;
          console.log(res);
          if (success) {
            this.setState((state) => ({
              ...state,
              category: "",
              isLoaded: true,
              student: data,
              success: success,
            }));
          } else {
            alert(res.data.message);
            this.setState((state) => ({
              ...state,
              category: "",
              isLoaded: true,
              success: success,
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

  onDownloadGeneratedFile(e, filename) {
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
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
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
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control
                      as="select"
                      onChange={(e) => this.handleSelect(e)}
                    >
                      <option value="">Please Select</option>
                      <option value="ee">Electrical Engieering (ee)</option>
                      <option value="cs">Computer Science (cs)</option>
                      <option value="me">Mechanical Engineering (me)</option>
                    </Form.Control>
                  </Form.Group>
                </Form>
              </Col>
              <Col md={2}>
                {/* New*/}{" "}
                <Form>
                  <Form.File.Label
                    onChange={(e) => this.submitFile(e)}
                    onClick={(e) => (e.target.value = null)}
                  >
                    <Form.File.Input hidden />
                    <IoMdCloudUpload size={32} />
                  </Form.File.Label>
                </Form>
              </Col>
              {this.state.student.taigerai &&
              this.state.student.taigerai.input &&
              this.state.student.taigerai.input.name !== "" ? (
                <>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDownloadGeneratedFile(
                          e,
                          this.state.student.taigerai.input.name
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
                </>
              ) : (
                <></>
              )}
              {this.state.student.taigerai &&
              this.state.student.taigerai.output &&
              this.state.student.taigerai.output.name !== "" ? (
                <>
                  <Col md={2}>
                    <h6>Generated file download: </h6>
                  </Col>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDownloadGeneratedFile(
                          e,
                          this.state.student.taigerai.output.name
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
            <Row>
              <h6>Agent Feedback:</h6>
            </Row>
            <Row>
              <Form>
                <Form.Control
                  as="textarea"
                  rows="10"
                  onChange={this.handleContentChange}
                  defaultValue={this.props.content}
                  placeholder="Content"
                />
              </Form>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default UploadAndGenerate;
