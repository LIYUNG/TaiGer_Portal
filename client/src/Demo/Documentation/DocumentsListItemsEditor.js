import React from 'react';
import EditorNew from '../../components/EditorJs/EditorNew';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../components/DraftEditor.css';
import { Row, Col } from 'react-bootstrap';

function DocumentsListItemsEditor(props) {
  return (
    <Row style={{ textDecoration: 'none' }}>
      <Col className="my-0 mx-0">
        <EditorNew
          category={props.category}
          doc_title={props.doc_title}
          readOnly={false}
          handleClickSave={props.handleClickSave}
          handleClickEditToggle={props.handleClickEditToggle}
          editorState={props.editorState}
        />
      </Col>
    </Row>
  );
}

export default DocumentsListItemsEditor;
