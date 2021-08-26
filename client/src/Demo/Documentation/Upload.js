import FilesUploadComponent from "../../App/components/files-upload-component";
import axios from "axios";

import React from "react";
import { Row, Col, Card } from "react-bootstrap";

import Aux from "../../hoc/_Aux";
import {
  getMyfiles,
  deleteFile,
  upload,
  download,
  templateDownload,
} from "../../api";
import EditUploadFilesSubpage from "./EditUploadFilesSubpage";

class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmitFile = this.onSubmitFile.bind(this);
    this.state = {
      error: null,
      file: "",
      isLoaded: false,
      student: [],
      role: "",
    };
  }
  componentDidMount() {
    getMyfiles().then(
      (resp) => {
        const { data: student, role: role } = resp.data;
        console.log("role: " + role);
        this.setState({
          file: "",
          isLoaded: true,
          student: student,
          role: role,
        });
      },
      (error) => {
        console.log(error);
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getMyfiles().then(
        (resp) => {
          const { data: student, role: role } = resp.data;
          console.log(resp.data.data);
          this.setState({
            isLoaded: true,
            student: student,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: true,
          });
        }
      );
    }
  }

  onFileChange(e) {
    this.setState({
      file: e.target.files[0],
    });
  }

  onSubmitFile(e, id) {
    const formData = new FormData();
    formData.append("file", this.state.file);
    upload(id, formData).then(
      (res) => {
        if (res.status === 200) {
          // alert("Upload success");
          this.setState({
            file: "",
            isLoaded: false,
          });
        } else {
          // alert("Upload failed");
          this.setState({
            file: "",
            isLoaded: false,
          });
        }
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }

  submitFile = (e, id) => {
    if (this.state.file === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      this.onSubmitFile(e, id);
    }
  };

  getFileNameFromContentDisposition(contentDisposition) {
    if (!contentDisposition) return null;

    const match = contentDisposition.match(/filename="?([^"]+)"?/);

    return match ? match[1] : null;
  }

  onDeleteFilefromstudent = (e, category, id) => {
    // e.preventDefault();
    deleteFile(category, id).then(
      (resp) => {},
      (error) => {}
    );
  };

  onDownloadFilefromstudent(e, category, id) {
    e.preventDefault();
    download(category, id).then(
      (resp) => {
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
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

  // FIXME: id is template
  // This is download template file.
  onDownloadFile(e, category) {
    e.preventDefault();
    const auth = localStorage.getItem("token");
    var actualFileName;
    templateDownload(category).then(
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
    if (error) {
      //TODO: put error page component for timeout
      localStorage.removeItem("token");
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      if (this.state.role === "Student") {
        return (
          <Aux>
            <Row>
              <Col>
                <Card>
                  {/* <Card.Title> */}
                    <Card.Header as="h5">
                      {/* <Card.Title as="h5"> */}
                        Upload Your Application Documets
                      {/* </Card.Title> */}
                    </Card.Header>
                  {/* </Card.Title> */}
                  {/* <Card.Body> */}
                    <EditUploadFilesSubpage
                      student={this.state.student}
                      submitFile={this.submitFile}
                      onFileChange={this.onFileChange}
                      documentslist={window.documentlist}
                      onDownloadFilefromstudent={this.onDownloadFile}
                      onRejectFilefromstudent={this.onRejectFilefromstudent}
                      onAcceptFilefromstudent={this.onAcceptFilefromstudent}
                      onDeleteFilefromstudent={this.onDeleteFilefromstudent}
                      onDownloadFilefromstudent={this.onDownloadFilefromstudent}
                    />
                </Card>
              </Col>
            </Row>
          </Aux>
        );
      } else if (
        this.state.role === "Agent" ||
        this.state.role === "Editor" ||
        this.state.role === "Admin"
      ) {
        return (
          <Aux>
            <Row>
              <Col>
                <div> This page is for paid Student only. </div>
              </Col>
            </Row>
          </Aux>
        );
      } else {
        return (
          <Aux>
            <Row>
              <Col>
                <div> This is for Premium only. Please contact our sales! </div>
              </Col>
            </Row>
          </Aux>
        );
      }
    }
  }
}

export default UploadPage;
