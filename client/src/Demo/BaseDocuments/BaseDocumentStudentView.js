import React, { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DocumentStatusType, PROFILE_NAME } from '@taiger-common/core';

import ModalMain from '../Utils/ModalHandler/ModalMain';
import { SYMBOL_EXPLANATION } from '../../utils/contants';
import { updateDocumentationHelperLink } from '../../api';
import Loading from '../../components/Loading/Loading';
import MyDocumentCard from './MyDocumentCard';

const BaseDocumentStudentView = ({ student, base_docs_link }) => {
    const { t } = useTranslation();

    const [baseDocumentStudentViewState, setBaseDocumentStudentViewState] =
        useState({
            error: '',
            student: student,
            student_id: '',
            isLoaded: {},
            ready: false,
            file: '',
            deleteFileWarningModel: false,
            res_status: 0,
            res_modal_status: ''
        });

    useEffect(() => {
        let keys2 = Object.keys(PROFILE_NAME);
        let temp_isLoaded = {};
        for (let i = 0; i < keys2.length; i++) {
            temp_isLoaded[keys2[i]] = true;
        }
        setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            isLoaded: temp_isLoaded,
            student: student,
            ready: true
        }));
    }, [student._id.toString()]);

    const ConfirmError = () => {
        setBaseDocumentStudentViewState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const updateDocLink = (link, key) => {
        updateDocumentationHelperLink(link, key, 'base-documents').then(
            (resp) => {
                const { helper_link, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setBaseDocumentStudentViewState((prevState) => ({
                        ...prevState,
                        isLoaded2: true,
                        base_docs_link: helper_link,
                        success: success,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setBaseDocumentStudentViewState((prevState) => ({
                        ...prevState,
                        isLoaded2: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setBaseDocumentStudentViewState((prevState) => ({
                    ...prevState,
                    error,
                    isLoaded2: true,
                    res_modal_message: '',
                    res_modal_status: 500
                }));
            }
        );
    };

    const { res_modal_status, res_modal_message, ready } =
        baseDocumentStudentViewState;
    if (!ready) {
        return <Loading />;
    }
    let profile_wtih_doc_link_list_key = Object.keys(PROFILE_NAME);
    let object_init = {};
    let object_message = {};
    let object_time_init = {};
    profile_wtih_doc_link_list_key.forEach((key) => {
        object_init[key] = { status: DocumentStatusType.Missing, link: '' };
        object_message[key] = '';
        object_time_init[key] = '';
    });
    // TODO: what if baseDocumentStudentViewState.student.profile[i].name key not in base_docs_link[i].key?
    if (base_docs_link) {
        base_docs_link.forEach((baseDoc) => {
            if (object_init[baseDoc.key]) {
                object_init[baseDoc.key].link = baseDoc.link;
            }
        });
    }
    if (baseDocumentStudentViewState.student.profile) {
        baseDocumentStudentViewState.student.profile.forEach((profile) => {
            let document_split = profile.path.replace(/\\/g, '/');
            let document_name = document_split.split('/')[1];

            switch (profile.status) {
                case DocumentStatusType.Uploaded:
                case DocumentStatusType.Accepted:
                case DocumentStatusType.Rejected:
                    object_init[profile.name].status = profile.status;
                    object_init[profile.name].document_name = document_name;
                    break;
                case DocumentStatusType.NotNeeded:
                case DocumentStatusType.Missing:
                    object_init[profile.name].status = profile.status;
                    object_init[profile.name].document_name = '';
                    break;
            }

            object_message[profile.name] = profile.feedback || '';
            object_time_init[profile.name] = profile.updatedAt;
        });
    }
    const myDocumentsCard = profile_wtih_doc_link_list_key.map(
        (category, i) => (
            <MyDocumentCard
                category={category}
                docName={PROFILE_NAME[category]}
                document_name={object_init[category].document_name}
                isLoaded={baseDocumentStudentViewState.isLoaded[category]}
                key={i + 1}
                link={object_init[category].link}
                message={object_message[category]}
                status={object_init[category].status}
                student={baseDocumentStudentViewState.student}
                time={object_time_init[category]}
                updateDocLink={updateDocLink}
            />
        )
    );

    return (
        <Box>
            <Alert severity="info">
                {t('file-upload-notice', { ns: 'common' })}
            </Alert>
            <Alert severity="info">
                {t('required-document-notice', { ns: 'common' })}
            </Alert>
            {myDocumentsCard}
            {SYMBOL_EXPLANATION}
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
        </Box>
    );
};

export default BaseDocumentStudentView;
