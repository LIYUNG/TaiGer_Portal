import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function UploadFileForm(props) {
  const [uploadFileFormState, setUploadFileFormState] = useState({
    FileName: '',
    text: ''
  });

  const handleContentChange = (e) => {
    setUploadFileFormState((prevState) => ({
      ...prevState,
      FileName: e.target.value
    }));
  };

  const handleSubmit = () => {
    props.onFormSubmit(
      props.student._id,
      props.application.programId._id,
      uploadFileFormState.FileName
    );
  };

  const submitText = props.student._id ? 'Update' : 'Create';

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows="1"
          onChange={handleContentChange}
          defaultValue={uploadFileFormState.FileName}
          placeholder="Content"
        />
      </Form.Group>
      <Button onClick={handleSubmit}>{submitText}</Button>
      <Button onClick={props.onFormClose} variant="light">
        Cancel
      </Button>
    </>
  );
}

export default UploadFileForm;
