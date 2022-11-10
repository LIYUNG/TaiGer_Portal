import React, { useEffect, useState } from 'react';
import EditorNew from '../../components/EditorJs/EditorNew';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../components/DraftEditor.css';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { updateChecklistDocument, uploadImage } from '../../api';

function DocumentsListItemsEditor(props) {
  return (
    <>
      <Row style={{ textDecoration: 'none' }}>
        <Col className="my-0 mx-0">
          <EditorNew
            category={props.category}
            doc_title={props.doc_title}
            readOnly={false}
            handleClickSave={props.handleClickSave}
            handleClickCancel={props.handleClickCancel}
            editorState={props.editorState}
          />
        </Col>
      </Row>
      {/* <Row>
        <Col className="my-0 mx-4">
          <Button
            onClick={(e) => props.handleClickSave(e, statedata.editorState)}
          >
            Save
          </Button>
          <Button onClick={(e) => props.handleClickCancel(e)}>Cancel</Button>
        </Col>
      </Row> */}
    </>
  );
}

export default DocumentsListItemsEditor;
