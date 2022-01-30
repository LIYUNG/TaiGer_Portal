import React from "react";
import { Row, Col } from "react-bootstrap";
import Card from "../../App/components/MainCard";
import Aux from "../../hoc/_Aux";
import {
  getMyfiles,
  deleteFile,
  upload,
  downloadProfile,
  templateDownload,
} from "../../api";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
import EditUploadFilesSubpage from "../Documentation/EditUploadFilesSubpage";

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
      success: false,
    };
  }
  componentDidMount() {
    getMyfiles(this.props.user._id).then(
      (resp) => {
        const { data: student, success } = resp.data;
        this.setState({
          file: "",
          isLoaded: true,
          student: student,
          success: success,
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
      getMyfiles(this.props.user._id).then(
        (resp) => {
          const { data: student, success } = resp.data;
          console.log(resp.data.data);
          this.setState({
            isLoaded: true,
            student: student,
            success: success,
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

  onSubmitFile = (e, studentId, docName) => {
    const formData = new FormData();
    formData.append("file", this.state.file);
    upload(studentId, docName, formData).then(
      (res) => {
        // console.log(res)
        if (res.data.success) {
          // console.log("Upload success");
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
    e.preventDefault();
    let idx = this.state.student.profile.findIndex(
      (doc) => doc.name === category
    );
    let std = { ...this.state.student };
    console.log(std);
    deleteFile(category, id).then(
      (res) => {
        std.profile[idx] = res.data.data; // res.data = {success: true, data:{...}}
        this.setState({
          student: std,
        });
      },
      (error) => {}
    );
  };

  onDownloadFilefromstudent(e, category, id) {
    e.preventDefault();
    downloadProfile(category, id).then(
      (resp) => {
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type
        console.log("actualFileName " + actualFileName);

        if (filetype === "pdf") {
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
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
    const { isLoaded } = this.state;
    let FILE_OK_SYMBOL = (
      <IoCheckmarkCircle size={18} color="limegreen" title="Valid Document" />
    );
    let FILE_NOT_OK_SYMBOL = (
      <AiFillCloseCircle size={18} color="red" title="Invalid Document" />
    );
    let FILE_UPLOADED_SYMBOL = (
      <AiOutlineFieldTime
        size={18}
        color="orange"
        title="Uploaded successfully"
      />
    );
    let FILE_MISSING_SYMBOL = (
      <AiFillQuestionCircle
        size={18}
        color="lightgray"
        title="No Document uploaded"
      />
    );
    let FILE_DONT_CARE_SYMBOL = (
      <BsDash size={18} color="lightgray" title="Not needed" />
    );
    let SYMBOL_EXPLANATION = (
      <>
        <p></p>
        <p>
          {FILE_OK_SYMBOL}: The document is valid and can be used in the
          application.
        </p>
        <p>
          {FILE_NOT_OK_SYMBOL}: The document is invalud and cannot be used in
          the application. Please properly scan a new one.
        </p>
        <p>
          {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will
          check it as soon as possible.
        </p>
        <p>{FILE_MISSING_SYMBOL}: Please upload the copy of the document.</p>
        <p>{FILE_DONT_CARE_SYMBOL}: This document is not needed.</p>
      </>
    );
    if (!this.state.success) {
      return <div>Error: This page is not authorized for you.</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      if (this.props.user.role === "Student") {
        return (
          <Aux>
            <Row>
              <Col>
                <Card title="Upload Your Application Documets">
                  <EditUploadFilesSubpage
                    userId={this.props.user._id}
                    student={this.state.student}
                    submitFile={this.submitFile}
                    onFileChange={this.onFileChange}
                    documentlist2={window.documentlist2}
                    onDeleteFilefromstudent={this.onDeleteFilefromstudent}
                    onDownloadFilefromstudent={this.onDownloadFilefromstudent}
                  />
                  {SYMBOL_EXPLANATION}
                </Card>
              </Col>
            </Row>
          </Aux>
        );
      } else if (
        this.props.user.role === "Agent" ||
        this.props.user.role === "Editor" ||
        this.props.user.role === "Admin"
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
