import React from 'react';
import { Form } from 'react-bootstrap';

function InputFormSelect(props) {
  return (
    <Form.Group controlId={`${props.prop_name}`}>
      <Form.Label className="my-0 mx-0 text-light">{props.title}</Form.Label>
      <Form.Control
        as="select"
        disabled={props.isReadonly}
        value={props.value}
        onChange={props.handleChange}
      >
        <>{props.OPTIONS}</>
      </Form.Control>
    </Form.Group>
  );
}

export default InputFormSelect;
