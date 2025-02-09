import React, { useState, useEffect } from 'react';
import { Link as LinkDom, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Card,
    Stack,
    Box,
    Link,
    Typography,
    Breadcrumbs,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

import ProgramCompare from './ProgramCompare';
import { getProgramChangeRequests, getProgram } from '../../api/index';

import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { convertDate } from '../../utils/contants';

const CustomBreadcrumbs = ({ program }) => {
    const { t } = useTranslation();
    return (
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
                to={`${DEMO.PROGRAMS}`}
                underline="hover"
            >
                {t('Program List', { ns: 'common' })}
            </Link>
            <Link
                color="inherit"
                component={LinkDom}
                to={`${DEMO.SINGLE_PROGRAM_LINK(program._id)}`}
                underline="hover"
            >
                {`${program.school}-${program.program_name}`}
            </Link>
            <Typography color="text.primary">
                {t('Change Requests', { ns: 'common' })}
            </Typography>
        </Breadcrumbs>
    );
};

const ProgramChangeRequestPage = () => {
    const navigate = useNavigate();
    const { programId } = useParams();
    const [originalProgram, setOriginalProgram] = useState({});
    const [incomingChanges, setIncomingChanges] = useState([]);
    const [changeIndex, setChangeIndex] = useState(0);

    // remove the request from the list after submission
    const removeRequestFn = (requestId) => {
        if (!requestId) return;
        const callbackFn = () => {
            setIncomingChanges((prev) => {
                return [...prev].filter((change) => change._id !== requestId);
            });
            setChangeIndex(0);
            console.log(`submitFn ${requestId}:  done!`);
        };
        return callbackFn;
    };

    useEffect(() => {
        getProgramChangeRequests(programId).then((res) => {
            const { data } = res.data;
            if (!data?.length) {
                navigate(DEMO.SINGLE_PROGRAM_LINK(programId));
            }
            setIncomingChanges(data);
        });
        getProgram(programId).then((res) => {
            const { data } = res.data;
            setOriginalProgram(data);
        });
    }, [programId]);

    return (
        <>
            <CustomBreadcrumbs program={originalProgram} />
            <Box sx={{ my: 3 }}>
                <Card sx={{ padding: 2 }} variant="outlined">
                    <Typography color="text.secondary" variant="caption">
                        <Stack sx={{ mb: 3 }}>
                            <div>School: {originalProgram.school}</div>
                            <div>Program: {originalProgram.program_name}</div>
                            <div>Degree: {originalProgram.degree}</div>
                            <div>Semester: {originalProgram.semester}</div>
                        </Stack>
                    </Typography>

                    <FormControl fullWidth>
                        <InputLabel id="request-select-label">{`Requests (${
                            incomingChanges?.length || 0
                        })`}</InputLabel>
                        <Select
                            id="request-select"
                            label={`Requests (${incomingChanges?.length || 0})`}
                            labelId="request-select-label"
                            onChange={(e) => setChangeIndex(e.target.value)}
                            value={changeIndex}
                        >
                            {incomingChanges.length > 0
                                ? incomingChanges.map((change, index) => {
                                      return (
                                          <MenuItem key={index} value={index}>
                                              {convertDate(change?.updatedAt)} -{' '}
                                              {change.requestedBy
                                                  ? `${change.requestedBy.firstname} ${change.requestedBy.lastname} `
                                                  : 'External Source'}
                                          </MenuItem>
                                      );
                                  })
                                : null}
                        </Select>
                    </FormControl>
                </Card>
            </Box>
            <ProgramCompare
                incomingChanges={incomingChanges[changeIndex] || {}}
                originalProgram={originalProgram || {}}
                submitCallBack={removeRequestFn(
                    incomingChanges[changeIndex]?._id
                )}
            />
        </>
    );
};
export default ProgramChangeRequestPage;
