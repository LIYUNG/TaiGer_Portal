import React from 'react';
import { Button, Tooltip, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';

import EditorNote from '../../components/EditorJs/EditorNote';

const NotesEditor = ({
    editorState,
    handleEditorChange,
    notes_id,
    readOnly,
    thread,
    buttonDisabled,
    handleClickSave
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Card sx={{ padding: 4, mb: 2, minHeight: 200 }}>
                <EditorNote
                    defaultHeight={0}
                    editorState={editorState}
                    handleEditorChange={handleEditorChange}
                    holder={`${notes_id}`}
                    readOnly={readOnly}
                    thread={thread}
                />
            </Card>
            {!readOnly ? (
                buttonDisabled ? (
                    <Tooltip title="Please write some text to improve the communication and understanding.">
                        <span>
                            <Button
                                disabled={true}
                                fullWidth
                                variant="outlined"
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
                                onClick={(e) => handleClickSave(e, editorState)}
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

export default NotesEditor;
