import React from 'react';
import { Form, Button, Offcanvas } from 'react-bootstrap';

export default function OffcanvasBaseDocument(props) {
  return (
    <Offcanvas
      show={props.show}
      onHide={props.onHide}
      placement="end"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form.Group className="mb-3">
          <Form.Label>
            Documentation Link for <b>{props.docName}</b>
          </Form.Label>
          <Form.Control
            placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
            defaultValue={props.link}
            onChange={(e) => props.onChangeURL(e)}
          />
        </Form.Group>
        <Button
          onClick={(e) => props.updateDocLink(e)}
          disabled={props.baseDocsflagOffcanvasButtonDisable}
        >
          Save
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
