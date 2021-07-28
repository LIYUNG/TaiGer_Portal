import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

import Aux from "../../../hoc/_Aux";
import VisaArticleList from "../ArticleList";
import ToggleableArticleForm from "../ToggleableArticleForm";
import { updateDoc, deleteDoc } from "../../../api";

class Certification extends Component {
  state = {
    error: null,
    isLoaded: false,
    articles: [],
    editFormOpen: false,
  };
  componentDidMount() {
    console.log("get article");
    const auth = localStorage.getItem("token");
    fetch(window.Get_Certification_Article, {
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
            isLoaded: true,
          });
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

  createArticle = (article) => {
    console.log("click create new article");
    console.log(article);
    let article_temp = {};
    Object.assign(article_temp, {
      Titel_: article.Titel_,
      Content_: article.Content_,
      Category_: article.Category_,
      LastUpdate_: article.LastUpdate_,
    });
    // delete article_temp._id;
    // console.log("article_temp : " + JSON.stringify(article_temp));
    const auth = localStorage.getItem("token");
    fetch(window.New_Article, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
      body: JSON.stringify(article_temp),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(JSON.stringify(result.documents));
          this.setState({
            articles: this.state.articles.concat(result.documents),
          });
          console.log(this.state.articles);
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
    //update article
    console.log("click update article");
    console.log(attrs);
    let article_temp = {};
    Object.assign(article_temp, {
      //remove _id
      Titel_: attrs.Titel_,
      Content_: attrs.Content_,
      Category_: attrs.Category_,
      LastUpdate_: attrs.LastUpdate_,
    });
    const auth = localStorage.getItem("token");
    console.log(article_temp);

    updateDoc(attrs._id, article_temp)
      .then(
        (result) => {},
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

    console.log("click submit article");
    console.log(articleId);
    deleteDoc(articleId)
      .then(
        (result) => {},
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

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
              <VisaArticleList
                articles={this.state.articles}
                category="certification"
                onFormSubmit={this.handleEditFormSubmit}
                onTrashClick={this.handleTrashClick}
              />
              <ToggleableArticleForm
                category="certification"
                onFormSubmit={this.handleCreateFormSubmit}
              />
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default Certification;
