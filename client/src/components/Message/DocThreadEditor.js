import React, { useEffect, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { is_TaiGer_role } from '@taiger-common/core';
import {
    Button,
    Grid,
    Card,
    TextField,
    Tooltip,
    Typography,
    Box
} from '@mui/material';
import i18next from 'i18next';

import { CVMLRL_DOC_PRECHECK_STATUS_E } from '../../utils/contants';
import { useAuth } from '../AuthProvider';
import EditorSimple from '../EditorJs/EditorSimple';

const DocThreadEditor = ({
    editorState,
    thread,
    file,
    buttonDisabled,
    handleClickSave,
    checkResult,
    onFileChange
}) => {
    const { user } = useAuth();
    let [statedata, setStatedata] = useState({
        editorState: editorState
    });
    useEffect(() => {
        setStatedata((state) => ({
            ...state,
            editorState: editorState
        }));
    }, [editorState]);

    const handleEditorChange = (content) => {
        setStatedata((state) => ({
            ...state,
            editorState: content
        }));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card sx={{ px: 4, pt: 2, minHeight: 200 }}>
                    <EditorSimple
                        defaultHeight={0}
                        editorState={editorState}
                        handleEditorChange={handleEditorChange}
                        holder="editorjs"
                        imageEnable={true}
                        readOnly={false}
                        setStatedata={setStatedata}
                        thread={thread}
                    />
                </Card>
            </Grid>
            {/* TODO: show checking result: 
        1. contain student name for each file, 
        2. CV: no gap
         */}
            {is_TaiGer_role(user) ? (
                <Grid item xs={12}>
                    {file?.map((fl, i) => (
                        <Box key={`${fl.name}${i}`}>
                            <Typography>{fl.name} :</Typography>
                            {checkResult?.length
                                ? Object.keys(checkResult[i]).map((ky) => (
                                      <Typography
                                          key={checkResult[i][ky].text}
                                          sx={{ ml: 2 }}
                                      >
                                          {checkResult[i][ky].value ===
                                          undefined
                                              ? CVMLRL_DOC_PRECHECK_STATUS_E.WARNING_SYMBOK
                                              : checkResult[i][ky].value
                                                ? CVMLRL_DOC_PRECHECK_STATUS_E.OK_SYMBOL
                                                : CVMLRL_DOC_PRECHECK_STATUS_E.NOT_OK_SYMBOL}
                                          {checkResult[i][ky].text}
                                          {checkResult[i][ky].hasMetadata
                                              ? checkResult[i][ky].metaData
                                              : null}
                                      </Typography>
                                  ))
                                : null}
                        </Box>
                    ))}
                </Grid>
            ) : null}

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    inputProps={{
                        multiple: true
                    }}
                    onChange={(e) => onFileChange(e)}
                    size="small"
                    type="file"
                />
            </Grid>

            <Grid item xs={12}>
                (Choose max. 3 files with different extensions: .pdf, .docx,
                .jgp, and overall 2MB!)
            </Grid>
            <Grid item xs={12}>
                {!statedata.editorState.blocks ||
                statedata.editorState.blocks.length === 0 ||
                buttonDisabled ? (
                    <Tooltip
                        placement="top"
                        title={i18next.t(
                            'Please write some text to improve the communication and understanding.'
                        )}
                    >
                        <Button
                            color="secondary"
                            startIcon={<SendIcon />}
                            variant="outlined"
                        >
                            {i18next.t('Send', { ns: 'common' })}
                        </Button>
                    </Tooltip>
                ) : (
                    <Button
                        color="primary"
                        onClick={(e) =>
                            handleClickSave(e, statedata.editorState)
                        }
                        startIcon={<SendIcon />}
                        variant="contained"
                    >
                        {i18next.t('Send', { ns: 'common' })}
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

export default DocThreadEditor;
