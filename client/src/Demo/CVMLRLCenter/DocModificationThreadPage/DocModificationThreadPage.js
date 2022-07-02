import React, { Component } from "react";
import { Row, Col, Spinner, Button, Card } from "react-bootstrap";
import Aux from "../../../hoc/_Aux";
import MessageList from "./MessageList";
import ToggleableArticleForm from "./ToggleableArticleForm";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import parse from "html-react-parser";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./DraftEditor.css";
import { FileUploader } from "react-drag-drop-files";
import {
  updateDoc,
  deleteDoc,
  createArticle,
  getApplicationArticle,
  SubmitMessageWithAttachment,
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
    isLoaded: false,
    articles: [],
    thread: [],
    editFormOpen: false,
    defaultStep: 1,
    activeStep: 0,
    editorState: null,
    completed: {},
  };
  componentDidMount() {
    console.log(this.props.match.params.documentsthreadId);

    getMessagThread(this.props.match.params.documentsthreadId).then(
      (resp) => {
        const { success, data } = resp.data;
        console.log(data);
        if (success) {
          this.setState({
            success,
            thread: data,
            isLoaded: true,
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

  handleCreateFormSubmit = (article) => {
    this.createArticle(article);
  };

  handleEditorChange = (newstate) => {
    this.setState((state) => ({ ...state, editorState: newstate }));
    // this.convertContentToHTML();
  };

  ConfirmSubmitMessageHandler = (editorState) => {
    var message = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    // this.setState((state) => ({
    //   ...state,
    //   isLoaded: false, //false to reload everything
    // }));
    SubmitMessageWithAttachment(
      this.props.match.params.documentsthreadId,
      this.state.userId,
      message
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        console.log(data);
        if (success) {
          this.setState({
            success,
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
    // updateEditGeneralFileCommentsforstudent(
    //   this.props.match.params.documentsthreadId,
    //   this.state.userId,
    //   message
    // ).then(
    //   (resp) => {
    //     console.log(resp.data.data);
    //     const { data, success } = resp.data;
    //     if (success) {
    //       setTimeout(
    //         function () {
    //           //Start the timer
    //           this.setState((state) => ({
    //             ...state,
    //             studentId: "",
    //             isLoaded: true,
    //             student: data,
    //             success: success,
    //             CommentsModel: false,
    //         }));
    //       }.bind(this),
    //       1500
    //     );
    //   } else {
    //     alert(resp.data.message);
    //     this.setState((state) => ({
    //       ...state,
    //       studentId: "",
    //       isLoaded: true,
    //       success: success,
    //       CommentsModel: false,
    //     }));
    //   }
    // },
    // (error) => {
    //   console.log(error);
    //   }
    // );
  };

  createArticle = (article) => {
    let article_temp = {};
    Object.assign(article_temp, {
      Titel_: article.Titel_,
      Content_: article.Content_,
      Category_: article.Category_,
      LastUpdate_: article.LastUpdate_,
    });
    // delete article_temp._id;
    // console.log("article_temp : " + JSON.stringify(article_temp));
    createArticle(article_temp).then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            articles: this.state.articles.concat(data),
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
        <Row>
          <div>
            <Row>
              <Col>
                {this.state.thread.student_id.firstname}{" "}
                {this.state.thread.student_id.lastname}
                {this.state.thread.application_id
                  ? this.state.thread.application_id.program_name
                  : ""}
              </Col>
            </Row>
            <Row>
              <Col>
                {!isLoaded && (
                  <div style={style}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  </div>
                )}
                <MessageList
                  thread={this.state.thread}
                  category="application"
                  onFormSubmit={this.handleEditFormSubmit}
                  onTrashClick={this.handleTrashClick}
                  role={this.props.user.role}
                  isLoaded={this.state.isLoaded}
                />
                {this.props.user.role === "Admin" ||
                this.props.user.role === "Agent" ? (
                  <ToggleableArticleForm
                    category="application"
                    onFormSubmit={this.handleCreateFormSubmit}
                  />
                ) : (
                  <></>
                )}
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
                      editorState={this.state.editorState}
                      onEditorStateChange={this.handleEditorChange}
                      // wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      toolbar={{
                        options: [
                          "inline",
                          "fontSize",
                          "fontFamily",
                          "list",
                          "textAlign",
                          // "colorPicker",
                          "link",
                          "image",
                          // "file",
                        ],
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
                      <FileUploader />
                    </Row>
                    <Row>
                      <Button
                        // disabled={!isLoaded}
                        className="float-right"
                        onClick={() =>
                          this.ConfirmSubmitMessageHandler(
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
