import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

import DocumentsListItemsEditor from './DocumentsListItemsEditor';
import { valid_categories, valid_internal_categories } from '../Utils/contants';
import { Typography, Card } from '@mui/material';

function SingleDocEdit(props) {
  const [singleDocEditState, setSingleDocEdit] = useState({
    doc_title: props.document_title,
    category: props.category
  });

  useEffect(() => {
    setSingleDocEdit((prevState) => ({
      ...prevState,
      doc_title: props.document_title
    }));
  }, []);

  const handleChange_category = (e) => {
    e.preventDefault();
    var category_temp = { ...singleDocEditState.category };
    category_temp = e.target.value;
    setSingleDocEdit((prevState) => ({
      ...prevState,
      category: category_temp
    }));
  };

  const handleChange = (e) => {
    e.preventDefault();
    var doc_title_temp = { ...singleDocEditState.doc_title };
    doc_title_temp = e.target.value;
    setSingleDocEdit((prevState) => ({
      ...prevState,
      doc_title: doc_title_temp
    }));
  };

  const handleClickSave = (e, editorState) => {
    e.preventDefault();
    props.handleClickSave(
      e,
      singleDocEditState.category,
      singleDocEditState.doc_title,
      editorState
    );
  };

  return (
    <>
      <Card sx={{ p: 2, mt: 2 }}>
        {props.internal ? (
          <>
            <Typography variant="body1">
              Category:<b>Internal</b>
            </Typography>
            <Form.Group controlId="category">
              <Form.Control
                as="select"
                onChange={(e) => handleChange_category(e)}
                defaultValue={props.category}
              >
                <option value={''}>Select Document Category</option>
                {valid_internal_categories.map((cat, i) => (
                  <option key={i} value={cat.key}>
                    {cat.value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </>
        ) : (
          <>
            <Typography variant="body1">
              Category: <b>Public</b>
            </Typography>
            <Form.Group controlId="category">
              <Form.Control
                as="select"
                onChange={(e) => handleChange_category(e)}
                defaultValue={props.category}
              >
                <option value={''}>Select Document Category</option>
                {valid_categories.map((cat, i) => (
                  <option key={i} value={cat.key}>
                    {cat.value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </>
        )}
        <Form.Group controlId="document_title">
          <Form.Control
            type="text"
            placeholder="Title"
            onChange={(e) => handleChange(e)}
            defaultValue={props.document_title}
          />
        </Form.Group>
        <DocumentsListItemsEditor
          doc_title={singleDocEditState.doc_title}
          editorState={props.editorState}
          handleClickSave={handleClickSave}
          handleClickEditToggle={props.handleClickEditToggle}
        />
      </Card>
    </>
  );
}
export default SingleDocEdit;
