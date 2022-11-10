import React from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';

class DocPageEdit extends React.Component {
  state = {
    doc_title: this.props.document_title
  };
  componentDidMount() {
    this.setState({ doc_title: this.props.document_title });
  }
  handleChange = (e) => {
    e.preventDefault();
    var doc_title_temp = { ...this.state.doc_title };
    doc_title_temp = e.target.value;
    this.setState((state) => ({
      ...state,
      doc_title: doc_title_temp
    }));
  };

  handleClickSave = (e, editorState) => {
    e.preventDefault();
    this.props.handleClickSave(e, this.state.doc_title, editorState);
  };
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <DocumentsListItemsEditor
              doc_title={'not_used'}
              editorState={this.props.editorState}
              handleClickSave={this.handleClickSave}
              handleClickCancel={this.props.handleClickCancel}
              role={this.props.role}
            />
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default DocPageEdit;
