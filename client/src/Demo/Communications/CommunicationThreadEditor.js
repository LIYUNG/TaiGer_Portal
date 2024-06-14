import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import EditorSimple from '../../components/EditorJs/EditorSimple';
import { useAuth } from '../../components/AuthProvider';
import { CVMLRL_DOC_PRECHECK_STATUS_E, stringAvatar } from '../Utils/contants';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student,
  is_TaiGer_role
} from '../Utils/checking-functions';
import { TaiGerChatAssistant } from '../../api';
import { useParams } from 'react-router-dom';
// import { VisuallyHiddenInput } from '../../components/Input';

function CommunicationThreadEditor(props) {
  const { t } = useTranslation();
  const { student_id } = useParams();

  const { user } = useAuth();
  let [statedata, setStatedata] = useState({
    editorState: props.editorState,
    data: ''
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

  const handleClick = () => {
    document.getElementById('file-input').click();
  };

  const onSubmit = async () => {
    setStatedata((prevState) => ({
      ...prevState,
      isGenerating: true
    }));
    const response = await TaiGerChatAssistant('abc', student_id);
    // Handle the streaming data
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      setStatedata((prevState) => ({
        ...prevState,
        data: prevState.data + value
      }));
    }
    setStatedata((prevState) => ({
      ...prevState,
      isLoaded: true,
      data: prevState.data + ' \n ================================= \n',
      isGenerating: false
    }));
  };
  return (
    <>
      <Box
        style={{
          my: 1,
          display: 'flex'
        }}
      >
        <Avatar {...stringAvatar(`${user.firstname} ${user.lastname}`)} />
        <Typography>
          {user.firstname} {user.lastname}
        </Typography>
      </Box>
      <Box
        sx={{
          py: 4,
          px: 4,
          my: 1,
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
      <Box>
        {is_TaiGer_role(user) &&
          props.files?.map((fl, i) => (
            <Box key={`${fl.name}${i}`}>
              <Typography>{fl.name} :</Typography>
              {props.checkResult?.length &&
                Object.keys(props.checkResult[i]).map((ky) => (
                  <Typography
                    key={props.checkResult[i][ky].text}
                    sx={{ ml: 2 }}
                  >
                    {props.checkResult[i][ky].value === undefined
                      ? CVMLRL_DOC_PRECHECK_STATUS_E.WARNING_SYMBOK
                      : props.checkResult[i][ky].value
                      ? CVMLRL_DOC_PRECHECK_STATUS_E.OK_SYMBOL
                      : CVMLRL_DOC_PRECHECK_STATUS_E.NOT_OK_SYMBOL}
                    {props.checkResult[i][ky].text}
                    {props.checkResult[i][ky].hasMetadata &&
                      props.checkResult[i][ky].metaData}
                  </Typography>
                ))}
            </Box>
          ))}
        {is_TaiGer_Student(user) &&
          props.files?.map((fl, i) => (
            <Box key={`${fl.name}${i}`}>
              <Typography>{fl.name}</Typography>
            </Box>
          ))}
      </Box>
      <Box sx={{ mb: 2 }}>
        {!statedata.editorState.blocks ||
        statedata.editorState.blocks.length === 0 ||
        props.buttonDisabled ? (
          <>
            <Tooltip
              title={t(
                'Please write some text to improve the communication and understanding.'
              )}
              placement="top"
            >
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<SendIcon />}
              >
                {t('Send', { ns: 'common' })}
              </Button>
            </Tooltip>
          </>
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
              {t('Send', { ns: 'common' })}
            </Button>
          </Tooltip>
        )}
        {props.showCancelButton && (
          <Button
            color="primary"
            variant="outlined"
            onClick={(e) => props.handleClickSave(e, statedata.editorState)}
          >
            {t('Cancel', { ns: 'common' })}
          </Button>
        )}
        <Tooltip title={t('Attach files')} placement="top">
          <input
            id="file-input"
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => props.onFileChange(e)}
          />
          <IconButton
            color="primary"
            aria-label="attach file"
            component="span"
            onClick={handleClick}
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        {is_TaiGer_role(user) && (
          <IconButton
            disabled={
              user._id.toString() !== '639baebf8b84944b872cf648' ||
              statedata.isGenerating
            }
            onClick={onSubmit}
          >
            {statedata.isGenerating ? (
              <CircularProgress size={24} />
            ) : (
              <AutoFixHighIcon />
            )}
          </IconButton>
        )}
        {is_TaiGer_Agent(user) && (
          <Typography variant="p">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {statedata.data}
            </ReactMarkdown>
          </Typography>
        )}
      </Box>
    </>
  );
}

export default CommunicationThreadEditor;
