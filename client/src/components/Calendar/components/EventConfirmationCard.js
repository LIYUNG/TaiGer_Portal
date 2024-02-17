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

import {
  NoonNightLabel,
  convertDate,
  getDate,
  getTime,
  getTimezoneOffset,
  isInTheFuture
} from '../../../Demo/Utils/contants';
import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineMail,
  AiOutlineUser
} from 'react-icons/ai';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student,
  is_TaiGer_role
} from '../../../Demo/Utils/checking-functions';
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
      // expanded={!props.disabled}
    >
      <AccordionSummary>
        <Typography variant="h6">
          {props.event.isConfirmedReceiver &&
          props.event.isConfirmedRequester ? (
            <AiFillCheckCircle color="limegreen" size={24} title="Confirmed" />
          ) : (
            <AiFillQuestionCircle color="grey" size={24} />
          )}{' '}
          &nbsp;
          <AiOutlineCalendar />
          &nbsp;{convertDate(props.event.start)}{' '}
          {NoonNightLabel(props.event.start)} ({' '}
          {Intl.DateTimeFormat().resolvedOptions().timeZone} UTC
          {getTimezoneOffset(
            Intl.DateTimeFormat().resolvedOptions().timeZone
          ) >= 0
            ? `+${getTimezoneOffset(
                Intl.DateTimeFormat().resolvedOptions().timeZone
              )}`
            : getTimezoneOffset(
                Intl.DateTimeFormat().resolvedOptions().timeZone
              )}
          ){' '}
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
              <AiOutlineCalendar />: {getDate(props.event.start)}
            </Typography>
            <Typography variant="h6">
              {' '}
              <AiOutlineClockCircle />: {getTime(props.event.start)}
            </Typography>
            {NoonNightLabel(props.event.start)} ({' '}
            {Intl.DateTimeFormat().resolvedOptions().timeZone} UTC
            {getTimezoneOffset(
              Intl.DateTimeFormat().resolvedOptions().timeZone
            ) >= 0
              ? `+${getTimezoneOffset(
                  Intl.DateTimeFormat().resolvedOptions().timeZone
                )}`
              : getTimezoneOffset(
                  Intl.DateTimeFormat().resolvedOptions().timeZone
                )}
            )
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <AiOutlineUser size={16} />
              {t('Agent')}:{' '}
              {props.event.receiver_id?.map((receiver, x) => (
                <span key={x}>
                  {receiver.firstname} {receiver.lastname}{' '}
                  <AiOutlineMail ize={16} /> {receiver.email}
                </span>
              ))}
            </Typography>
            <Typography variant="body1">
              <AiOutlineUser size={16} />
              {t('Student')}:{' '}
              {props.event.requester_id?.map((requester, x) =>
                is_TaiGer_role(user) ? (
                  <Link
                    underline="hover"
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                      requester._id.toString(),
                      '/profile'
                    )}`}
                    component={LinkDom}
                    key={x}
                  >
                    {requester.firstname} {requester.lastname}{' '}
                    <AiOutlineMail ize={16} /> {requester.email}
                  </Link>
                ) : (
                  <span key={x}>
                    {requester.firstname} {requester.lastname}{' '}
                    <AiOutlineMail ize={16} /> {requester.email}
                  </span>
                )
              )}
            </Typography>
            <Typography variant="h6">{t('Meeting Link')} :</Typography>
            {is_TaiGer_Student(user) &&
              (props.event.isConfirmedRequester ? (
                props.event.isConfirmedReceiver ? (
                  props.disabled ? (
                    `${t('Meeting Link')} expired'`
                  ) : (
                    <Link
                      to={`${props.event.meetingLink}`}
                      component={LinkDom}
                      target="_blank"
                      rel="noreferrer"
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
                  >
                    <AiOutlineCheckCircle size={16} /> {t('Confirm')}
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
                      rel="noreferrer"
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
                  >
                    <AiOutlineCheckCircle size={16} /> {t('Confirm')}
                  </Button>{' '}
                  the time and get the meeting link
                </span>
              ))}
            <br />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="body1">{t('Description')}</Typography>
                <Typography>{props.event.description}</Typography>
                <span
                  style={{
                    float: 'right',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Typography>
                    created at:{convertDate(props.event.createdAt)}
                  </Typography>
                  <Typography>
                    udpated at:{convertDate(props.event.updatedAt)}
                  </Typography>
                </span>
              </Grid>
              <Grid item>
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
                            {t('Pending')}
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
                        >
                          <AiOutlineCheckCircle size={16} /> {t('Confirm')}
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
                            {t('Pending')}
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
                        >
                          <AiOutlineCheckCircle size={16} /> {t('Confirm')}
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
                      {t('Update')}
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
                      {t('Delete')}
                    </Button>
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
