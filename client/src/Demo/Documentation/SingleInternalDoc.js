import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { is_TaiGer_role } from '@taiger-common/core';

import SingleDocEdit from './SingleDocEdit';
import ErrorPage from '../Utils/ErrorPage';

import {
    updateInternalDocumentation,
    getInternalDocumentation
} from '../../api';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import DocPageView from './DocPageView';

const SingleDoc = (props) => {
    const { documentation_id } = useParams();
    const { user } = useAuth();
    const [singleInternalDocState, setSingleInternalDocState] = useState({
        error: '',
        isLoaded: false,
        success: false,
        editorState: null,
        isEdit: false,
        internal: false,
        res_status: 0
    });

    useEffect(() => {
        getInternalDocumentation(documentation_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (!data) {
                    setSingleInternalDocState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        pagenotfounderror: true
                    }));
                }
                if (success) {
                    var initialEditorState = null;
                    const author = data.author;
                    if (data.text) {
                        initialEditorState = JSON.parse(data.text);
                    } else {
                        initialEditorState = {};
                    }
                    initialEditorState = JSON.parse(data.text);
                    setSingleInternalDocState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        document_title: data.title,
                        category: data.category,
                        internal: data.internal,
                        editorState: initialEditorState,
                        author,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setSingleInternalDocState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setSingleInternalDocState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error: error
                }));
            }
        );
    }, []);

    const handleClickEditToggle = () => {
        setSingleInternalDocState((prevState) => ({
            ...prevState,
            isEdit: !singleInternalDocState.isEdit
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
        updateInternalDocumentation(documentation_id, msg).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setSingleInternalDocState((prevState) => ({
                        ...prevState,
                        success,
                        document_title: data.title,
                        editorState,
                        isEdit: !singleInternalDocState.isEdit,
                        author: data.author,
                        isLoaded: true,
                        res_status: status
                    }));
                } else {
                    setSingleInternalDocState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setSingleInternalDocState((prevState) => ({
                    ...prevState,
                    error
                }));
            }
        );
        setSingleInternalDocState((prevState) => ({
            ...prevState,
            in_edit_mode: false
        }));
    };

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    const { res_status, editorState, isLoaded } = singleInternalDocState;

    if (!isLoaded && !editorState) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    if (singleInternalDocState.isEdit) {
        return (
            <SingleDocEdit
                author={singleInternalDocState.author}
                category={singleInternalDocState.category}
                document={document}
                document_title={singleInternalDocState.document_title}
                editorState={singleInternalDocState.editorState}
                handleClickEditToggle={handleClickEditToggle}
                handleClickSave={handleClickSave}
                internal={singleInternalDocState.internal}
                isLoaded={isLoaded}
            />
        );
    } else {
        return (
            <DocPageView
                author={singleInternalDocState.author}
                category={singleInternalDocState.category}
                document={document}
                document_title={singleInternalDocState.document_title}
                editorState={singleInternalDocState.editorState}
                handleClickEditToggle={handleClickEditToggle}
                internal={singleInternalDocState.internal}
            />
        );
    }
};
export default SingleDoc;
