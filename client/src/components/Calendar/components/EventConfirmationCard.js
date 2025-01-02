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
        (!props.event.isConfirmedReceiver ||
          !props.event.isConfirmedRequester) &&
        isInTheFuture(props.event.end)
      }
      disableGutters
    >
      <AccordionSummary>
        <Typography variant="h6">
          {props.event.isConfirmedReceiver && props.event.isConfirmedRequester
            ? DECISION_STATUS_E.OK_SYMBOL
            : DECISION_STATUS_E.UNKNOWN_SYMBOL}{' '}
          &nbsp;
          <EventIcon />
          &nbsp;{convertDate(props.event.start)}{' '}
          {NoonNightLabel(props.event.start)} ({' '}
          {Intl.DateTimeFormat().resolvedOptions().timeZone} UTC
          {showTimezoneOffset()}){' '}
          <b>
            {is_TaiGer_role(user) && (
              <>
                {props.event.requester_id
                  ?.map(
                    (requester) =>
                      `${requester.firstname} ${requester.lastname}`
                  )
                  .join(',')}
              </>
            )}
          </b>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <EventDateComponent eventDate={new Date(props.event.start)} />
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="h6">
              <EventIcon />: {getDate(props.event.start)}
            </Typography>
            <Typography variant="h6" sx={{ display: 'flex' }}>
              <AccessAlarmIcon />: {getTime(props.event.start)}
            </Typography>
            {NoonNightLabel(props.event.start)} ({' '}
            {Intl.DateTimeFormat().resolvedOptions().timeZone} UTC
            {showTimezoneOffset()})
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ display: 'flex' }}>
              <PersonIcon />
              {t('Agent', { ns: 'common' })}:{' '}
              {props.event.receiver_id?.map((receiver, x) => (
                <span key={x}>
                  {receiver.firstname} {receiver.lastname} <EmailIcon />{' '}
                  {receiver.email}
                </span>
              ))}
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex' }}>
              <PersonIcon />
              {t('Student', { ns: 'common' })}:{' '}
              {props.event.requester_id?.map((requester, x) =>
                is_TaiGer_role(user) ? (
                  <Link
                    underline="hover"
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                      requester._id.toString(),
                      DEMO.PROFILE_HASH
                    )}`}
                    component={LinkDom}
                    key={x}
                  >
                    {requester.firstname} {requester.lastname} <EmailIcon />{' '}
                    {requester.email}
                  </Link>
                ) : (
                  <span key={x}>
                    {requester.firstname} {requester.lastname} <EmailIcon />{' '}
                    {requester.email}
                  </span>
                )
              )}
            </Typography>
            <Typography variant="h6">
              {t('Meeting Link', { ns: 'common' })} :
            </Typography>
            {is_TaiGer_Student(user) &&
              (props.event.isConfirmedRequester ? (
                props.event.isConfirmedReceiver ? (
                  props.disabled ? (
                    `${t('Meeting Link', { ns: 'common' })} expired'`
                  ) : (
                    <Link
                      to={`${props.event.meetingLink}`}
                      component={LinkDom}
                      target="_blank"
                      rel="noopener noreferrer"
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
                    variant="contained"
                    size="small"
                    onClick={(e) =>
                      props.handleConfirmAppointmentModalOpen(e, props.event)
                    }
                    startIcon={<CheckIcon />}
                  >
                    {t('Confirm', { ns: 'common' })}
                  </Button>{' '}
                  the time and get the meeting link
                </span>
              ))}
            {is_TaiGer_role(user) &&
              (props.event.isConfirmedReceiver ? (
                props.event.isConfirmedRequester ? (
                  props.disabled ? (
                    'Meeting Link expired'
                  ) : (
                    <Link
                      to={`${props.event.meetingLink}`}
                      component={LinkDom}
                      target="_blank"
                      rel="noopener noreferrer"
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
                    variant="contained"
                    size="small"
                    onClick={(e) =>
                      props.handleConfirmAppointmentModalOpen(e, props.event)
                    }
                    startIcon={<CheckIcon />}
                  >
                    {t('Confirm', { ns: 'common' })}
                  </Button>{' '}
                  the time and get the meeting link
                </span>
              ))}
            <br />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="body1">
                  {t('Description', { ns: 'common' })}
                </Typography>
                <Typography>{props.event.description}</Typography>
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
                {props.event.event_type !== 'Interview' && (
                  <Typography variant="h6">
                    <span
                      style={{
                        float: 'right',
                        justifyContent: 'flex-end'
                      }}
                    >
                      {is_TaiGer_Student(user) &&
                        (props.event.isConfirmedRequester ? (
                          props.event.isConfirmedReceiver ? (
                            <></>
                          ) : (
                            <Button
                              color="primary"
                              variant="outlined"
                              size="small"
                              title="Wait for confirmation"
                              onClick={(e) => e.stopPropagation()}
                              startIcon={<HourglassBottomIcon />}
                            >
                              {t('Pending', {
                                ns: 'common'
                              })}
                            </Button>
                          )
                        ) : (
                          <Button
                            color="primary"
                            variant="contained"
                            size="small"
                            onClick={(e) =>
                              props.handleConfirmAppointmentModalOpen(
                                e,
                                props.event
                              )
                            }
                            sx={{ mx: 2 }}
                            startIcon={<CheckIcon />}
                          >
                            {t('Confirm', {
                              ns: 'common'
                            })}
                          </Button>
                        ))}
                      {is_TaiGer_Agent(user) &&
                        (props.event.isConfirmedReceiver ? (
                          props.event.isConfirmedRequester ? (
                            <></>
                          ) : (
                            <Button
                              color="primary"
                              variant="outlined"
                              size="small"
                              title="Wait for confirmation"
                              startIcon={<HourglassBottomIcon />}
                            >
                              {t('Pending', {
                                ns: 'common'
                              })}
                            </Button>
                          )
                        ) : (
                          <Button
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={(e) =>
                              props.handleConfirmAppointmentModalOpen(
                                e,
                                props.event
                              )
                            }
                            startIcon={<CheckIcon />}
                          >
                            {t('Confirm', {
                              ns: 'common'
                            })}
                          </Button>
                        ))}
                      <Button
                        color="secondary"
                        variant="outlined"
                        size="small"
                        disabled={props.disabled}
                        onClick={(e) =>
                          props.handleEditAppointmentModalOpen(e, props.event)
                        }
                        sx={{ mx: 2 }}
                        startIcon={<EditIcon />}
                      >
                        {t('Update', { ns: 'common' })}
                      </Button>
                      <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        disabled={props.disabled}
                        onClick={(e) =>
                          props.handleDeleteAppointmentModalOpen(e, props.event)
                        }
                        startIcon={<DeleteIcon />}
                      >
                        {t('Delete', { ns: 'common' })}
                      </Button>
                    </span>
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
