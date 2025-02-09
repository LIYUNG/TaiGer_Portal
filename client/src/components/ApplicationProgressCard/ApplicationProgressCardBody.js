import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { IconButton, Link, List, ListItem, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { isProgramSubmitted } from '@taiger-common/core';

import DEMO from '../../store/constant';
import { isEnglishOK } from '../../Demo/Utils/checking-functions';
import {
    FILE_MISSING_SYMBOL,
    FILE_OK_SYMBOL,
    convertDateUXFriendly
} from '../../utils/contants';
import { red } from '@mui/material/colors';

const DocumentOkIcon = () => {
    return FILE_OK_SYMBOL;
};
const DocumentMissingIcon = () => {
    return FILE_MISSING_SYMBOL;
};

export default function ApplicationProgressCardBody(props) {
    return (
        <List variant="flush">
            {props.student?.generaldocs_threads?.map((thread, idx) => (
                <ListItem key={idx}>
                    <Typography>
                        <Link
                            color="inherit"
                            component={LinkDom}
                            to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                thread.doc_thread_id._id.toString()
                            )}
                            underline="hover"
                        >
                            {thread.isFinalVersion ? (
                                <IconButton>
                                    <DocumentOkIcon />
                                </IconButton>
                            ) : (
                                <IconButton>
                                    <DocumentMissingIcon />
                                </IconButton>
                            )}{' '}
                            {thread.doc_thread_id?.file_type}
                        </Link>
                        {' - '}{' '}
                        {convertDateUXFriendly(thread.doc_thread_id?.updatedAt)}
                    </Typography>
                </ListItem>
            ))}
            {/* TODO: debug: checking english score with certificate */}
            {props.application?.programId?.ielts ||
            props.application?.programId?.toefl ? (
                props.student?.academic_background?.language
                    ?.english_isPassed === 'O' ? (
                    isEnglishOK(props.application?.programId, props.student) ? (
                        <ListItem>
                            <Typography>
                                <Link
                                    color="inherit"
                                    component={LinkDom}
                                    to={`${DEMO.SURVEY_LINK}`}
                                    underline="hover"
                                >
                                    <IconButton>
                                        <DocumentOkIcon />
                                    </IconButton>{' '}
                                    English{' '}
                                </Link>
                                {' - '}
                                {
                                    props.student.academic_background.language
                                        .english_certificate
                                }
                                {' - '}
                                {
                                    props.student.academic_background?.language
                                        ?.english_score
                                }
                            </Typography>
                        </ListItem>
                    ) : (
                        <ListItem title="English Requirements not met with your input in Profile">
                            <Typography>
                                <Link
                                    color="inherit"
                                    component={LinkDom}
                                    to={`${DEMO.SURVEY_LINK}`}
                                    underline="hover"
                                >
                                    <IconButton>
                                        <WarningIcon
                                            color={red[700]}
                                            fontSize="small"
                                        />
                                    </IconButton>{' '}
                                    English
                                </Link>
                                {' - '}
                                {
                                    props.student.academic_background.language
                                        .english_certificate
                                }
                                {' - '}
                                {
                                    props.student.academic_background?.language
                                        ?.english_score
                                }
                            </Typography>
                        </ListItem>
                    )
                ) : (
                    <ListItem>
                        <Typography>
                            <Link
                                color="inherit"
                                component={LinkDom}
                                to={`${DEMO.SURVEY_LINK}`}
                                underline="hover"
                            >
                                <IconButton>
                                    <DocumentMissingIcon />
                                </IconButton>{' '}
                                English
                            </Link>
                            {' - '}{' '}
                            {
                                props.student.academic_background?.language
                                    ?.english_test_date
                            }
                        </Typography>
                    </ListItem>
                )
            ) : null}
            {props.application?.programId?.testdaf ? (
                props.application?.programId?.testdaf === '-' ? null : props
                      .student?.academic_background?.language
                      ?.german_isPassed === 'O' ? (
                    <ListItem>
                        <Typography>
                            <Link
                                color="inherit"
                                component={LinkDom}
                                to={`${DEMO.SURVEY_LINK}`}
                                underline="hover"
                            >
                                <IconButton>
                                    <DocumentOkIcon />
                                </IconButton>{' '}
                                German
                            </Link>
                        </Typography>
                    </ListItem>
                ) : (
                    <ListItem>
                        <Typography>
                            <Link
                                color="inherit"
                                component={LinkDom}
                                to={`${DEMO.SURVEY_LINK}`}
                                underline="hover"
                            >
                                <IconButton>
                                    <DocumentMissingIcon />
                                </IconButton>{' '}
                                German
                            </Link>
                        </Typography>
                    </ListItem>
                )
            ) : null}
            {props.application?.programId?.gre ? (
                props.application?.programId?.gre === '-' ? null : props.student
                      ?.academic_background?.language?.gre_isPassed === 'O' ? (
                    <ListItem>
                        <Typography>
                            <Link
                                color="inherit"
                                component={LinkDom}
                                to={`${DEMO.SURVEY_LINK}`}
                                underline="hover"
                            >
                                <IconButton>
                                    <DocumentOkIcon />
                                </IconButton>
                                GRE
                            </Link>
                        </Typography>
                    </ListItem>
                ) : (
                    <ListItem>
                        <Typography>
                            <Link
                                color="inherit"
                                component={LinkDom}
                                to={`${DEMO.SURVEY_LINK}`}
                                underline="hover"
                            >
                                <IconButton>
                                    <DocumentMissingIcon />
                                </IconButton>{' '}
                                GRE
                            </Link>
                        </Typography>
                    </ListItem>
                )
            ) : null}
            {props.application?.programId?.gmat ? (
                props.application?.programId?.gmat === '-' ? null : props
                      .student?.academic_background?.language?.gmat_isPassed ===
                  'O' ? (
                    <ListItem>
                        <Typography>
                            <Link
                                color="inherit"
                                component={LinkDom}
                                to={`${DEMO.SURVEY_LINK}`}
                                underline="hover"
                            >
                                <IconButton>
                                    <DocumentOkIcon />
                                </IconButton>{' '}
                                GMAT
                            </Link>
                        </Typography>
                    </ListItem>
                ) : (
                    <ListItem>
                        <Typography>
                            <Link
                                color="inherit"
                                component={LinkDom}
                                to={`${DEMO.SURVEY_LINK}`}
                                underline="hover"
                            >
                                <IconButton>
                                    <DocumentMissingIcon />
                                </IconButton>{' '}
                                GMAT
                            </Link>
                        </Typography>
                    </ListItem>
                )
            ) : null}
            {props.application?.programId?.application_portal_a ||
            props.application?.programId?.application_portal_b ? (
                <ListItem>
                    <Typography>
                        <Link
                            color="inherit"
                            component={LinkDom}
                            to={`${DEMO.PORTALS_MANAGEMENT_STUDENTID_LINK(
                                props.student._id.toString()
                            )}`}
                            underline="hover"
                        >
                            {(props.application?.programId
                                ?.application_portal_a &&
                                !props.application.credential_a_filled) ||
                            (props.application?.programId
                                ?.application_portal_b &&
                                !props.application.credential_b_filled) ? (
                                <IconButton>
                                    <DocumentMissingIcon />
                                </IconButton>
                            ) : (
                                <IconButton>
                                    <DocumentOkIcon />
                                </IconButton>
                            )}{' '}
                            Register University Portal
                        </Link>
                    </Typography>
                </ListItem>
            ) : null}
            {props.application?.doc_modification_thread?.map((thread, idx) => (
                <ListItem key={idx}>
                    <Typography>
                        <Link
                            color="inherit"
                            component={LinkDom}
                            to={DEMO.DOCUMENT_MODIFICATION_LINK(
                                thread.doc_thread_id._id.toString()
                            )}
                            underline="hover"
                        >
                            {thread.isFinalVersion ? (
                                <IconButton>
                                    <DocumentOkIcon />
                                </IconButton>
                            ) : (
                                <IconButton>
                                    <DocumentMissingIcon />
                                </IconButton>
                            )}{' '}
                            {thread.doc_thread_id?.file_type.replace(/_/g, ' ')}
                        </Link>
                        {' - '}
                        {convertDateUXFriendly(thread.doc_thread_id?.updatedAt)}
                    </Typography>
                </ListItem>
            ))}

            {props.application?.programId?.uni_assist?.includes('VPD') ? (
                <ListItem>
                    <Typography>
                        <Link
                            color="inherit"
                            component={LinkDom}
                            to={`${DEMO.UNI_ASSIST_LINK}`}
                            underline="hover"
                        >
                            {props.application?.uni_assist?.status ===
                            'notstarted' ? (
                                <IconButton>
                                    <DocumentMissingIcon />
                                </IconButton>
                            ) : (
                                <IconButton>
                                    <DocumentOkIcon />
                                </IconButton>
                            )}{' '}
                            Uni-Assist VPD
                            {' - '}{' '}
                            {convertDateUXFriendly(
                                props.application?.uni_assist?.updatedAt
                            )}
                        </Link>
                    </Typography>
                </ListItem>
            ) : null}

            <ListItem>
                <Typography>
                    <Link
                        color="inherit"
                        component={LinkDom}
                        to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                            props.student._id.toString()
                        )}`}
                        underline="hover"
                    >
                        {isProgramSubmitted(props.application) ? (
                            <IconButton>
                                <DocumentOkIcon />
                            </IconButton>
                        ) : (
                            <IconButton>
                                <DocumentMissingIcon />
                            </IconButton>
                        )}
                        Submit
                    </Link>
                </Typography>
            </ListItem>
        </List>
    );
}
