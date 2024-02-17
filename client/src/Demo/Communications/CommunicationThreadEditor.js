import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EditorSimple from '../../components/EditorJs/EditorSimple';

function CommunicationThreadEditor(props) {
  const { t } = useTranslation();
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
      Please write some text to improve the communication and understanding.
    </Tooltip>
  );

  return (
    <>
      <Box
        sx={{
          py: 4,
          px: 4,
          mb: 1,
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}
      >
        <EditorSimple
          holder={'editorjs'}
          thread={props.thread}
          defaultHeight={0}
          readOnly={false}
          imageEnable={false}
          handleEditorChange={handleEditorChange}
          handleClickSave={props.handleClickSave}
          editorState={props.editorState}
          setStatedata={setStatedata}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        {!statedata.editorState.blocks ||
        statedata.editorState.blocks.length === 0 ||
        props.buttonDisabled ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <span className="d-inline-block">
              <Button
                variant="outlined"
                disabled={true}
                style={{ pointerEvents: 'none' }}
              >
                Send
              </Button>
            </span>
          </OverlayTrigger>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={(e) => props.handleClickSave(e, statedata.editorState)}
          >
            {t('Send')}
          </Button>
        )}
        {props.showCancelButton && (
          <Button
            color="primary"
            variant="outlined"
            onClick={(e) => props.handleClickSave(e, statedata.editorState)}
          >
            {t('Cancel')}
          </Button>
        )}
      </Box>
    </>
  );
}

export default CommunicationThreadEditor;
