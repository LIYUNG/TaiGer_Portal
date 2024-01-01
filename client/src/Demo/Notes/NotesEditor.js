import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
  Card
} from 'react-bootstrap';

import EditorSimple from '../../components/EditorJs/EditorSimple';

function NotesEditor(props) {
  let [statedata, setStatedata] = useState({
    editorState: props.editorState,
    buttonDisabled: true
  });
  useEffect(() => {
    setStatedata((state) => ({
      ...state,
      editorState: props.editorState,
    }));
  }, [props.editorState]);
  const handleEditorChange = (content) => {
    setStatedata((state) => ({
      ...state,
      editorState: content,
      buttonDisabled: false
    }));
  };

  const renderTooltip = (props) => (
    <Tooltip id="tooltip-disabled" {...props}>
      Please write some text to improve the communication and understanding.
    </Tooltip>
  );
  const handleClickSave = (e, editorState) => {
    setStatedata((state) => ({
      ...state,
      buttonDisabled: true
    }));
    props.handleClickSave(e, editorState);
  };

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
                editorState={props.editorState}
                setStatedata={setStatedata}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="my-0 mx-0">
          {!statedata.editorState.blocks ||
          statedata.editorState.blocks.length === 0 ||
          statedata.buttonDisabled ||
          props.buttonDisabled ? (
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <span className="d-inline-block">
                <Button
                  size="sm"
                  disabled={true}
                  style={{ pointerEvents: 'none' }}
                >
                  Save
                </Button>
              </span>
            </OverlayTrigger>
          ) : (
            <Button
              size="sm"
              onClick={(e) => handleClickSave(e, statedata.editorState)}
            >
              Save
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}

export default NotesEditor;
