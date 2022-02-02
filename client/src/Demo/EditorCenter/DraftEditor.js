import React, { useState, useEffect } from "react";
import {
  convertFromHTML,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from "draft-js";
import DraftPasteProcessor from "draft-js/lib/DraftPasteProcessor";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./DraftEditor.css";
import {
  Row,
  Col,
  Button,
  Card,
  Collapse,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
// See: https://blog.logrocket.com/building-rich-text-editors-in-react-using-draft-js-and-react-draft-wysiwyg/
const DraftEditor = (props) => {
  var userData;
//   try {
//     // Parse a JSON
//     userData = JSON.parse(
//       EditorState.createWithContent(
//         convertFromRaw(JSON.parse(JSON.stringify(props.defaultComments)))
//       )
//     );
//   } catch (e) {
//     // You can read e for more info
//     // Let's assume the error is that we already have parsed the payload
//     // So just return that
//     userData = EditorState.createWithContent(
//       convertFromRaw(JSON.parse(JSON.stringify(props.defaultComments)))
//     );
//   }

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()

    // EditorState.createWithContent(
    //   convertFromRaw(JSON.parse(props.defaultComments))
    // )
  );
  //   useEffect(() => {
  //     setEditorState(
  //       EditorState.createWithContent(
  //         convertFromRaw(
  //           JSON.parse(props.defaultComments ? props.defaultComments : {})
  //         )
  //       )
  //     );
  //   }, [props.defaultComments]);
  const [convertedContent, setConvertedContent] = useState(null);
  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };
  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  return (
    <Modal
      size="xl"
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.docName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <header className="App-header">Rich Text Editor Example</header> */}
        <Editor
          //   readOnly={true}
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
        />

        <h5>{props.defaultComments}</h5>
        {/* <div
        className="preview"
        dangerouslySetInnerHTML={createMarkup(props.defaultComments)}
      ></div> */}
        {/* {convertedContent} */}
        {/* <Form.Group controlId="rejectmessage">
              <Form.Label>
                Here is editor Feedback for {this.state.docName}.
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={30}
                placeholder="ex. typo."
                defaultValue={this.state.comments}
                onChange={(e) => this.handleCommentsMessage(e, e.target.value)}
              />
            </Form.Group> */}
      </Modal.Body>
      <Modal.Footer>
        {props.filetype === "General" ? (
          <Button
            // disabled={!isLoaded}
            onClick={() =>
              props.onClick1(
                JSON.stringify(convertToRaw(editorState.getCurrentContent()))
              )
            }
          >
            Yes
          </Button>
        ) : (
          <Button
            // disabled={!isLoaded}
            onClick={() =>
              props.onClick2(
                JSON.stringify(convertToRaw(editorState.getCurrentContent()))
              )
            }
          >
            Yes
          </Button>
        )}

        <Button onClick={() => props.onClick3()}>No</Button>
        {/* {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )} */}
      </Modal.Footer>
    </Modal>
  );
};
export default DraftEditor;
