import React, { Component } from "react";
import EditableApplicationArticle from "./EditableApplicationArticle";

class ApplicationArticleList extends Component {
  // TODO: replace by database


  render() {
    const articles = this.props.articles.map((article) => (
      <EditableApplicationArticle
        key={article._id}
        id={article._id}
        title={article.Titel_}
        content={article.Content_}
        lastupdate={article.LastUpdate_}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
      />
    ));
    return <div>{articles}</div>;
  }
}

export default ApplicationArticleList;
