import { Modal, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import '../style/model.scss';
import { Link, withRouter } from 'react-router-dom';
import { convertDate } from '../../../Demo/Utils/contants';

const Popping = ({
  open,
  handleClose,
  event
  // deleteEventApi,
  // renderStatus,
  // rerender
}) => {
  // const navigate = useNavigate();
  const { id, description, title, start, end } = event;

  // const handleDelete = async () => {
  //   await deleteEventApi(event.id);
  //   rerender(!renderStatus);
  // };

  const modal = () => {
    return (
      <Modal show={open} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-capitalize">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {description ? (
            <p className="lead">{description}</p>
          ) : (
            'No Dsecriptions Yet'
          )}
          <div className="row justify-content-between">
            <p className="col small text-muted text-center pb-0 mb-0">
              from: {convertDate(start)}
            </p>
            <p className="col small text-muted text-center pb-0 mb-0">
              to: {convertDate(end)}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            Close
          </Button>
          <Link to={`/event/${id}/update`}>
            <Button variant="success">Update</Button>
          </Link>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  if (id) {
    return modal();
  } else {
    <p>there is no modal to preview</p>;
  }
};

export default Popping;
