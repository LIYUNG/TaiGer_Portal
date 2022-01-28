import React, { Component } from "react";
import { Row, Col, Spinner } from "react-bootstrap";

import Aux from "../../../hoc/_Aux";
import VisaArticleList from "../ArticleList";
import ToggleableArticleForm from "../ToggleableArticleForm";
import {
  updateDoc,
  deleteDoc,
  createArticle,
  getVisaArticle,
} from "../../../api";

class Visa extends Component {
  state = {
    error: null,
    isLoaded: false,
    articles: [],
    editFormOpen: false,
    role: "Guest",
  };
  componentDidMount() {
    getVisaArticle().then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            articles: data,
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
    console.log(article_temp);

    updateDoc(attrs._id, article_temp).then(
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
          <Col>
            <VisaArticleList
              articles={this.state.articles}
              category="visa"
              onFormSubmit={this.handleEditFormSubmit}
              onTrashClick={this.handleTrashClick}
              role={this.state.role}
            />
            {this.props.user.role === "Admin" ||
            this.props.user.role === "Agent" ? (
              <ToggleableArticleForm
                category="visa"
                onFormSubmit={this.handleCreateFormSubmit}
              />
            ) : (
              <></>
            )}
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
  }
}

export default Visa;
