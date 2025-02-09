import React, { useEffect, useState } from 'react';
import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Link,
    TextField,
    Typography
} from '@mui/material';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { is_TaiGer_role } from '@taiger-common/core';

import ErrorPage from '../Utils/ErrorPage';
import { TaiGerAiGeneral2 } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

const CVMLRLGenerator = () => {
    const { user } = useAuth();
    const [cVMLRLGeneratorState, setCVMLRLGeneratorState] = useState({
        error: '',
        role: '',
        isLoaded: false,
        isGenerating: false,
        data: '',
        success: false,
        prompt: '',
        res_status: 0
    });

    useEffect(() => {
        setCVMLRLGeneratorState((prevState) => ({
            ...prevState,
            isLoaded: true
        }));
    }, []);

    const onSubmit = async () => {
        setCVMLRLGeneratorState((prevState) => ({
            ...prevState,
            isGenerating: true
        }));
        const response = await TaiGerAiGeneral2(
            JSON.stringify(cVMLRLGeneratorState.prompt)
        );
        // Handle the streaming data
        const reader = response.body
            .pipeThrough(new TextDecoderStream())
            .getReader();

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }
            setCVMLRLGeneratorState((prevState) => ({
                ...prevState,
                data: prevState.data + value
            }));
        }
        setCVMLRLGeneratorState((prevState) => ({
            ...prevState,
            isLoaded: true,
            data: prevState.data + ' \n ================================= \n',
            isGenerating: false
        }));
    };

    const onChange = (e) => {
        const prompt_temp = e.target.value;
        setCVMLRLGeneratorState((prevState) => ({
            ...prevState,
            prompt: prompt_temp
        }));
    };
    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(`${appConfig.companyName} AI Playground`);
    const { res_status, isLoaded } = cVMLRLGeneratorState;

    if (!isLoaded) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    return (
        <Box>
            {!isLoaded ? <Loading /> : null}
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
                    {appConfig.companyName} AI Playground
                </Typography>
            </Breadcrumbs>
            <TextField
                fullWidth
                minRows={6}
                multiline
                onChange={onChange}
                placeholder="How many train stations in Germany?"
                size="small"
                sx={{ my: 2 }}
            />
            <br />
            <Button
                color="primary"
                disabled={cVMLRLGeneratorState.isGenerating}
                onClick={onSubmit}
                sx={{ mb: 2 }}
                variant="contained"
            >
                {cVMLRLGeneratorState.isGenerating ? (
                    <CircularProgress size={16} />
                ) : (
                    'Submit'
                )}
            </Button>
            <Typography variant="p">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {cVMLRLGeneratorState.data}
                </ReactMarkdown>
            </Typography>
        </Box>
    );
};

export default CVMLRLGenerator;
