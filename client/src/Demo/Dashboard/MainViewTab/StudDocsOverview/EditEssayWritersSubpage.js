import React, { useEffect, useState } from 'react';
import {
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { getEssayWriters } from '../../../../api';
import { FILE_TYPE_E } from '../../../Utils/checking-functions';

const EditEssayWritersSubpage = (props) => {
    const [checkboxState, setCheckboxState] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        // Initialize the state with checked checkboxes based on the student's editors
        if (
            [FILE_TYPE_E.essay_required].includes(
                props.essayDocumentThread.file_type
            )
        ) {
            getEssayWriters().then(
                (resp) => {
                    // TODO: check success
                    const { data, success } = resp.data;
                    if (success) {
                        const editors = data; //need to change to get all essay writers
                        const { outsourced_user_id: student_essay_writers } =
                            props.essayDocumentThread;
                        const updateEditorList = editors.reduce(
                            (prev, { _id }) => ({
                                ...prev,
                                [_id]: student_essay_writers
                                    ? student_essay_writers.findIndex(
                                          (student_agent) =>
                                              student_agent._id === _id
                                      ) > -1
                                    : false
                            }),
                            {}
                        );
                        setCheckboxState({ editors, updateEditorList });
                        setIsLoaded(true);
                    } else {
                        setIsLoaded(true);
                    }
                },
                () => {
                    setIsLoaded(true);
                }
            );
        } else {
            // Add select editor list
            //  setCheckboxState({ editors, updateEditorList });
            const editors = props.editors; //need to change to get all essay writers
            const { outsourced_user_id: student_editor } =
                props.essayDocumentThread;
            const updateEditorList = editors?.reduce(
                (prev, { _id }) => ({
                    ...prev,
                    [_id]: student_editor
                        ? student_editor.findIndex(
                              (student_agent) => student_agent._id === _id
                          ) > -1
                        : false
                }),
                {}
            );
            setCheckboxState({ editors, updateEditorList });
            setIsLoaded(true);
        }
    }, [props.essayDocumentThread.outsourced_user_id]);

    const handleChangeEditorlist = (e) => {
        const { value } = e.target;
        setCheckboxState((prevState) => ({
            ...prevState,
            updateEditorList: {
                ...prevState.updateEditorList,
                [value]: !prevState.updateEditorList[value]
            }
        }));
    };

    return (
        <Dialog onClose={props.onHide} open={props.show}>
            {isLoaded ? (
                <>
                    <DialogTitle>
                        {props.actor} for {props.essayDocumentThread.file_type}-
                        {props.essayDocumentThread.program_id?.school}-
                        {props.essayDocumentThread.program_id?.program_name}
                        {props.essayDocumentThread.program_id?.degree}
                        {props.essayDocumentThread.program_id?.semester}
                        {props.essayDocumentThread.student_id?.firstname}
                        {props.essayDocumentThread.student_id?.lastname}
                    </DialogTitle>
                    <DialogContent>
                        {t('Essay Writer')}
                        <Table size="small">
                            <TableBody>
                                {checkboxState.editors ? (
                                    checkboxState.editors.map((editor, i) => (
                                        <TableRow key={i + 1}>
                                            <TableCell>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                checkboxState
                                                                    ?.updateEditorList[
                                                                    editor._id
                                                                ] || false
                                                            }
                                                            onChange={(e) =>
                                                                handleChangeEditorlist(
                                                                    e
                                                                )
                                                            }
                                                            value={editor._id}
                                                        />
                                                    }
                                                    label={`${editor.lastname} ${editor.firstname}`}
                                                />
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="h6">
                                                {t('No Essay Writer')}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            disabled={
                                !checkboxState.updateEditorList ||
                                checkboxState.updateEditorList?.length === 0
                            }
                            onClick={(e) =>
                                props.submitUpdateEssayWriterlist(
                                    e,
                                    checkboxState.updateEditorList,
                                    props.essayDocumentThread._id
                                )
                            }
                            variant="contained"
                        >
                            {t('Update', { ns: 'common' })}
                        </Button>
                        <Button onClick={props.onHide} variant="outlined">
                            {t('Cancel', { ns: 'common' })}
                        </Button>
                    </DialogActions>
                </>
            ) : (
                <CircularProgress size={24} />
            )}
        </Dialog>
    );
};
export default EditEssayWritersSubpage;
