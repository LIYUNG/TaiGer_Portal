import React, { useEffect, useState } from 'react';
import EditorSimple from '../../../components/EditorJs/EditorSimple';
import { Row, Col, Button, Form } from 'react-bootstrap';

function DocThreadEditor(props) {
  let [statedata, setStatedata] = useState({
    editorState: props.editorState
  });

  //   useEffect(() => {
  //     setStatedata({
  //       editorState: props.editorState
  //     });
  //   }, [props.editorState]);

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
          <Form className="my-2 mx-2">
            <Form.File.Label
              // key={this.state.file || ""}
              onClick={(e) => (e.target.value = props.file || '')}
            >
              <Form.File.Input onChange={(e) => props.onFileChange(e)} />
              {/* <IoMdCloudUpload size={32} /> */}
            </Form.File.Label>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col className="my-0 mx-0">
          <Button
            // disabled={props.isLoaded} TODO: design, disable when sending data
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
