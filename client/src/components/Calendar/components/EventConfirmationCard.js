import React from 'react';
import { Button, Row, Accordion, Col } from 'react-bootstrap';
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
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLoading,
  AiOutlineMail,
  AiOutlineUser
} from 'react-icons/ai';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student,
  is_TaiGer_role
} from '../../../Demo/Utils/checking-functions';
import { Link } from 'react-router-dom';
import DEMO from '../../../store/constant';
import EventDateComponent from '../../DateComponent';

export default function EventConfirmationCard(props) {
  return (
    <Accordion
      defaultActiveKey={
        (!props.event.isConfirmedReceiver ||
          !props.event.isConfirmedRequester) &&
        isInTheFuture(props.event.end)
          ? ['0']
          : []
      }
      alwaysOpen={true}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header className="d-flex justify-content-between align-items-center">
          <h5>
            {props.event.isConfirmedReceiver &&
            props.event.isConfirmedRequester ? (
              <AiFillCheckCircle
                color="limegreen"
                size={24}
                title="Confirmed"
              />
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
              {is_TaiGer_role(props.user) && (
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
          </h5>
        </Accordion.Header>
        <Accordion.Body>
          <Row>
            <Col md={2}>
              <EventDateComponent eventDate={new Date(props.event.start)} />
            </Col>
            <Col md={2}>
              <h5>
                <AiOutlineCalendar />: {getDate(props.event.start)}
              </h5>
              <h5>
                {' '}
                <AiOutlineClockCircle />: {getTime(props.event.start)}
              </h5>
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
            </Col>
            <Col>
              <h5>
                <AiOutlineUser size={16} />
                Agent:{' '}
                {props.event.receiver_id?.map((receiver, x) => (
                  <span key={x}>
                    {receiver.firstname} {receiver.lastname}{' '}
                    <AiOutlineMail ize={16} /> {receiver.email}
                  </span>
                ))}
              </h5>
              <h5>
                <AiOutlineUser size={16} />
                Student:{' '}
                {props.event.requester_id?.map((requester, x) =>
                  is_TaiGer_role(props.user) ? (
                    <Link
                      to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                        requester._id.toString(),
                        '/profile'
                      )}`}
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
              </h5>
              <h5>Meeting Link:</h5>
              {is_TaiGer_Student(props.user) &&
                (props.event.isConfirmedRequester ? (
                  props.event.isConfirmedReceiver ? (
                    props.disabled ? (
                      'Meeting Link expired'
                    ) : (
                      <a
                        href={`${props.event.meetingLink}`}
                        className="text-primary"
                        target="_blank"
                      >
                        {props.event.meetingLink}
                      </a>
                    )
                  ) : (
                    'Will be available, after the appointment is confirmed by the Agent.'
                  )
                ) : (
                  <scan>
                    Please{' '}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) =>
                        props.handleConfirmAppointmentModalOpen(e, props.event)
                      }
                    >
                      <AiOutlineCheckCircle size={16} /> Confirm
                    </Button>{' '}
                    the time and get the meeting link
                  </scan>
                ))}
              {is_TaiGer_role(props.user) &&
                (props.event.isConfirmedReceiver ? (
                  props.event.isConfirmedRequester ? (
                    props.disabled ? (
                      'Meeting Link expired'
                    ) : (
                      <a
                        href={`${props.event.meetingLink}`}
                        className="text-primary"
                        target="_blank"
                      >
                        {props.event.meetingLink}
                      </a>
                    )
                  ) : (
                    'Will be available, after the appointment is confirmed by the Student.'
                  )
                ) : (
                  <scan>
                    Please{' '}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) =>
                        props.handleConfirmAppointmentModalOpen(e, props.event)
                      }
                    >
                      <AiOutlineCheckCircle size={16} /> Confirm
                    </Button>{' '}
                    the time and get the meeting link
                  </scan>
                ))}
              <br />
            </Col>
          </Row>
          <Row>
            <h5>
              <span
                style={{
                  float: 'right',
                  justifyContent: 'flex-end'
                }}
              >
                {is_TaiGer_Student(props.user) &&
                  (props.event.isConfirmedRequester ? (
                    props.event.isConfirmedReceiver ? (
                      <></>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AiOutlineLoading size={16} /> Pending
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) =>
                        props.handleConfirmAppointmentModalOpen(e, props.event)
                      }
                    >
                      <AiOutlineCheckCircle size={16} /> Confirm
                    </Button>
                  ))}
                {is_TaiGer_Agent(props.user) &&
                  (props.event.isConfirmedReceiver ? (
                    props.event.isConfirmedRequester ? (
                      <></>
                    ) : (
                      <Button variant="primary" size="sm">
                        <AiOutlineLoading size={16} /> Pending
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) =>
                        props.handleConfirmAppointmentModalOpen(e, props.event)
                      }
                    >
                      <AiOutlineCheckCircle size={16} /> Confirm
                    </Button>
                  ))}
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={props.disabled}
                  onClick={(e) =>
                    props.handleEditAppointmentModalOpen(e, props.event)
                  }
                >
                  <AiOutlineEdit size={16} /> Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={props.disabled}
                  onClick={(e) =>
                    props.handleDeleteAppointmentModalOpen(e, props.event)
                  }
                >
                  <AiOutlineDelete size={16} /> Delete
                </Button>
              </span>
            </h5>
          </Row>
          <Row>
            <Col>
              <h5>Description:</h5>
              <p>{props.event.description}</p>
            </Col>
            <Col>
              <p>
                <span
                  style={{
                    float: 'right',
                    justifyContent: 'flex-end'
                  }}
                >
                  created at:{convertDate(props.event.createdAt)}
                  <br />
                  udpated at:{convertDate(props.event.updatedAt)}
                </span>
              </p>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
