import { Modal, Button, Form, Badge } from 'react-bootstrap';
import React, { useState } from 'react';
import '../style/model.scss';
import { convertDate } from '../../../Demo/Utils/contants';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student
} from '../../../Demo/Utils/checking-functions';

const Popping = ({
  open,
  handleClose,
  handleChange,
  handleChangeReceiver,
  newReceiver,
  event,
  handleBook,
  newDescription,
  user
  // deleteEventApi,
  // renderStatus,
  // rerender
}) => {
  if (event?.id) {
    // const navigate = useNavigate();
    const { title, start, end } = event;
    const textLimit = 2000;
    // const handleDelete = async () => {
    //   await deleteEventApi(event.id);
    //   rerender(!renderStatus);
    // };

    const modal = () => {
      return (
        <Modal show={open} size="xl" onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-capitalize">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="description" className="my-0 mx-0">
                <Form.Label>請寫下想討論的主題</Form.Label>
                <Form.Control
                  as="textarea"
                  maxLength={textLimit}
                  rows="10"
                  placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
                  value={newDescription || ''}
                  isInvalid={newDescription?.length > textLimit}
                  onChange={handleChange}
                ></Form.Control>
                <Badge
                  className="mt-3"
                  bg={`${
                    newDescription?.length > textLimit ? 'danger' : 'primary'
                  }`}
                >
                  {newDescription?.length || 0}/{textLimit}
                </Badge>
              </Form.Group>
            </Form>
            <Form>
              <Form.Group controlId="receiver" className="my-0 mx-0">
                <Form.Label>Receiver</Form.Label>
                <Form.Control
                  as="select"
                  value={
                    is_TaiGer_Student(user)
                      ? user.agents.length > 0
                        ? newReceiver
                        : ''
                      : ''
                  }
                  onChange={handleChangeReceiver}
                >
                  {is_TaiGer_Student(user) ? (
                    <>
                      <option value={''}>Please Select</option>
                      <option value={event.provider._id.toString()}>
                        {event.provider.firstname} {event.provider.lastname}
                      </option>
                    </>
                  ) : is_TaiGer_Agent(user) ? (
                    <option value={user._id.toString()}>
                      {user.firstname}
                      {user.lastname}
                    </option>
                  ) : (
                    user.agents.map((agent, i) => (
                      <option value={agent._id.toString()} key={i}>
                        {agent.firstname}
                        {agent.lastname}
                      </option>
                    ))
                  )}
                </Form.Control>
              </Form.Group>
            </Form>
            <br />
            <ul>
              <li className="col text-muted pb-0 mb-0">
                From: {convertDate(start)}
              </li>
              <li className="col text-muted pb-0 mb-0">
                To: {convertDate(end)}
              </li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={handleBook}
              disabled={newDescription?.length === 0 || newReceiver === ''}
            >
              Book
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };
    return modal();
  } else {
    <p>there is no modal to preview</p>;
  }
};

export default Popping;
