import React, { Component } from "react";
import { Row, Col, Spinner, Button, Card, Form } from "react-bootstrap";
import Aux from "../../../hoc/_Aux";
import MessageList from "./MessageList";
import { convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  updateDoc,
  deleteDoc,
  SubmitMessageWithAttachment,
  getMessageFileDownload,
  getMessagThread,
} from "../../../api";

const steps = [
  "Step 1: Get an account",
  "Step 2: Fill personal information",
  "Step 3: Choose programs",
  "Step 4: Pay",
  "Step 5: Send copy to Germany",
];
class Application extends Component {
  state = {
    error: null,
    file: null,
    isLoaded: false,
    articles: [],
    thread: [],
    editFormOpen: false,
    defaultStep: 1,
    activeStep: 0,
    editorState: null,
    completed: {},
    expand: true,
    accordionKeys: [0], // to expand all]
  };
  componentDidMount() {
    console.log(this.props.match.params.documentsthreadId);

    getMessagThread(this.props.match.params.documentsthreadId).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            thread: data,
            isLoaded: true,
            documentsthreadId: this.props.match.params.documentsthreadId,
            file: null,
            accordionKeys: new Array(data.messages.length)
              .fill()
              .map((x, i) => i), // to expand all
            //   accordionKeys: new Array(-1, data.length), // to collapse all
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: false,
          error,
        });
      }
    );
  }

  onFileChange = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  handleEditorChange = (newstate) => {
    this.setState((state) => ({ ...state, editorState: newstate }));
  };

  ConfirmSubmitMessageHandler = (e, editorState) => {
    // e.preventDefault();

    var message = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("message", message);

    SubmitMessageWithAttachment(
      this.state.documentsthreadId,
      // this.state.userId,
      this.state.thread.student_id._id,
      // this.state.thread.file_type,
      // message,
      formData
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            file: null,
            editorState: null,
            thread: data,
            isLoaded: true,
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  handleEditFormSubmit = (update_article) => {
    this.updateArticle(update_article);
  };

  updateArticle = (attrs) => {
    //update article
    this.setState({
      articles: this.state.articles.map((article) => {
        if (article._id === attrs._id) {
          return Object.assign({}, article, {
            _id: attrs._id,
            Titel_: attrs.Titel_,
            Content_: attrs.Content_,
            Category_: attrs.Category_,
            LastUpdate_: attrs.LastUpdate_,
          });
        } else {
          return article;
        }
      }),
    });
    let article_temp = {};
    Object.assign(article_temp, {
      //remove _id
      Titel_: attrs.Titel_,
      Content_: attrs.Content_,
      Category_: attrs.Category_,
      LastUpdate_: attrs.LastUpdate_,
    });
    updateDoc(attrs._id, article_temp).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            articles: this.state.articles.map((article) => {
              if (article._id === attrs._id) {
                return Object.assign(article, attrs);
              } else {
                return article;
              }
            }),
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: false,
          error,
        });
      }
    );
  };

  onDownloadFileInMessage = (e, message_id, file_id) => {
    e.preventDefault();
    getMessageFileDownload(
      this.state.documentsthreadId,
      message_id,
      file_id
    ).then(
      (resp) => {
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type

        if (filetype === "pdf") {
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          // Open the URL on new Window
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
  };

  handleTrashClick = (articleId) => {
    this.deleteArticle(articleId);
  };

  deleteArticle = (articleId) => {
    this.setState({
      articles: this.state.articles.filter(
        (article) => article._id !== articleId
      ),
    });

    deleteDoc(articleId).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: false,
          error,
        });
      }
    );
  };
  handleClick = (e) => {
    this.setState((state) => ({
      ...state,
      defaultStep: this.state.defaultStep + 1,
    }));
  };

  singleExpandtHandler = (idx) => {
    let accordionKeys = [...this.state.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    this.setState((state) => ({
      ...state,
      accordionKeys: accordionKeys,
    }));
  };

  AllCollapsetHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: false,
      accordionKeys: new Array(this.state.thread.messages.length)
        .fill()
        .map((x, i) => -1), // to collapse all]
    }));
  };

  AllExpandtHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys: new Array(this.state.thread.messages.length)
        .fill()
        .map((x, i) => i), // to expand all]
    }));
  };

  render() {
    const { error, isLoaded } = this.state;
    const { completed, activeStep } = this.state;
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
      <Aux>
        {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        <Row>
          <Card className="mt-0">
            <Card.Header>
              <Card.Title as="h5">
                <h4>
                  {this.state.thread.student_id.firstname}{" "}
                  {this.state.thread.student_id.lastname}
                  {" - "}
                  {this.state.thread.program_id
                    ? this.state.thread.program_id.school +
                      " " +
                      this.state.thread.program_id.program_name
                    : ""}{" "}
                  {this.state.thread.file_type}
                  {" Discussion thread"}
                  {"   "}
                  {this.state.expand ? (
                    <Button
                      className="btn-sm float-right"
                      onClick={() => this.AllCollapsetHandler()}
                    >
                      Collaspse
                    </Button>
                  ) : (
                    <Button
                      className="btn-sm float-right"
                      onClick={() => this.AllExpandtHandler()}
                    >
                      Expand
                    </Button>
                  )}
                </h4>
              </Card.Title>
            </Card.Header>
          </Card>
        </Row>
        <Row>
          <div>
            <Row>
              <Col>
                <MessageList
                  onDownloadFileInMessage={this.onDownloadFileInMessage}
                  accordionKeys={this.state.accordionKeys}
                  singleExpandtHandler={this.singleExpandtHandler}
                  thread={this.state.thread}
                  onFormSubmit={this.handleEditFormSubmit}
                  onTrashClick={this.handleTrashClick}
                  // role={this.props.user.role}
                  isLoaded={this.state.isLoaded}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <Card.Title as="h5">
                      {this.props.user.firstname} {this.props.user.lastname}
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Editor
                      spellCheck={true}
                      // onFocus={onClick={this.handle}}
                      placeholder={"Write comments"}
                      editorState={this.state.editorState}
                      onEditorStateChange={this.handleEditorChange}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      toolbar={{
                        // options: [
                        //   "inline",
                        //   "fontSize",
                        //   "fontFamily",
                        //   "list",
                        //   "textAlign",
                        //   "colorPicker",
                        //   "link",
                        //   "image",
                        //   // "file",
                        // ],
                        link: {
                          defaultTargetOption: "_blank",
                          popupClassName: "mail-editor-link",
                        },
                        image: {
                          urlEnabled: true,
                          uploadEnabled: true,
                          uploadCallback: this.uploadImageCallBack,
                          alignmentEnabled: true,
                          defaultSize: {
                            height: "auto",
                            width: "auto",
                          },
                          inputAccept:
                            "application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel",
                        },
                      }}
                    />
                    <Row>
                      <Form>
                        <Row>
                          <Form.File.Label
                            // key={this.state.file || ""}
                            onClick={(e) =>
                              (e.target.value = this.state.file || "")
                            }
                          >
                            <Form.File.Input
                              onChange={(e) => this.onFileChange(e)}
                            />
                            {/* <IoMdCloudUpload size={32} /> */}
                          </Form.File.Label>
                        </Row>
                      </Form>
                    </Row>
                    <Row>
                      <Button
                        disabled={
                          !this.state.editorState ||
                          !this.state.editorState.getCurrentContent().hasText()
                        }
                        className="float-right"
                        onClick={(e) =>
                          this.ConfirmSubmitMessageHandler(
                            e,
                            this.state.editorState
                          )
                        }
                      >
                        Submit
                      </Button>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Row>
      </Aux>
    );
  }
}

export default Application;
