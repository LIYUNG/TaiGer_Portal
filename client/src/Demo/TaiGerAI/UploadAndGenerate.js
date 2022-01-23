import React, { Component } from "react";
import {
  // DropdownButton,
  // Dropdown,
  Button,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";

import { transcriptanalyser, generatedFileDownload } from "../../api";

class UploadAndGenerate extends Component {
  // TODO: replace by database
  state = {
    isGenerated: false,
    selected: "Please Select",
    isLoading: false,
    file: "",
    generatedfileExisted: false,
    generatedfilename: "",
    category: "",
    id: "",
  };
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoading === true) {
      const formData = new FormData();
      formData.append("file", this.state.file);
      transcriptanalyser(this.state.id, this.state.category, formData).then(
        (res) => {
          if (res.status === 200) {
            // alert("Upload success");
            console.log("res.generatedfile = " + res.data.generatedfile);
            this.setState({
              file: "",
              category: "",
              id: "",
              generatedfilename: res.data.generatedfile,
              generatedfileExisted: true,
              isLoading: false,
            });
          } else {
            alert("Upload failed");
            this.setState({
              file: "",
              generatedfileExisted: false,
              isLoading: false,
            });
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
  }

  handleSelect = (eventKey) => {
    console.log(eventKey);
    this.setState({ selected: eventKey });
  };
  handleClick = () => {
    this.setState({
      isLoading: true,
    });
  };

  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };

  //from /upload
  submitFile = (e, category, id) => {
    if (this.state.file === "") {
      e.preventDefault();
      alert("Please select file");
    } else if (category === "Please Select") {
      e.preventDefault();
      alert("Please select program group");
    } else {
      e.preventDefault();
      this.setState({
        isLoading: true,
        category: category,
        id: id,
      });
    }
  };

  onDownloadFile(e, category, filename) {
    e.preventDefault();
    var actualFileName;
    generatedFileDownload(category, filename).then(
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
    return (
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
                  <Form.Control as="select">
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
                <Form.File id={this.props.id}>
                  <Form.File.Input />
                </Form.File>
              </Form>
            </Col>
            <Col md={2}>
              <Form
                onSubmit={(e) =>
                  this.submitFile(e, this.state.selected, this.props.id)
                }
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <div className="form-group">
                    <Button
                      size="sm"
                      className="btn btn-primary"
                      type="submit"
                      disabled={this.state.isLoading}
                    >
                      {this.state.isLoading ? "Generating..." : "Upload"}
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
                      this.onDownloadFile(
                        e,
                        this.props.id,
                        this.state.generatedfilename
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
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default UploadAndGenerate;
