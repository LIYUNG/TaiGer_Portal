import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as LinkDom, useParams } from 'react-router-dom';

import SingleDocEdit from './SingleDocEdit';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getDocumentation, updateDocumentation } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { documentation_categories } from '../../utils/contants';
import DocPageView from './DocPageView';

const SingleDoc = (props) => {
    const { documentation_id } = useParams();
    const [singleDocState, setSingleDocState] = useState({
        error: '',
        author: '',
        isLoaded: false,
        success: false,
        editorState: null,
        isEdit: false,
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });
    useEffect(() => {
        getDocumentation(documentation_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (!data) {
                    setSingleDocState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: 404
                    }));
                    return;
                }
                if (success) {
                    var initialEditorState = null;
                    const author = data?.author;
                    if (data?.text) {
                        initialEditorState = JSON.parse(data.text);
                    } else {
                        initialEditorState = {};
                    }
                    // initialEditorState = JSON.parse(data.text);
                    setSingleDocState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        document_title: data?.title,
                        category: data?.category,
                        editorState: initialEditorState,
                        author,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setSingleDocState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setSingleDocState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, [documentation_id]);

    const handleClickEditToggle = () => {
        setSingleDocState((prevState) => ({
            ...prevState,
            isEdit: !singleDocState.isEdit
        }));
    };
    const handleClickSave = (e, category, doc_title, editorState) => {
        e.preventDefault();
        const message = JSON.stringify(editorState);
        const msg = {
            title: doc_title,
            category,
            prop: props.item,
            text: message
        };
        updateDocumentation(documentation_id, msg).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setSingleDocState((prevState) => ({
                        ...prevState,
                        success,
                        document_title: data.title,
                        editorState,
                        isEdit: !singleDocState.isEdit,
                        author: data.author,
                        isLoaded: true,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setSingleDocState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setSingleDocState({ error });
            }
        );
        setSingleDocState((prevState) => ({
            ...prevState,
            in_edit_mode: false
        }));
    };

    const ConfirmError = () => {
        setSingleDocState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const {
        res_status,
        editorState,
        isLoaded,
        res_modal_status,
        res_modal_message
    } = singleDocState;

    if (!isLoaded && !editorState) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }
    TabTitle(`Doc: ${singleDocState.document_title}`);
    if (singleDocState.isEdit) {
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
                    <Link
                        color="inherit"
                        component={LinkDom}
                        to={`${DEMO.DOCS_ROOT_LINK(singleDocState.category)}`}
                        underline="hover"
                    >
                        {documentation_categories[singleDocState.category]}
                    </Link>
                    <Typography color="text.primary">
                        {singleDocState.document_title}
                    </Typography>
                </Breadcrumbs>
                <SingleDocEdit
                    author={singleDocState.author}
                    category={singleDocState.category}
                    document={document}
                    document_title={singleDocState.document_title}
                    editorState={singleDocState.editorState}
                    handleClickEditToggle={handleClickEditToggle}
                    handleClickSave={handleClickSave}
                    isLoaded={isLoaded}
                />
            </>
        );
    } else {
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
                    <Link
                        color="inherit"
                        component={LinkDom}
                        to={`${DEMO.DOCS_ROOT_LINK(singleDocState.category)}`}
                        underline="hover"
                    >
                        {documentation_categories[singleDocState.category]}
                    </Link>
                    <Typography color="text.primary">
                        {singleDocState.document_title}
                    </Typography>
                </Breadcrumbs>
                <DocPageView
                    author={singleDocState.author}
                    category={singleDocState.category}
                    document={document}
                    document_title={singleDocState.document_title}
                    editorState={singleDocState.editorState}
                    handleClickEditToggle={handleClickEditToggle}
                />
            </>
        );
    }
};
export default SingleDoc;
