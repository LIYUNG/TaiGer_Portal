import React, { useEffect, useState } from 'react';

import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  RichUtils,
  CompositeDecorator,
  AtomicBlockUtils,
  Entity
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../components/DraftEditor.css';
import { uploadImageDraftEditorCallBack, uploadImage } from '../../api';
// import S3 from 'react-aws-s3';
import { uploadFile } from 'react-s3';
// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import { Row, Col, Button, Spinner } from 'react-bootstrap';
// import createImagePlugin from '@draft-js-plugins/image';
// const imagePlugin = createImagePlugin();
window.Buffer = window.Buffer || require('buffer').Buffer;

class MediaComponent extends React.Component {
  render() {
    const { block, contentState } = this.props;
    const { foo } = this.props.blockProps;
    const data = contentState.getEntity(block.getEntityAt(0)).getData();

    const emptyHtml = ' ';
    return (
      <div>
        {emptyHtml}
        <img
          src={data.src}
          alt={data.alt || ''}
          style={{
            height: data.height || 'auto',
            width: data.width || 'auto'
          }}
        />
      </div>
    );
  }
}

function CheckListItemsEditor(props) {
  let [statedata, setStatedata] = useState({
    editorState: null
  });

  useEffect(() => {
    setStatedata((state) => ({
      ...state,
      editorState: props.editorState
    }));
  }, []);

  const handleEditorChange = (newstate) => {
    const contentState = statedata.editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      {}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    // const newEditorState = EditorState.set(this.state.editorState, {
    //   currentContent: contentStateWithEntity
    // });
    // this.setState((state) => ({
    //   ...state,
    //   editorState: AtomicBlockUtils.insertAtomicBlock(
    //     newEditorState,
    //     entityKey,
    //     ''
    //   )
    // }));
    // this.setState((state) => ({ ...state, editorState: newstate }));
    setStatedata((state) => ({
      ...state,
      editorState: newstate
      // editorState: AtomicBlockUtils.insertAtomicBlock(newstate, entityKey, ' ')
    }));
  };

  const handlePastedFiles = (files) => {};
  //DraftJ
  const uploadImageCallBack = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return new Promise((resolve, reject) => {
      uploadImage(formData)
        .then((res) => {
          resolve({ data: { link: res.data.data } });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();

    // Convert image type to mediaComponent
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          foo: 'bar'
        }
      };
    }
  };
  return (
    <>
      <Row style={{ textDecoration: 'none' }}>
        <Col className="my-0 mx-0">
          <Editor
            // toolbarOnFocus
            // toolbarHidden
            spellCheck={true}
            // onFocus={onClick={this.handle}}
            handlePastedFiles={handlePastedFiles}
            // plugins={[imagePlugin]}
            blockRendererFn={myBlockRenderer}
            placeholder={'Write comments'}
            editorState={statedata.editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            toolbar={{
              // options: [
              //   'inline',
              //   'fontSize',
              //   'fontFamily',
              //   'list',
              //   'textAlign',
              //   // "colorPicker",
              //   'link',
              //   'image'
              //   // "file",
              // ],
              link: {
                defaultTargetOption: '_blank',
                popupClassName: 'mail-editor-link'
              },
              image: {
                urlEnabled: true,
                uploadEnabled: true,
                uploadCallback: uploadImageCallBack,
                alignmentEnabled: true,
                defaultSize: {
                  height: 'auto',
                  width: 'auto'
                },
                alt: { present: true.valueOf, mandatory: false },
                inputAccept:
                  'application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel'
              }
            }}
          />
          {/* {JSON.stringify(statedata.editorState)} */}
        </Col>
      </Row>
      <Row>
        <Col className="my-0 mx-4">
          <Button
            onClick={(e) => props.handleClickSave(e, statedata.editorState)}
          >
            Save
          </Button>
          <Button
            onClick={(e) => props.handleClickCancel(e, statedata.editorState)}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default CheckListItemsEditor;
