import { Modal, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import '../style/model.scss';
import { Link, withRouter } from 'react-router-dom';
import { convertDate } from '../../../Demo/Utils/contants';

const Popping = ({
  open,
  handleClose,
  event,
  handleBook
  // deleteEventApi,
  // renderStatus,
  // rerender
}) => {
  if (event?.id) {
    // const navigate = useNavigate();
    const { description, title, start, end } = event;

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
            <Button variant="primary" onClick={handleBook}>
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
