import React, { useEffect, useState } from 'react';

import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import {
  convertToRaw,
  convertFromRaw,
  ContentState,
  EditorState,
  convertFromHTML
} from 'draft-js';
// const { contentBlocks, entityMap } = convertFromHTML(
//   this.getInputValue() || ''
// );
// const contentState = ContentState.createFromBlockArray(
//   contentBlocks,
//   entityMap
// );
import { Editor } from 'react-draft-wysiwyg';
// import EditorNew from '../../components/EditorJs/EditorNew';
import EditorSimple from '../../components/EditorJs/EditorSimple';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../components/DraftEditor.css';

// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { updateChecklistDocument, uploadImage } from '../../api';

function DocumentPageEditor(props) {
  let [statedata, setStatedata] = useState({
    editorState: props.editorState
  });

  const handleEditorChange = (content) => {
    setStatedata((state) => ({
      ...state,
      editorState: content
    }));
  };

  return (
    <>
      <Row style={{ textDecoration: 'none' }}>
        <Col className="my-0 mx-0">
          <EditorSimple
            readOnly={false}
            handleEditorChange={handleEditorChange}
            handleClickSave={props.handleClickSave}
            handleClickCancel={props.handleClickCancel}
            editorState={statedata.editorState}
            setStatedata={setStatedata}
          />
        </Col>
      </Row>
    </>
  );
}

export default DocumentPageEditor;