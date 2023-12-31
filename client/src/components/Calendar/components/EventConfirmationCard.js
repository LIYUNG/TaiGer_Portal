import React, { useState, useEffect } from 'react';
import { Card, Collapse, Button, Row } from 'react-bootstrap';
import {
  NoonNightLabel,
  convertDate,
  getTimezoneOffset
} from '../../../Demo/Utils/contants';
import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
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

export default function EventConfirmationCard(props) {
  const [isCollapse, setIsCollapse] = useState(false);

  const handleToggle = () => {
    setIsCollapse(!isCollapse);
  };
  return (
    <Card className="my-1 mx-0">
      <Card.Header onClick={handleToggle} style={{ cursor: 'pointer' }}>
        <Row className="my-0">
          <Card.Title>
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
              <AiOutlineCalendar />: {convertDate(props.event.start)}{' '}
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
            <span style={{ float: 'right' }}>
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
          </Card.Title>
        </Row>
      </Card.Header>
      <Collapse in={isCollapse}>
        <Card.Body>
          <AiOutlineUser size={16} />
          Agent:{' '}
          {props.event.receiver_id?.map((receiver, x) => (
            <span key={x}>
              {receiver.firstname} {receiver.lastname}{' '}
              <AiOutlineMail ize={16} /> {receiver.email}
            </span>
          ))}
          <br />
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
          <br />
          Description:
          <p>{props.event.description}</p>
          <br />
          Meeting Link:{' '}
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
          created at:{convertDate(props.event.createdAt)}
          <br />
          udpated at:{convertDate(props.event.updatedAt)}
        </Card.Body>
      </Collapse>
    </Card>
  );
}
