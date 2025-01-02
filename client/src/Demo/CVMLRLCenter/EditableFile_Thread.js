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

function EditableFile_Thread(props) {
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
                <Grid item xs={8} md={8}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {!is_TaiGer_role(user)
                            ? props.thread.isFinalVersion && FILE_OK_SYMBOL
                            : props.thread.isFinalVersion
                              ? FILE_OK_SYMBOL
                              : FILE_MISSING_SYMBOL}
                        <Link
                            to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                props.thread.doc_thread_id?._id
                            )}
                            component={LinkDom}
                            target="_blank"
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
                    <Typography variant="body2" color="textSecondary">
                        {convertDate(props.thread.doc_thread_id?.updatedAt)} by{' '}
                        {latestReplyInfo(props.thread.doc_thread_id)}
                    </Typography>
                </Grid>
                <Grid item xs={4} sm={4}>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={1}
                    >
                        {is_TaiGer_role(user) &&
                            !props.thread.isFinalVersion && (
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
                                        <CheckIcon size={24} color="success" />
                                    </IconButton>
                                </Tooltip>
                            )}
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
                        ) : (
                            <></>
                        )}
                        {is_TaiGer_role(user) && (
                            <Tooltip title={t('Delete', { ns: 'common' })}>
                                <IconButton>
                                    <DeleteIcon
                                        onClick={() =>
                                            handleDeleteFileThread(documenName)
                                        }
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );

    return <>{fileStatus}</>;
}

export default EditableFile_Thread;
