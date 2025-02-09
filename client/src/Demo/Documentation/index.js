import React, { useEffect, useState } from 'react';
import { Navigate, useParams, Link as LinkDom } from 'react-router-dom';
import { Breadcrumbs, Link, Typography } from '@mui/material';

import DocPageView from './DocPageView';
import DocPageEdit from './DocPageEdit';
import { valid_categories } from '../../utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
    getCategorizedDocumentationPage,
    updateDocumentationPage
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import { useTranslation } from 'react-i18next';
import { Role } from '@taiger-common/core';

const Documentation = (props) => {
    const { category } = useParams();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [documentationState, setDocumentationState] = useState({
        error: '',
        isLoaded: false,
        success: false,
        editorState: null,
        isEdit: false,
        author: '',
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });
    useEffect(() => {
        getCategorizedDocumentationPage(category).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    var initialEditorState = null;
                    const author = data.author;
                    if (data.text) {
                        initialEditorState = JSON.parse(data.text);
                    } else {
                        initialEditorState = { time: new Date(), blocks: [] };
                    }
                    // initialEditorState = JSON.parse(data.text);

                    setDocumentationState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        editorState: initialEditorState,
                        author,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setDocumentationState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setDocumentationState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    }, [category]);

    const handleClickEditToggle = () => {
        setDocumentationState((prevState) => ({
            ...prevState,
            isEdit: !documentationState.isEdit
        }));
    };
    const handleClickSave = (e, doc_title, editorState) => {
        e.preventDefault();
        const message = JSON.stringify(editorState);
        const msg = {
            category: category,
            title: doc_title,
            prop: props.item,
            text: message
        };
        updateDocumentationPage(category, msg).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setDocumentationState((prevState) => ({
                        ...prevState,
                        success,
                        document_title: data.title,
                        editorState,
                        isEdit: !documentationState.isEdit,
                        author: data.author,
                        isLoaded: true,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setDocumentationState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setDocumentationState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
        setDocumentationState((prevState) => ({
            ...prevState,
            in_edit_mode: false
        }));
    };

    const ConfirmError = () => {
        setDocumentationState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    if (
        user.role !== Role.Admin &&
        user.role !== Role.Editor &&
        user.role !== Role.Agent &&
        user.role !== Role.Student
    ) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const {
        res_status,
        editorState,
        isLoaded,
        res_modal_status,
        res_modal_message
    } = documentationState;

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    if (!isLoaded || !editorState) {
        return <Loading />;
    }

    const category_name = valid_categories.find(
        (categorie) => categorie.key === category
    ).value;
    TabTitle(`Doc: ${category_name}`);
    return (
        <>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Typography color="text.primary">
                    {t('Documentation', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">{category_name}</Typography>
            </Breadcrumbs>
            {documentationState.isEdit ? (
                <DocPageEdit
                    category="category"
                    document={document}
                    document_title={documentationState.document_title}
                    editorState={documentationState.editorState}
                    handleClickEditToggle={handleClickEditToggle}
                    handleClickSave={handleClickSave}
                    isLoaded={isLoaded}
                />
            ) : (
                <DocPageView
                    author={documentationState.author}
                    document={document}
                    document_title={documentationState.document_title}
                    editorState={documentationState.editorState}
                    handleClickEditToggle={handleClickEditToggle}
                    isLoaded={isLoaded}
                    user={user}
                />
            )}
        </>
    );
};

export default Documentation;
