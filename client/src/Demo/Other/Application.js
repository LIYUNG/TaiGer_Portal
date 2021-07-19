import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

import Aux from "../../hoc/_Aux";
import ApplicationArticleList from "./ApplicationArticleList";
import ToggleableArticleForm from "./ToggleableArticleForm";

class Application extends Component {
  state = {
    articles: [
      {
        id: 123,
        Titel_: "Application",
        Content_: "Content",
        LastUpdate_: "12/06/2021",
      },
      {
        id: 1234,
        Titel_: "Application2",
        Content_: "Content2",
        LastUpdate_: "13/06/2021",
      },
      {
        id: 12345,
        Titel_: "Application3",
        Content_: "Content3",
        LastUpdate_: "14/06/2021",
      },
    ],
    editFormOpen: false,
  };
  //   componentDidMount() {
  //       // TODO: fetch articles from server to this.state.articles
  //     this.setState({ file: "" });
  //   }

  handleCreateFormSubmit = (article) => {
    this.createArticle(article);
  };

  createArticle = (article) => {
    this.setState({
      articles: this.state.articles.concat(article),
    });
    //TODO update article to database.
    // fetch("/api/timers/start", {
    //   method: "post",
    //   body: JSON.stringify(article),
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // }).then(checkStatus);
  };

  handleEditFormSubmit = (attrs) => {
    this.updateTimer(attrs);
  };

  handleTrashClick = (articleId) => {
    this.deleteArticle(articleId);
  };

  deleteArticle = (articleId) => {
    this.setState({
      articles: this.state.articles.filter(
        (article) => article.id !== articleId
      ),
    });
  };

  render() {
    return (
      <Aux>
        <Row>
          <Col>
            <ApplicationArticleList
              articles={this.state.articles}
              onFormSubmit={this.handleEditFormSubmit}
              onTrashClick={this.handleTrashClick}
            />
            <ToggleableArticleForm onFormSubmit={this.handleCreateFormSubmit} />
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default Application;
