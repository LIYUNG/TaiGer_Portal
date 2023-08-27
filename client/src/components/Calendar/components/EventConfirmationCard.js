import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Collapse, Button, Row } from 'react-bootstrap';
import { convertDate } from '../../../Demo/Utils/contants';
import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMail,
  AiOutlineQuestion,
  AiOutlineUser
} from 'react-icons/ai';

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
              {props.event.isConfirmed ? (
                <AiOutlineCalendar />
              ) : (
                <AiFillQuestionCircle color="grey" />
              )}{' '}
              Start: {convertDate(props.event.start)} ~ 30 min{' '}
            </h5>
            <span style={{ float: 'right' }}>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) =>
                  props.handleConfirmAppointmentModalOpen(e, props.event)
                }
              >
                <AiOutlineCheckCircle size={16} /> Confirm
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) =>
                  props.handleEditAppointmentModalOpen(e, props.event)
                }
              >
                <AiOutlineEdit size={16} /> Update
              </Button>
              <Button
                variant="danger"
                size="sm"
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
          Student:{' '}
          {props.event.requester_id?.map((requester, x) => (
            <span key={x}>
              {requester.firstname} {requester.lastname}{' '}
              <AiOutlineMail ize={16} /> {requester.email}
            </span>
          ))}
          <br />
          Description: {props.event.description}
          <br />
          Status:{' '}
          {props.event.isConfirmed ? (
            <AiFillCheckCircle title="Confirmed" size={16} color="limegreen" />
          ) : (
            <AiFillQuestionCircle
              title="Waiting for confirmation"
              size={16}
              color="gray"
            />
          )}
          <br />
          Meeting Link:{' '}
          {props.event.isConfirmed
            ? props.event.meetingLink
            : 'Will be available, after the appointment is confirmed by the Agent.'}
          <br />
          created at:{convertDate(props.event.createdAt)}
          <br />
          udpated at:{convertDate(props.event.updatedAt)}
        </Card.Body>
      </Collapse>
    </Card>
  );
}
