import React from 'react';
import { Button, Tooltip, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EditorNote from '../../components/EditorJs/EditorNote';

const DescriptionEditor = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <Card sx={{ padding: 4, mb: 2, minHeight: 200 }}>
                <EditorNote
                    defaultHeight={0}
                    editorState={props.editorState}
                    handleEditorChange={props.handleEditorChange}
                    holder={`${props.notes_id}`}
                    readOnly={props.readOnly}
                    thread={props.thread}
                />
            </Card>
            {!props.readOnly ? (
                props.buttonDisabled ? (
                    <Tooltip title="Please write some text to improve the communication and understanding.">
                        <span>
                            <Button
                                fullWidth
                                variant="outlined"
                                disabled={true}
                                // style={{ pointerEvents: 'none' }}
                            >
                                {t('Save', { ns: 'common' })}
                            </Button>
                        </span>
                    </Tooltip>
                ) : (
                    <Tooltip title="Please write some text to improve the communication and understanding.">
                        <span>
                            <Button
                                color="primary"
                                fullWidth
                                onClick={(e) =>
                                    props.handleClickSave(e, props.editorState)
                                }
                                variant="contained"
                            >
                                {t('Save', { ns: 'common' })}
                            </Button>
                        </span>
                    </Tooltip>
                )
            ) : null}
        </>
    );
};

export default DescriptionEditor;
