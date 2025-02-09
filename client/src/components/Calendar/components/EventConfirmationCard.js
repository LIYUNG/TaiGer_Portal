import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Link,
    Button,
    Grid,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import {
    is_TaiGer_Agent,
    is_TaiGer_Student,
    is_TaiGer_role
} from '@taiger-common/core';

import {
    DECISION_STATUS_E,
    NoonNightLabel,
    convertDate,
    getDate,
    getTime,
    isInTheFuture,
    showTimezoneOffset
} from '../../../utils/contants';
import DEMO from '../../../store/constant';
import EventDateComponent from '../../DateComponent';
import { useAuth } from '../../AuthProvider';

export default function EventConfirmationCard(props) {
    const { user } = useAuth();
    const { t } = useTranslation();
    return (
        <Accordion
            defaultExpanded={
                !props.event.isConfirmedReceiver ||
                !props.event.isConfirmedRequester
                    ? isInTheFuture(props.event.end)
                    : null
            }
            disableGutters
        >
            <AccordionSummary>
                <Typography variant="h6">
                    {props.event.isConfirmedReceiver &&
                    props.event.isConfirmedRequester
                        ? DECISION_STATUS_E.OK_SYMBOL
                        : DECISION_STATUS_E.UNKNOWN_SYMBOL}{' '}
                    &nbsp;
                    <EventIcon />
                    &nbsp;{convertDate(props.event.start)}{' '}
                    {NoonNightLabel(props.event.start)} ({' '}
                    {Intl.DateTimeFormat().resolvedOptions().timeZone} UTC
                    {showTimezoneOffset()}){' '}
                    <b>
                        {is_TaiGer_role(user)
                            ? props.event.requester_id
                                  ?.map(
                                      (requester) =>
                                          `${requester.firstname} ${requester.lastname}`
                                  )
                                  .join(',')
                            : null}
                    </b>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item md={2} xs={6}>
                        <EventDateComponent
                            eventDate={new Date(props.event.start)}
                        />
                    </Grid>
                    <Grid item md={4} xs={6}>
                        <Typography variant="h6">
                            <EventIcon />: {getDate(props.event.start)}
                        </Typography>
                        <Typography sx={{ display: 'flex' }} variant="h6">
                            <AccessAlarmIcon />: {getTime(props.event.start)}
                        </Typography>
                        {NoonNightLabel(props.event.start)} ({' '}
                        {Intl.DateTimeFormat().resolvedOptions().timeZone} UTC
                        {showTimezoneOffset()})
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography sx={{ display: 'flex' }} variant="body1">
                            <PersonIcon />
                            {t('Agent', { ns: 'common' })}:{' '}
                            {props.event.receiver_id?.map((receiver, x) => (
                                <span key={x}>
                                    {receiver.firstname} {receiver.lastname}{' '}
                                    <EmailIcon /> {receiver.email}
                                </span>
                            ))}
                        </Typography>
                        <Typography sx={{ display: 'flex' }} variant="body1">
                            <PersonIcon />
                            {t('Student', { ns: 'common' })}:{' '}
                            {props.event.requester_id?.map((requester, x) =>
                                is_TaiGer_role(user) ? (
                                    <Link
                                        component={LinkDom}
                                        key={x}
                                        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                            requester._id.toString(),
                                            DEMO.PROFILE_HASH
                                        )}`}
                                        underline="hover"
                                    >
                                        {requester.firstname}{' '}
                                        {requester.lastname} <EmailIcon />{' '}
                                        {requester.email}
                                    </Link>
                                ) : (
                                    <span key={x}>
                                        {requester.firstname}{' '}
                                        {requester.lastname} <EmailIcon />{' '}
                                        {requester.email}
                                    </span>
                                )
                            )}
                        </Typography>
                        <Typography variant="h6">
                            {t('Meeting Link', { ns: 'common' })} :
                        </Typography>
                        {is_TaiGer_Student(user) ? (
                            props.event.isConfirmedRequester ? (
                                props.event.isConfirmedReceiver ? (
                                    props.disabled ? (
                                        `${t('Meeting Link', { ns: 'common' })} expired'`
                                    ) : (
                                        <Link
                                            component={LinkDom}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            to={`${props.event.meetingLink}`}
                                        >
                                            {props.event.meetingLink}
                                        </Link>
                                    )
                                ) : (
                                    'Will be available, after the appointment is confirmed by the Agent.'
                                )
                            ) : (
                                <span>
                                    Please{' '}
                                    <Button
                                        color="primary"
                                        onClick={(e) =>
                                            props.handleConfirmAppointmentModalOpen(
                                                e,
                                                props.event
                                            )
                                        }
                                        size="small"
                                        startIcon={<CheckIcon />}
                                        variant="contained"
                                    >
                                        {t('Confirm', { ns: 'common' })}
                                    </Button>{' '}
                                    the time and get the meeting link
                                </span>
                            )
                        ) : null}
                        {is_TaiGer_role(user) ? (
                            props.event.isConfirmedReceiver ? (
                                props.event.isConfirmedRequester ? (
                                    props.disabled ? (
                                        'Meeting Link expired'
                                    ) : (
                                        <Link
                                            component={LinkDom}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            to={`${props.event.meetingLink}`}
                                        >
                                            {props.event.meetingLink}
                                        </Link>
                                    )
                                ) : (
                                    'Will be available, after the appointment is confirmed by the Student.'
                                )
                            ) : (
                                <span>
                                    Please{' '}
                                    <Button
                                        color="primary"
                                        onClick={(e) =>
                                            props.handleConfirmAppointmentModalOpen(
                                                e,
                                                props.event
                                            )
                                        }
                                        size="small"
                                        startIcon={<CheckIcon />}
                                        variant="contained"
                                    >
                                        {t('Confirm', { ns: 'common' })}
                                    </Button>{' '}
                                    the time and get the meeting link
                                </span>
                            )
                        ) : null}
                        <br />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            alignItems="center"
                            container
                            justifyContent="space-between"
                        >
                            <Grid item>
                                <Typography variant="body1">
                                    {t('Description', { ns: 'common' })}
                                </Typography>
                                <Typography>
                                    {props.event.description}
                                </Typography>
                                <span
                                    style={{
                                        float: 'right',
                                        justifyContent: 'flex-end'
                                    }}
                                >
                                    <Typography>
                                        created at:
                                        {convertDate(props.event.createdAt)}
                                    </Typography>
                                    <Typography>
                                        udpated at:
                                        {convertDate(props.event.updatedAt)}
                                    </Typography>
                                </span>
                            </Grid>
                            <Grid item>
                                {props.event.event_type !== 'Interview' ? (
                                    <Typography variant="h6">
                                        <span
                                            style={{
                                                float: 'right',
                                                justifyContent: 'flex-end'
                                            }}
                                        >
                                            {is_TaiGer_Student(user) ? (
                                                props.event
                                                    .isConfirmedRequester ? (
                                                    props.event
                                                        .isConfirmedReceiver ? null : (
                                                        <Button
                                                            color="primary"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            size="small"
                                                            startIcon={
                                                                <HourglassBottomIcon />
                                                            }
                                                            title="Wait for confirmation"
                                                            variant="outlined"
                                                        >
                                                            {t('Pending', {
                                                                ns: 'common'
                                                            })}
                                                        </Button>
                                                    )
                                                ) : (
                                                    <Button
                                                        color="primary"
                                                        onClick={(e) =>
                                                            props.handleConfirmAppointmentModalOpen(
                                                                e,
                                                                props.event
                                                            )
                                                        }
                                                        size="small"
                                                        startIcon={
                                                            <CheckIcon />
                                                        }
                                                        sx={{ mx: 2 }}
                                                        variant="contained"
                                                    >
                                                        {t('Confirm', {
                                                            ns: 'common'
                                                        })}
                                                    </Button>
                                                )
                                            ) : null}
                                            {is_TaiGer_Agent(user) ? (
                                                props.event
                                                    .isConfirmedReceiver ? (
                                                    props.event
                                                        .isConfirmedRequester ? null : (
                                                        <Button
                                                            color="primary"
                                                            size="small"
                                                            startIcon={
                                                                <HourglassBottomIcon />
                                                            }
                                                            title="Wait for confirmation"
                                                            variant="outlined"
                                                        >
                                                            {t('Pending', {
                                                                ns: 'common'
                                                            })}
                                                        </Button>
                                                    )
                                                ) : (
                                                    <Button
                                                        color="primary"
                                                        onClick={(e) =>
                                                            props.handleConfirmAppointmentModalOpen(
                                                                e,
                                                                props.event
                                                            )
                                                        }
                                                        size="small"
                                                        startIcon={
                                                            <CheckIcon />
                                                        }
                                                        variant="contained"
                                                    >
                                                        {t('Confirm', {
                                                            ns: 'common'
                                                        })}
                                                    </Button>
                                                )
                                            ) : null}
                                            <Button
                                                color="secondary"
                                                disabled={props.disabled}
                                                onClick={(e) =>
                                                    props.handleEditAppointmentModalOpen(
                                                        e,
                                                        props.event
                                                    )
                                                }
                                                size="small"
                                                startIcon={<EditIcon />}
                                                sx={{ mx: 2 }}
                                                variant="outlined"
                                            >
                                                {t('Update', { ns: 'common' })}
                                            </Button>
                                            <Button
                                                color="secondary"
                                                disabled={props.disabled}
                                                onClick={(e) =>
                                                    props.handleDeleteAppointmentModalOpen(
                                                        e,
                                                        props.event
                                                    )
                                                }
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                variant="contained"
                                            >
                                                {t('Delete', { ns: 'common' })}
                                            </Button>
                                        </span>
                                    </Typography>
                                ) : null}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}
