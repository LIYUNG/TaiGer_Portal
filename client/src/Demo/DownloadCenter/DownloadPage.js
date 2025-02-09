import React, { useEffect, useState } from 'react';
import {
    Box,
    Breadcrumbs,
    Card,
    CircularProgress,
    Link,
    Typography
} from '@mui/material';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    is_TaiGer_Admin,
    is_TaiGer_Agent,
    is_TaiGer_Editor,
    is_TaiGer_Student
} from '@taiger-common/core';

import EditDownloadFiles from './EditDownloadFiles';
import { templatelist } from '../../utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { deleteTemplateFile, getTemplates, uploadtemplate } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import Banner from '../../components/Banner/Banner';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';

const DownloadPage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [downloadPageState, setDownloadPageState] = useState({
        error: '',
        file: '',
        isLoaded: false,
        areLoaded: {},
        templates: null,
        success: false,
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });
    useEffect(() => {
        getTemplates().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    let areLoaded_temp = {};
                    for (let i = 0; i < templatelist.length; i++) {
                        areLoaded_temp[templatelist[i].prop] = true;
                    }
                    setDownloadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true, //false to reload everything
                        templates: data,
                        success: success,
                        res_status: status,
                        areLoaded: areLoaded_temp
                    }));
                } else {
                    setDownloadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status,
                        areLoaded: {}
                    }));
                }
            },
            (error) => {
                setDownloadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, []);

    const onFileChange = (e) => {
        setDownloadPageState((prevState) => ({
            ...prevState,
            file: e.target.files[0]
        }));
    };

    const onSubmitFile = (e, category) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', downloadPageState.file);
        let areLoaded_temp = { ...downloadPageState.areLoaded };
        areLoaded_temp[category] = false;
        setDownloadPageState({ areLoaded: areLoaded_temp });
        uploadtemplate(category, formData).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    areLoaded_temp[category] = true;
                    let templates_temp = [...downloadPageState.templates];
                    templates_temp.push(data);
                    setDownloadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        templates: templates_temp,
                        success: success,
                        areLoaded: areLoaded_temp,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setDownloadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        areLoaded: areLoaded_temp,
                        res_modal_status: status,
                        res_modal_message: message
                    }));
                }
            },
            (error) => {
                setDownloadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    areLoaded: areLoaded_temp,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const submitFile = (e, docName) => {
        if (downloadPageState.file === '') {
            e.preventDefault();
            alert('Please select file');
        } else {
            e.preventDefault();
            onSubmitFile(e, docName);
        }
    };

    const onDeleteTemplateFile = (e, category) => {
        e.preventDefault();
        deleteTemplateFile(category).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                //TODO: backend logic
                if (success) {
                    setDownloadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true, //false to reload everything
                        templates: data,
                        success: success,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setDownloadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_status: status,
                        res_modal_message: message
                    }));
                }
            },
            (error) => {
                setDownloadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const ConfirmError = () => {
        setDownloadPageState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    if (
        !is_TaiGer_Admin(user) &&
        !is_TaiGer_Editor(user) &&
        !is_TaiGer_Agent(user) &&
        !is_TaiGer_Student(user)
    ) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(t('Download Center', { ns: 'common' }));
    const { res_status, isLoaded, res_modal_status, res_modal_message } =
        downloadPageState;

    if (!isLoaded && !downloadPageState.templates) {
        return <CircularProgress />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    return (
        <Box>
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
                    {t('Download Center', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Box>
                <Card>
                    <Banner
                        ReadOnlyMode={true}
                        bg="primary"
                        link_name="Read More"
                        notification_key={undefined}
                        path={`${DEMO.CV_ML_RL_DOCS_LINK}`}
                        removeBanner={null}
                        text={`This is ${appConfig.companyName} templates helping you finish your CV ML RL tasks. Please download, fill and upload them to the corresponding task.`}
                        title="info"
                    />

                    <EditDownloadFiles
                        areLoaded={downloadPageState.areLoaded}
                        onDeleteTemplateFile={onDeleteTemplateFile}
                        onFileChange={onFileChange}
                        submitFile={submitFile}
                        templatelist={templatelist}
                        templates={downloadPageState.templates}
                        user={user}
                    />
                </Card>
            </Box>
        </Box>
    );
};

export default DownloadPage;
