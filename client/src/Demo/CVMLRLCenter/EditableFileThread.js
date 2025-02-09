import React from 'react';
import {
    Grid,
    Link,
    Typography,
    IconButton,
    Tooltip,
    Stack,
    Box
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role } from '@taiger-common/core';

import { latestReplyInfo } from '../Utils/checking-functions';
import {
    FILE_OK_SYMBOL,
    FILE_MISSING_SYMBOL,
    convertDate
} from '../../utils/contants';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';

const EditableFileThread = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const handleAsFinalFileThread = (documenName, isFinal) => {
        props.handleAsFinalFile(
            props.thread.doc_thread_id._id,
            props.student._id,
            props.program_id,
            isFinal,
            documenName
        );
    };

    const handleDeleteFileThread = (documenName) => {
        props.onDeleteFileThread(
            props.thread.doc_thread_id._id,
            props.application,
            props.student._id,
            documenName
        );
    };

    let fileStatus;
    let documenName;
    if (props.application) {
        documenName = props.thread.doc_thread_id?.file_type;
        // program_deadline = props.application.programId.application_deadline
    } else {
        documenName = 'General' + ' - ' + props.thread.doc_thread_id?.file_type;
    }

    fileStatus = (
        <Box
            sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2
            }}
        >
            <Grid container spacing={2}>
                <Grid item md={8} xs={8}>
                    <Stack alignItems="center" direction="row" spacing={1}>
                        {!is_TaiGer_role(user)
                            ? props.thread.isFinalVersion && FILE_OK_SYMBOL
                            : props.thread.isFinalVersion
                              ? FILE_OK_SYMBOL
                              : FILE_MISSING_SYMBOL}
                        <Link
                            component={LinkDom}
                            target="_blank"
                            to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                props.thread.doc_thread_id?._id
                            )}
                        >
                            <Typography
                                color={
                                    props.decided === 'O' ? 'primary' : 'grey'
                                }
                            >
                                {documenName}
                            </Typography>
                        </Link>
                    </Stack>
                    <Typography color="textSecondary" variant="body2">
                        {convertDate(props.thread.doc_thread_id?.updatedAt)} by{' '}
                        {latestReplyInfo(props.thread.doc_thread_id)}
                    </Typography>
                </Grid>
                <Grid item sm={4} xs={4}>
                    <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-end"
                        spacing={1}
                    >
                        {is_TaiGer_role(user) &&
                        !props.thread.isFinalVersion ? (
                            <Tooltip
                                title={t('Set as final version', {
                                    ns: 'common'
                                })}
                            >
                                <IconButton
                                    onClick={() =>
                                        handleAsFinalFileThread(
                                            documenName,
                                            true
                                        )
                                    }
                                >
                                    <CheckIcon color="success" size={24} />
                                </IconButton>
                            </Tooltip>
                        ) : null}
                        {props.thread.isFinalVersion ? (
                            is_TaiGer_role(user) ? (
                                <Tooltip title={t('Undo', { ns: 'common' })}>
                                    <IconButton>
                                        <ReplayIcon
                                            onClick={() =>
                                                handleAsFinalFileThread(
                                                    documenName,
                                                    false
                                                )
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Typography color="error.main">
                                    {t('Closed')}
                                </Typography>
                            )
                        ) : null}
                        {is_TaiGer_role(user) ? (
                            <Tooltip title={t('Delete', { ns: 'common' })}>
                                <IconButton>
                                    <DeleteIcon
                                        onClick={() =>
                                            handleDeleteFileThread(documenName)
                                        }
                                    />
                                </IconButton>
                            </Tooltip>
                        ) : null}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );

    return fileStatus;
};

export default EditableFileThread;
