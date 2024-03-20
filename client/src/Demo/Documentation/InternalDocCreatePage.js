import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Card,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import DocumentsListItems from './DocumentsListItems';
import DocumentsListItemsEditor from './DocumentsListItemsEditor';
import {
  valid_internal_categories,
  internal_documentation_categories
} from '../Utils/contants';
import {
  is_TaiGer_AdminAgent,
  is_TaiGer_role
} from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import {
  getAllInternalDocumentations,
  createInternalDocumentation,
  deleteInternalDocumentation
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { appConfig } from '../../config';

function InternalDocCreatePage(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [internalDocCreatePageState, setInternalDocCreatePageState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    documentlists: [],
    doc_id_toBeDelete: '',
    doc_title_toBeDelete: '',
    doc_title: '',
    category: '',
    SetDeleteDocModel: false,
    isEdit: false,
    expand: true,
    editorState: '',
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    getAllInternalDocumentations().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setInternalDocCreatePageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            documentlists: data,
            success: success,
            res_status: status
          }));
        } else {
          setInternalDocCreatePageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setInternalDocCreatePageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const handleChange_doc_title = (e) => {
    const { value } = e.target;
    setInternalDocCreatePageState((prevState) => ({
      ...prevState,
      doc_title: value
    }));
  };

  const handleChange_category = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setInternalDocCreatePageState((prevState) => ({
      ...prevState,
      category: value
    }));
  };

  const handleDeleteDoc = () => {
    deleteInternalDocumentation(
      internalDocCreatePageState.doc_id_toBeDelete
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          let documentlists_temp = [
            ...internalDocCreatePageState.documentlists
          ];
          let to_be_delete_doc_idx = documentlists_temp.findIndex(
            (doc) =>
              doc._id.toString() ===
              internalDocCreatePageState.doc_id_toBeDelete
          );
          if (to_be_delete_doc_idx > -1) {
            // only splice array when item is found
            documentlists_temp.splice(to_be_delete_doc_idx, 1); // 2nd parameter means remove one item only
          }
          setInternalDocCreatePageState((prevState) => ({
            ...prevState,
            success,
            documentlists: documentlists_temp,
            SetDeleteDocModel: false,
            isEdit: false,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setInternalDocCreatePageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setInternalDocCreatePageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };
  const openDeleteDocModalWindow = (doc) => {
    setInternalDocCreatePageState((prevState) => ({
      ...prevState,
      doc_id_toBeDelete: doc._id,
      doc_title_toBeDelete: doc.title,
      SetDeleteDocModel: true
    }));
  };

  const closeDeleteDocModalWindow = () => {
    setInternalDocCreatePageState((prevState) => ({
      ...prevState,
      SetDeleteDocModel: false
    }));
  };

  const handleClickEditToggle = () => {
    setInternalDocCreatePageState((prevState) => ({
      ...prevState,
      isEdit: !internalDocCreatePageState.isEdit
    }));
  };

  const handleClickSave = (e, editorState) => {
    e.preventDefault();
    // Editorjs. editorState is in JSON form
    const message = JSON.stringify(editorState);
    const msg = {
      title: internalDocCreatePageState.doc_title,
      category: internalDocCreatePageState.category,
      prop: props.item,
      text: message
    };
    createInternalDocumentation(msg).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          let documentlists_temp = [
            ...internalDocCreatePageState.documentlists
          ];
          documentlists_temp.push(data);
          setInternalDocCreatePageState((prevState) => ({
            ...prevState,
            success,
            documentlists: documentlists_temp,
            editorState: '',
            isEdit: !internalDocCreatePageState.isEdit,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setInternalDocCreatePageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setInternalDocCreatePageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
    setInternalDocCreatePageState((prevState) => ({
      ...prevState,
      in_edit_mode: false
    }));
  };

  const ConfirmError = () => {
    setInternalDocCreatePageState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };
  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const { res_status, res_modal_status, res_modal_message, isLoaded } =
    internalDocCreatePageState;

  if (!isLoaded) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const documentlist_key = Object.keys(internal_documentation_categories);

  const document_list = (cat) => {
    let sections = {};
    sections[`${cat}`] = internalDocCreatePageState.documentlists.filter(
      (document) => document.category === cat
    );
    return sections[`${cat}`].map((document, i) => (
      <DocumentsListItems
        idx={i}
        key={i}
        path={'/docs/internal/search'}
        document={document}
        user={user}
        openDeleteDocModalWindow={openDeleteDocModalWindow}
      />
    ));
  };
  TabTitle('Internal Docs Database');
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">
          {t('All Internal Documentations')}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            {internalDocCreatePageState.isEdit ? (
              <>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    labelId="category"
                    name="category"
                    id="category"
                    onChange={(e) => handleChange_category(e)}
                  >
                    <MenuItem value={''}>Select Document Category</MenuItem>
                    {valid_internal_categories.map((cat, i) => (
                      <MenuItem value={cat.key} key={i}>
                        {cat.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  type="text"
                  placeholder="Title"
                  defaultValue={''}
                  onChange={(e) => handleChange_doc_title(e)}
                />
                <DocumentsListItemsEditor
                  category={internalDocCreatePageState.category}
                  doc_title={internalDocCreatePageState.doc_title}
                  editorState={internalDocCreatePageState.editorState}
                  handleClickSave={handleClickSave}
                  handleClickEditToggle={handleClickEditToggle}
                  // readOnlyMode={readOnlyMode}
                  role={props.role}
                />
              </>
            ) : (
              <>
                {documentlist_key.map((catego, i) => (
                  <Box key={i}>
                    <Typography variant="h6">
                      - {internal_documentation_categories[`${catego}`]}
                    </Typography>
                    {document_list(catego)}
                  </Box>
                ))}
                {is_TaiGer_AdminAgent(user) && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleClickEditToggle}
                  >
                    {t('Add')}
                  </Button>
                )}
              </>
            )}
          </Card>
        </Grid>
      </Grid>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <ModalNew
        open={internalDocCreatePageState.SetDeleteDocModel}
        onClose={closeDeleteDocModalWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography>{t('Warning')}</Typography>
        <Typography>
          Do you want to delete documentation of title:{' '}
          {internalDocCreatePageState.doc_title_toBeDelete}?
        </Typography>
        <Typography>
          <Button disabled={!isLoaded} onClick={handleDeleteDoc}>
            {t('Yes', { ns: 'common' })}
          </Button>
          <Button onClick={closeDeleteDocModalWindow}>{t('No', { ns: 'common' })}</Button>
        </Typography>
      </ModalNew>
    </Box>
  );
}

export default InternalDocCreatePage;
