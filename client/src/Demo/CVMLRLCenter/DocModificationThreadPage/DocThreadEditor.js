import React, { useEffect, useState } from 'react';
import EditorSimple from '../../../components/EditorJs/EditorSimple';
import {
  Row,
  Col,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
  Card
} from 'react-bootstrap';

function DocThreadEditor(props) {
  const [show, setShow] = useState(false);
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

  const renderTooltip = (props) => (
    <Tooltip id="tooltip-disabled" {...props}>
      Please write some text to improve the communication and
      understanding.
    </Tooltip>
  );

  return (
    <>
      <Row style={{ textDecoration: 'none' }}>
        <Col className="my-0 mx-0">
          <Card border="dark">
            <Card.Body border="dark">
              <EditorSimple
                holder={'editorjs'}
                thread={props.thread}
                defaultHeight={0}
                readOnly={false}
                handleEditorChange={handleEditorChange}
                handleClickSave={props.handleClickSave}
                editorState={props.editorState}
                setStatedata={setStatedata}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Form.Group controlId="formFile" className="mb-2">
            <Form.Control type="file" multiple onChange={(e) => props.onFileChange(e)} />
          </Form.Group>
        </Col>
        <Col className="mt-2" md={4}>
          (Choose max. 3 files with different extensions: .pdf, .docx, .jgp, and overall 2MB!)
        </Col>
      </Row>
      <Row>
        <Col className="my-0 mx-0">
          {!statedata.editorState.blocks ||
          statedata.editorState.blocks.length === 0 ||
          props.buttonDisabled ? (
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <span className="d-inline-block">
                <Button disabled={true} style={{ pointerEvents: 'none' }}>
                  Save
                </Button>
              </span>
            </OverlayTrigger>
          ) : (
            <Button
              onClick={(e) => props.handleClickSave(e, statedata.editorState)}
            >
              Save
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}

export default DocThreadEditor;
