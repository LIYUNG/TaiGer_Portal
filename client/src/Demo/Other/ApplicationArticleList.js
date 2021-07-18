import React, { Component } from "react";
import ApplicationArticle from "./ApplicationArticle";

class ApplicationArticleList extends Component {
  // TODO: replace by database


  render() {
    const articles = this.props.articles.map((article) => (
      <ApplicationArticle
        key={article.id}
        id={article.id}
        title={article.Titel_}
        content={article.Content_}
      />
    ));
    return <div>{articles}</div>;
  }
}

export default ApplicationArticleList;
