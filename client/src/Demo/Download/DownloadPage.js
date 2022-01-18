import React from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import Card from "../../App/components/MainCard";
import Aux from "../../hoc/_Aux";
import {
  deleteFile,
  upload,
  templateDownload,
  getTemplateDownload,
} from "../../api";
import EditDownloadFilesSubpage from "./EditDownloadFilesSubpage";

class DownloadPage extends React.Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmitFile = this.onSubmitFile.bind(this);
    this.state = {
      error: null,
      file: "",
      isLoaded: false,
      student: [],
      success: false,
    };
  }
  componentDidMount() {
    // getMyfiles(this.props.userId).then(
    //   (resp) => {
    //     console.log(this.props.userId);
    //     console.log(resp.data);
    //     const { data: student, success: success } = resp.data;
    //     console.log(success);
    this.setState({
      file: "",
      isLoaded: true,
      success: true,
    });
    //   },
    //   (error) => {
    //     console.log(error);
    //     console.log(": " + error);
    //     this.setState({
    //       isLoaded: true,
    //       error: true,
    //     });
    //   }
    // );
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.state.isLoaded === false) {
    //   getTemplateDownload(this.props.userId).then(
    //     (resp) => {
    //       const { data: student, success: success } = resp.data;
    //       console.log(resp.data.data);
    //       this.setState({
    //         isLoaded: true,
    //         student: student,
    //       });
    //     },
    //     (error) => {
    //       this.setState({
    //         isLoaded: true,
    //         error: true,
    //       });
    //     }
    //   );
    // }
  }

  onFileChange(e) {
    this.setState({
      file: e.target.files[0],
    });
  }

  onSubmitFile = (e, studentId, docName) => {
    const formData = new FormData();
    console.log(studentId);
    console.log(docName);
    formData.append("file", this.state.file);
    upload(studentId, docName, formData).then(
      (res) => {
        // console.log(res)
        if (res.data.success) {
          // alert("Upload success");
          console.log("Upload success");
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
  };

  submitFile = (e, studentId, docName) => {
    if (this.state.file === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      this.onSubmitFile(e, studentId, docName);
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

  onDownloadFilefromstudent(e, category) {
    e.preventDefault();
    getTemplateDownload(category).then(
      (resp) => {
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type
        console.log("actualFileName " + actualFileName);

        if (filetype === "pdf") {
          console.log(blob);
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
          console.log(url);
          var newWindow = window.open(url, "_blank"); //TODO: having a reasonable file name, pdf viewer
          newWindow.document.title = actualFileName;
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
    } else {
      if (
        this.props.user.role === "Student" ||
        this.props.user.role === "Admin" ||
        this.props.user.role === "Editor" ||
        this.props.user.role === "Agent"
      ) {
        return (
          <Aux>
            <Row>
              <Col>
                <Card title="Download TaiGer Document Templates">
                  <EditDownloadFilesSubpage
                    role={this.props.user.role}
                    userId={this.props.user._id}
                    student={this.state.student}
                    submitFile={this.submitFile}
                    onFileChange={this.onFileChange}
                    templatelist={window.templatelist}
                    onRejectFilefromstudent={this.onRejectFilefromstudent}
                    onAcceptFilefromstudent={this.onAcceptFilefromstudent}
                    onDeleteFilefromstudent={this.onDeleteFilefromstudent}
                    onDownloadFilefromstudent={this.onDownloadFilefromstudent}
                  />
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
          </Aux>
        );
      } else {
        // Guest
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

export default DownloadPage;
