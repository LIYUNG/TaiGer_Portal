import React, { useEffect, useState } from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
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
          <Tooltip
            title={t(
              'Please write some text to improve the communication and understanding.'
            )}
            placement="top"
          >
            <Button
              variant="outlined"
              color='secondary'
              // disabled={true}
              // style={{ pointerEvents: 'none' }}
              startIcon={<SendIcon />}
            >
              Send
            </Button>
          </Tooltip>
        ) : (
          <Tooltip
            title={t(
              'Please write some text to improve the communication and understanding.'
            )}
            placement="top"
          >
            <Button
              color="primary"
              variant="contained"
              startIcon={<SendIcon />}
              onClick={(e) => props.handleClickSave(e, statedata.editorState)}
            >
              {t('Send')}
            </Button>
          </Tooltip>
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
