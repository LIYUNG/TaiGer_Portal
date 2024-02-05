import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

import DocumentsListItemsEditor from './DocumentsListItemsEditor';
import { valid_categories, valid_internal_categories } from '../Utils/contants';
import { Typography, Card, FormControl, Select, MenuItem } from '@mui/material';

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
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="category"
                name="category"
                id="category"
                onChange={(e) => handleChange_category(e)}
                value={singleDocEditState.category || ''}
              >
                <MenuItem value={''}>Select Document Category</MenuItem>
                {valid_internal_categories.map((cat, i) => (
                  <MenuItem key={i} value={cat.key}>
                    {cat.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        ) : (
          <>
            <Typography variant="body1">
              Category: <b>Public</b>
            </Typography>
            <FormControl fullWidth>
              <Select
                size="small"
                labelId="category"
                name="category"
                id="category"
                onChange={(e) => handleChange_category(e)}
                value={singleDocEditState.category || ''}
              >
                <MenuItem value={''}>Select Document Category</MenuItem>
                {valid_categories.map((cat, i) => (
                  <MenuItem key={i} value={cat.key}>
                    {cat.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
