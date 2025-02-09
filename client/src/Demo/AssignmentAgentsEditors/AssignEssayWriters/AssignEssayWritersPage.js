import React, { useCallback, useMemo, useState } from 'react';
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
import i18next from 'i18next';

const EssaysTable = ({ noWriterEssays }) => (
    <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>
                        {i18next.t('Documents', { ns: 'common' })}
                    </TableCell>
                    <TableCell>
                        {i18next.t('First-, Last Name', { ns: 'common' })}
                    </TableCell>
                    <TableCell>
                        {i18next.t('Email', { ns: 'common' })}
                    </TableCell>
                    <TableCell>
                        {i18next.t('Status', { ns: 'common' })}
                    </TableCell>
                    <TableCell>
                        {i18next.t('Target Year', { ns: 'common' })}
                    </TableCell>
                    <TableCell>
                        {i18next.t('Editors', { ns: 'common' })}
                    </TableCell>
                    <TableCell>
                        {i18next.t('Agents', { ns: 'common' })}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>{noWriterEssays}</TableBody>
        </Table>
    </TableContainer>
);

const AssignEssayWritersPage = ({ essayDocumentThreads }) => {
    const { t } = useTranslation();

    const [state, setState] = useState({
        error: '',
        isLoaded: false,
        success: false,
        res_modal_message: '',
        res_modal_status: 0,
        essayDocumentThreads
    });

    const updateEssayWriterList = useCallback(
        async (updateEditorList, essayDocumentThread_id) => {
            try {
                const resp = await updateEssayWriter(
                    updateEditorList,
                    essayDocumentThread_id
                );
                const { data, success } = resp.data;
                const { status } = resp;

                setState((prevState) => {
                    if (success) {
                        const updatedThreads =
                            prevState.essayDocumentThreads.map((thread) =>
                                thread._id === essayDocumentThread_id
                                    ? data
                                    : thread
                            );
                        return {
                            ...prevState,
                            isLoaded: true,
                            essayDocumentThreads: updatedThreads,
                            success,
                            res_modal_status: status
                        };
                    } else {
                        return {
                            ...prevState,
                            isLoaded: true,
                            res_modal_message: resp.data.message,
                            res_modal_status: status
                        };
                    }
                });
            } catch (error) {
                setState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        },
        []
    );

    const handleSubmit = useCallback(
        (e, updateEditorList, essayDocumentThread_id) => {
            e.preventDefault();
            updateEssayWriterList(updateEditorList, essayDocumentThread_id);
        },
        [updateEssayWriterList]
    );

    const ConfirmError = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    }, []);

    const noWriterEssays = useMemo(() => {
        return state.essayDocumentThreads
            .filter((thread) => !thread.isFinalVersion)
            .map((essayDocumentThread) => (
                <NoWritersEssaysCard
                    essayDocumentThread={essayDocumentThread}
                    key={essayDocumentThread._id}
                    submitUpdateEssayWriterlist={handleSubmit}
                />
            ));
    }, [state.essayDocumentThreads, handleSubmit]);

    return (
        <Box>
            {state.res_modal_status >= 400 && (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={state.res_modal_message}
                    res_modal_status={state.res_modal_status}
                />
            )}
            <Card sx={{ p: 2 }}>
                <Typography variant="h6">{t('No Essay Writer')}</Typography>
                <EssaysTable noWriterEssays={noWriterEssays} />
            </Card>
        </Box>
    );
};

export default AssignEssayWritersPage;
