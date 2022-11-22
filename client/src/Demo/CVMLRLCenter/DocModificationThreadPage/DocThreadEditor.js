import React, { useEffect, useState } from 'react';
import EditorSimple from '../../../components/EditorJs/EditorSimple';
import { Row, Col, Button, Form } from 'react-bootstrap';

function DocThreadEditor(props) {
  let [statedata, setStatedata] = useState({
    editorState: props.editorState
  });
  useEffect(() => {
    setStatedata((state) => ({
      ...state,
      editorState: props.editorState
    }));
  }, [props.editorState]);
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
            holder={'editorjs'}
            thread={props.thread}
            readOnly={false}
            handleEditorChange={handleEditorChange}
            handleClickSave={props.handleClickSave}
            handleClickCancel={props.handleClickCancel}
            editorState={props.editorState}
            setStatedata={setStatedata}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="formFile" className='mb-2'>
            <Form.Control
              type="file"
              onChange={(e) => props.onFileChange(e)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="my-0 mx-0">
          <Button
            disabled={
              !statedata.editorState.blocks ||
              statedata.editorState.blocks.length === 0 ||
              props.buttonDisabled
            } // TODO: design
            onClick={(e) => props.handleClickSave(e, statedata.editorState)}
          >
            Save
          </Button>
          <Button onClick={(e) => props.handleClickCancel(e)}>Cancel</Button>
        </Col>
      </Row>
    </>
  );
}

export default DocThreadEditor;
