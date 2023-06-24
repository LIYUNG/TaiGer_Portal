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
    buttonDisabled: props.buttonDisabled
  });
  useEffect(() => {
    setStatedata((state) => ({
      ...state,
      editorState: props.editorState,
      buttonDisabled: props.buttonDisabled
    }));
  }, [props.editorState, props.buttonDisabled]);
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
          statedata.buttonDisabled ? (
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

export default NotesEditor;
