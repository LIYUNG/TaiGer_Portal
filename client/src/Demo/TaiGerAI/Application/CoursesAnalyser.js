import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Aux from "../../../hoc/_Aux";
import ApplicationArticleList from "../ArticleList";
import UploadAndGenerate from "../UploadAndGenerate";

import { transcriptanalyser, generatedFileDownload } from "../../../api";

class CoursesAnalyser extends Component {
  state = {
    error: null,
    isLoaded: false,
    articles: [],
    file: "",
    editFormOpen: false,
    generatedfileExisted: false,
    generatedfilename: "",
  };
  componentDidMount() {
    // console.log("get article");
    // const auth = localStorage.getItem("token");
    // getApplicationArticle().then(
    //   (resp) => {
    //     const {
    //       data: { documents },
    //     } = resp;
    //     console.log(JSON.stringify(documents));
    //     this.setState({
    //       articles: documents,
    //       isLoaded: true,
    //     });
    //   },
    //   (error) => {
    //     this.setState({
    //       isLoaded: false,
    //       error,
    //     });
    //   }
    // );

    this.setState({
      isLoaded: true,
    });
  }

  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };
  //from /upload
  onSubmitFile(e, category, id) {
    const formData = new FormData();
    formData.append("file", this.state.file);
    transcriptanalyser(id, category, formData).then(
      (res) => {
        if (res.status === 200) {
          alert("Upload success");
          console.log("res.generatedfile = " + res.data.generatedfile);
          this.setState({
            file: "",
            generatedfilename: res.data.generatedfile,
            generatedfileExisted: true,
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
      this.onSubmitFile(e, category, id);
    }
  };

  onDownloadFile(e, category, filename) {
    e.preventDefault();
    const auth = localStorage.getItem("token");
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
              {/* <ApplicationArticleList
                articles={this.state.articles}
                category="application"
                onFormSubmit={this.handleEditFormSubmit}
              /> */}
              <UploadAndGenerate
                id="ToBeGenerated"
                onFileChange={this.onFileChange}
                submitFile={this.submitFile}
                onDownloadFile={this.onDownloadFile}
                generatedfileExisted={this.state.generatedfileExisted}
                generatedfilename={this.state.generatedfilename}
              />
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default CoursesAnalyser;
