import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

import Aux from "../../hoc/_Aux";
import ApplicationArticleList from "./ApplicationArticleList";
import ToggleableArticleForm from "./ToggleableArticleForm";

class Application extends Component {
  state = {
    articles: [],
    editFormOpen: false,
  };
  componentDidMount() {
    // TODO: fetch articles from server to this.state.articles
    // this.setState({ file: "" });
    console.log("get article");
    const auth = localStorage.getItem("token");
    fetch(window.Get_Article, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
            console.log(JSON.stringify(result.documents));
          this.setState({
            articles: result.documents,
          });
        },
        (error) => {}
      );
      
  }

  handleCreateFormSubmit = (article) => {
    this.createArticle(article);
  };

  createArticle = (article) => {
    this.setState({
      articles: this.state.articles.concat(article),
    });
    //TODO update article to database.
    console.log("click submit article");
    console.log(article);
    const auth = localStorage.getItem("token");
    fetch(window.New_Article, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
      body: JSON.stringify(article),
    })
      .then((res) => res.json())
      .then((error) => {});
    // fetch(window.New_Article, {
    //   method: "POST",
    //   body: JSON.stringify(article),
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // });
    // .then(checkStatus);
  };

  handleEditFormSubmit = (update_article) => {
    this.updateArticle(update_article);
  };

  updateArticle = (attrs) => {
    this.setState({
      articles: this.state.articles.map((article) => {
        if (article.id === attrs.id) {
          return Object.assign({}, article, {
            Titel_: attrs.Titel_,
            Content_: attrs.Content_,
          });
        } else {
          return article;
        }
      }),
    });
    //update article
    // client.updateTimer(attrs);
    console.log("click update article");
    console.log(attrs);
    const auth = localStorage.getItem("token");
    fetch(window.Update_Article, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
      body: JSON.stringify(attrs),
    })
      .then((res) => res.json())
      .then((error) => {});
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

    console.log("click submit article");
    console.log(articleId);
    const auth = localStorage.getItem("token");
    fetch(window.New_Article + "/" + articleId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      .then((res) => res.json())
      .then((error) => {});
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
