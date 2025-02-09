import React, { useState } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { updateEssayWriter } from '../../../api';
import NoWritersEssaysCard from '../../Dashboard/MainViewTab/NoWritersEssaysCard/NoWritersEssaysCard';

const AssignEssayWritersPage = (props) => {
    const { t } = useTranslation();

    const [assignEditorsState, setAssignEditorsState] = useState({
        error: '',
        editor_list: [],
        isLoaded: false,
        updateEditorList: {},
        success: false,
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0,
        essayDocumentThreads: props.essayDocumentThreads
    });

    const submitUpdateEssayWriterlist = (
        e,
        updateEditorList,
        essayDocumentThread_id
    ) => {
        e.preventDefault();
        UpdateEssayWriterlist(e, updateEditorList, essayDocumentThread_id);
    };

    const UpdateEssayWriterlist = (
        e,
        updateEditorList,
        essayDocumentThread_id
    ) => {
        e.preventDefault();
        updateEssayWriter(updateEditorList, essayDocumentThread_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    var essays_temp = [
                        ...assignEditorsState.essayDocumentThreads
                    ];
                    var essayIdx = essays_temp.findIndex(
                        ({ _id }) => _id === essayDocumentThread_id
                    );
                    essays_temp[essayIdx] = data; // data is single student updated
                    setAssignEditorsState((prevState) => ({
                        ...prevState,
                        isLoaded: true, //false to reload everything
                        essayDocumentThreads: essays_temp,
                        success: success,
                        updateEditorList: [],
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setAssignEditorsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setAssignEditorsState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const ConfirmError = () => {
        setAssignEditorsState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const no_writer_essays = assignEditorsState.essayDocumentThreads
        .filter((thread) => !thread.isFinalVersion)
        .map((essayDocumentThread, i) => (
            <NoWritersEssaysCard
                essayDocumentThread={essayDocumentThread}
                key={i}
                submitUpdateEssayWriterlist={submitUpdateEssayWriterlist}
            />
        ));

    const { res_modal_status, res_modal_message } = assignEditorsState;

    return (
        <Box>
            {res_modal_status >= 400 ? <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                /> : null}
            <Card sx={{ p: 2 }}>
                <Typography variant="h6">{t('No Essay Writer')}</Typography>
                <TableContainer style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>
                                    {t('Documents', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('First-, Last Name', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Email', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Status', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Target Year', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Editors', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Agents', { ns: 'common' })}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{no_writer_essays}</TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}

export default AssignEssayWritersPage;
