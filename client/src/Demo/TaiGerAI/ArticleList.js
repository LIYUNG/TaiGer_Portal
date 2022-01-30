import React, { Component } from "react";
import EditableArticle from "./EditableArticle";

class ArticleList extends Component {

  render() {
    const articles = this.props.articles.map((article) => (
      <EditableArticle
        key={article._id}
        id={article._id}
        title={article.Titel_}
        content={article.Content_}
        lastupdate={article.LastUpdate_}
        category={this.props.category}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
      />
    ));
    return <div>{articles}</div>;
  }
}

export default ArticleList;
