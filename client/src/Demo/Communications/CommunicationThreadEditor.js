import React, { useCallback, useEffect, useState } from 'react';
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
import {
    is_TaiGer_Agent,
    is_TaiGer_Student,
    is_TaiGer_role
} from '@taiger-common/core';
import { useParams } from 'react-router-dom';

import EditorSimple from '../../components/EditorJs/EditorSimple';
import { useAuth } from '../../components/AuthProvider';
import {
    CVMLRL_DOC_PRECHECK_STATUS_E,
    stringAvatar
} from '../../utils/contants';
import { TaiGerChatAssistant } from '../../api';
import { appConfig } from '../../config';

const CommunicationThreadEditor = (props) => {
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
            data: prevState.data,
            isGenerating: false
        }));
    };

    const EditorV2 = useCallback(() => {
        return (
            <EditorSimple
                defaultHeight={0}
                editorState={props.editorState}
                handleClickSave={props.handleClickSave}
                handleEditorChange={handleEditorChange}
                holder={props.editorState?.toString()}
                imageEnable={false}
                readOnly={false}
                setStatedata={setStatedata}
                thread={props.thread}
            />
        );
    }, [props.count]);
    return (
        <>
            <Box
                style={{
                    my: 1,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Avatar
                    {...stringAvatar(`${user.firstname} ${user.lastname}`)}
                />
                <Typography variant="body1">
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
                <EditorV2 />
            </Box>
            <Box>
                {is_TaiGer_role(user)
                    ? props.files?.map((fl, i) => (
                          <Box
                              key={`${fl.name}${i}`}
                              sx={{
                                  wordBreak: 'break-word', // Breaks the word to avoid overflow
                                  overflowWrap: 'break-word' // Add this line
                              }}
                          >
                              <Typography variant="body1">
                                  {fl.name} :
                              </Typography>
                              {props.checkResult?.length
                                  ? Object.keys(props.checkResult[i]).map(
                                        (ky) => (
                                            <Typography
                                                key={
                                                    props.checkResult[i][ky]
                                                        .text
                                                }
                                                sx={{ ml: 2 }}
                                            >
                                                {props.checkResult[i][ky]
                                                    .value === undefined
                                                    ? CVMLRL_DOC_PRECHECK_STATUS_E.WARNING_SYMBOK
                                                    : props.checkResult[i][ky]
                                                            .value
                                                      ? CVMLRL_DOC_PRECHECK_STATUS_E.OK_SYMBOL
                                                      : CVMLRL_DOC_PRECHECK_STATUS_E.NOT_OK_SYMBOL}
                                                {props.checkResult[i][ky].text}
                                                {props.checkResult[i][ky]
                                                    .hasMetadata
                                                    ? props.checkResult[i][ky]
                                                          .metaData
                                                    : null}
                                            </Typography>
                                        )
                                    )
                                  : null}
                          </Box>
                      ))
                    : null}
                {is_TaiGer_Student(user)
                    ? props.files?.map((fl, i) => (
                          <Box key={`${fl.name}${i}`}>
                              <Typography
                                  sx={{
                                      overflowWrap: 'break-word' // Add this line
                                  }}
                                  variant="body1"
                              >
                                  {fl.name}
                              </Typography>
                          </Box>
                      ))
                    : null}
            </Box>
            <Box sx={{ mb: 2 }}>
                {!statedata.editorState.blocks ||
                statedata.editorState.blocks.length === 0 ||
                props.buttonDisabled ? (
                    <Tooltip
                        placement="top"
                        title={t(
                            'Please write some text to improve the communication and understanding.'
                        )}
                    >
                        <Button
                            color="primary"
                            startIcon={<SendIcon />}
                            variant="outlined"
                        >
                            {t('Send', { ns: 'common' })}
                        </Button>
                    </Tooltip>
                ) : (
                    <Button
                        color="primary"
                        onClick={(e) =>
                            props.handleClickSave(e, statedata.editorState)
                        }
                        startIcon={<SendIcon />}
                        variant="contained"
                    >
                        {t('Send', { ns: 'common' })}
                    </Button>
                )}
                {props.showCancelButton ? (
                    <Button
                        color="primary"
                        onClick={(e) =>
                            props.handleClickSave(e, statedata.editorState)
                        }
                        variant="outlined"
                    >
                        {t('Cancel', { ns: 'common' })}
                    </Button>
                ) : null}
                <Tooltip placement="top" title={t('Attach files')}>
                    <span>
                        <input
                            id="file-input"
                            multiple
                            onChange={(e) => props.onFileChange(e)}
                            style={{ display: 'none' }}
                            type="file"
                        />
                        <IconButton
                            aria-label="attach file"
                            color="primary"
                            component="span"
                            onClick={handleClick}
                        >
                            <AttachFileIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                {appConfig.AIEnable && is_TaiGer_role(user) ? (
                    <IconButton
                        disabled={statedata.isGenerating}
                        onClick={onSubmit}
                    >
                        {statedata.isGenerating ? (
                            <CircularProgress size={24} />
                        ) : (
                            <AutoFixHighIcon />
                        )}
                    </IconButton>
                ) : null}
                {is_TaiGer_Agent(user) ? (
                    <Typography variant="body1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {statedata.data}
                        </ReactMarkdown>
                    </Typography>
                ) : null}
            </Box>
        </>
    );
};

export default CommunicationThreadEditor;
