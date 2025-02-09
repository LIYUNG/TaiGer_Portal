import React, { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { is_TaiGer_role } from '@taiger-common/core';

import DocPageView from './DocPageView';
import DocPageEdit from './DocPageEdit';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
    getInternalDocumentationPage,
    updateInternalDocumentationPage
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';

const InternaldocsPage = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [internalDocsPageState, setInternalDocsPageState] = useState({
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
        getInternalDocumentationPage().then(
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

                    setInternalDocsPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        editorState: initialEditorState,
                        author,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setInternalDocsPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setInternalDocsPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, []);

    const handleClickEditToggle = () => {
        setInternalDocsPageState((prevState) => ({
            ...prevState,
            isEdit: !internalDocsPageState.isEdit
        }));
    };
    const handleClickSave = (e, doc_title, editorState) => {
        e.preventDefault();
        const message = JSON.stringify(editorState);
        const msg = {
            category: 'internal',
            title: doc_title,
            prop: props.item,
            text: message
        };
        updateInternalDocumentationPage(msg).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setInternalDocsPageState((prevState) => ({
                        ...prevState,
                        success,
                        document_title: data.title,
                        editorState,
                        isEdit: !internalDocsPageState.isEdit,
                        author: data.author,
                        isLoaded: true,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setInternalDocsPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setInternalDocsPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
        setInternalDocsPageState((prevState) => ({
            ...prevState,
            in_edit_mode: false
        }));
    };

    const ConfirmError = () => {
        setInternalDocsPageState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    const {
        res_status,
        editorState,
        isLoaded,
        res_modal_status,
        res_modal_message
    } = internalDocsPageState;

    if (!isLoaded || !editorState) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }
    TabTitle(t('Internal Documentation', { ns: 'common' }));
    return (
        <>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
            <Alert severity="info">
                {t('Internal Documentation', { ns: 'common' })}
            </Alert>
            {internalDocsPageState.isEdit ? (
                <DocPageEdit
                    category="category"
                    document={document}
                    document_title={internalDocsPageState.document_title}
                    editorState={internalDocsPageState.editorState}
                    handleClickEditToggle={handleClickEditToggle}
                    handleClickSave={handleClickSave}
                    isLoaded={isLoaded}
                />
            ) : (
                <DocPageView
                    author={internalDocsPageState.author}
                    document={document}
                    document_title={internalDocsPageState.document_title}
                    editorState={internalDocsPageState.editorState}
                    handleClickEditToggle={handleClickEditToggle}
                    isLoaded={isLoaded}
                    user={user}
                />
            )}
        </>
    );
};

export default InternaldocsPage;
