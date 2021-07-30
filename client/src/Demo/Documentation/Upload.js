import FilesUploadComponent from "../../App/components/files-upload-component";
import axios from "axios";

import React from "react";
import { Row, Col, Card } from "react-bootstrap";

import Aux from "../../hoc/_Aux";
import { upload } from "../../api";

class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmitFile = this.onSubmitFile.bind(this);
    this.state = {
      error: null,
      file: "",
      isLoaded: false,
    };
  }

  componentDidMount() {
    this.setState({ file: "" });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      this.setState({
        isLoaded: true,
      });
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
          alert("Upload success");
          this.setState({
            file: "",
            isLoaded: false,
          });
        } else {
          alert("Upload failed");
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

  onDownloadFile(e, id) {
    e.preventDefault();
    const auth = localStorage.getItem("token");
    var actualFileName;
    fetch(window.upload + "/" + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      .then((res) => {
        actualFileName = res.headers.get("Content-Disposition").split('"')[1];
        return res.blob();
      })
      .then(
        (blob) => {
          console.log(actualFileName);
          if (blob.size === 0) return;
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
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // console.log(error);
          // console.log();
          alert("The file is not available.");
          // this.setState({
          //     isLoaded: true,
          //     error
          // });
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
      return (
        <Aux>
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">
                    Upload Your University Documets
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <h5>Bachelor's Certificate</h5>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="bachelorCertificate_"
                    checkboxid="bachelorCertificateCheckbox"
                  />
                  <h5 className="mt-5">Bachelor's Transcript</h5>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="bachelorTranscript_"
                    checkboxid="bachelorTranscriptCheckbox"
                  />
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">
                    Upload Your Language Certificate
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <h6>English: IELTS/TOEFL</h6>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="EnglischCertificate_"
                    checkboxid="englishCertiifcateCheckbox"
                  />
                  <h6 className="mt-5">German: TestDaF/DSH/Goethe B2</h6>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="GermanCertificate_"
                    checkboxid="germanCertiifcateCheckbox"
                  />
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">
                    Upload Your High School Documets
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <h5>High School Diploma</h5>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="highSchoolDiploma_"
                    checkboxid="highschoolDiplomaCheckbox"
                  />
                  <h5 className="mt-5">High School Transcript</h5>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="highSchoolTranscript_"
                    checkboxid="highschoolTranscriptCheckbox"
                  />
                  <h5 className="mt-5">University Entrance Examination</h5>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="universityEntranceExamination_"
                    checkboxid="universityEntranceExaminationCheckbox"
                  />
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title as="h5">Others</Card.Title>
                </Card.Header>
                <Card.Body>
                  <h6>CV</h6>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="CV_"
                    checkboxid="CVCheckbox"
                  />
                  <h6 className="mt-5">Recommendation Letter 1</h6>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="RL_"
                    checkboxid="RLCheckbox"
                  />
                  <h6 className="mt-5">Recommendation Letter 2</h6>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="RL2_"
                    checkboxid="RL2Checkbox"
                  />
                  <h6 className="mt-5">ECTS-Credits Conversion</h6>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="ECTS_conversion_"
                    checkboxid="ECTS_conversionCheckbox"
                  />
                  <h6 className="mt-5">Course description</h6>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="CourseDescription_"
                    checkboxid="CourseDescriptionCheckbox"
                  />
                  <h6 className="mt-5">Passport</h6>
                  <hr />
                  <FilesUploadComponent
                    onFileChange={this.onFileChange}
                    submitFile={this.submitFile}
                    onDownloadFile={this.onDownloadFile}
                    id="Passport_"
                    checkboxid="PassportCheckbox"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default UploadPage;
