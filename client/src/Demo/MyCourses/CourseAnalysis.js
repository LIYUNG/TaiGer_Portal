import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Breadcrumbs,
    Link,
    Typography,
    Select,
    MenuItem,
    TableContainer,
    useTheme
} from '@mui/material';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import * as XLSX from 'xlsx/xlsx.mjs';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, useNavigate, useParams } from 'react-router-dom';
// import 'react-datasheet-grid/dist/style.css';
import './react-datasheet-customize.css';

import { is_TaiGer_role } from '@taiger-common/core';

import { convertDate } from '../../utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
    analyzedFileDownload_test,
    WidgetanalyzedFileDownload
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';

export default function CourseAnalysis() {
    const { user_id } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const theme = useTheme(); // Get the current theme from Material UI

    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    let [statedata, setStatedata] = useState({
        error: '',
        isLoaded: false,
        sheets: {},
        sheetNames: [],
        success: false,
        student: null,
        excel_file: {},
        studentId: '',
        file: '',
        isDownloading: false,
        LastModified: '',
        res_status: 0,
        res_modal_status: 0,
        res_modal_message: ''
    });
    const ref = useRef(null);
    useEffect(() => {
        const isInternal = window.location.href.includes('internal');
        const downloadFn = isInternal
            ? WidgetanalyzedFileDownload
            : analyzedFileDownload_test;

        downloadFn(user_id).then(
            (resp) => {
                // TODO: timeout? success?
                const { status } = resp;
                if (status < 300) {
                    const actualFileName = decodeURIComponent(
                        resp.headers['content-disposition'].split('"')[1]
                    );
                    let student_name_temp = '';
                    if (isInternal) {
                        student_name_temp = `Pre-Customer`;
                    } else {
                        const temp = actualFileName.split('_');
                        const lastname = temp[3].split('.');
                        student_name_temp = `${temp[2]} - ${lastname[0]}`;
                    }

                    const { data: blob } = resp;
                    if (blob.size === 0) return;
                    handleFile(blob).then((wb) => {
                        const {
                            mySheetData: sheets,
                            ModifiedDate: LastModified
                        } = readDataFormExcel(wb);
                        const sheetNames = Object.keys(sheets);
                        setStatedata((state) => ({
                            ...state,
                            sheets,
                            student_name: student_name_temp,
                            excel_file: blob,
                            studentId: user_id,
                            isLoaded: true,
                            file_name: actualFileName,
                            LastModified,
                            sheetNames,
                            res_modal_status: status
                        }));
                    });
                } else {
                    const { statusText } = resp;
                    setStatedata((state) => ({
                        ...state,
                        isLoaded: true,
                        res_modal_status: status,
                        res_modal_message: statusText
                    }));
                }
            },
            (error) => {
                setStatedata((state) => ({
                    ...state,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    }, []);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const readAsArrayBuffer = (blob) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target?.result);
            };
            reader.readAsArrayBuffer(blob);
        });
    };

    const handleFile = async (blob) => {
        if (!blob) return;
        const data = await readAsArrayBuffer(blob);
        // const data = await blob.arrayBuffer();
        return data;
    };

    const onDownload = () => {
        setStatedata((state) => ({
            ...state,
            isDownloading: true
        }));
        // TODO: timeout? success?
        if (statedata.excel_file !== {}) {
            const blob = statedata.excel_file;
            if (blob.size === 0) return;

            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${statedata.file_name}`);
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);
            setStatedata((state) => ({
                ...state,
                isDownloading: false
            }));
        } else {
            setStatedata((state) => ({
                ...state,
                isLoaded: true,
                res_modal_status: 500,
                res_modal_message: 'Please try it later',
                isDownloading: false
            }));
        }
    };

    const readDataFormExcel = (data) => {
        const wb = XLSX.read(data);
        var mySheetData = {};
        for (let i = 0; i < wb.SheetNames.length; i += 1) {
            let sheetName = wb.SheetNames[i];
            const worksheet = wb.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            mySheetData[sheetName] = jsonData;
        }
        return { mySheetData, ModifiedDate: wb.Props.ModifiedDate };
    };
    const ConfirmError = () => {
        setStatedata((state) => ({
            ...state,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const columns = [
        {
            ...keyColumn('0', textColumn),
            title: '0',
            shrink: 0
        },
        {
            ...keyColumn('1', textColumn),
            title: '1',
            shrink: 0
        },
        {
            ...keyColumn('2', textColumn),
            title: '2',
            shrink: 0
        },
        { ...keyColumn('3', textColumn), title: '3', shrink: 0 },
        { ...keyColumn('4', textColumn), title: '4', shrink: 0 },
        { ...keyColumn('5', textColumn), title: '5', shrink: 0 },
        { ...keyColumn('6', textColumn), title: '6', shrink: 0 }
    ];
    if (!statedata.isLoaded) {
        return <Loading />;
    }
    TabTitle(`Student ${statedata.student_name} || Courses Analysis`);
    if (statedata.res_status >= 400) {
        return <ErrorPage res_status={statedata.res_status} />;
    }

    return (
        <Box>
            {statedata.res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={statedata.res_modal_message}
                    res_modal_status={statedata.res_modal_status}
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
                {is_TaiGer_role(user) ? (
                    <Link
                        color="inherit"
                        component={LinkDom}
                        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                            statedata.studentId,
                            DEMO.PROFILE_HASH
                        )}`}
                        underline="hover"
                    >
                        {statedata.student_name}
                    </Link>
                ) : null}
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={
                        !user_id
                            ? `${DEMO.COURSES_INPUT_LINK(statedata.studentId)}`
                            : '/internal/widgets/course-analyser'
                    }
                    underline="hover"
                >
                    {t('My Courses')}
                </Link>
                <Typography color="text.primary">
                    {t('Courses Analysis')}
                </Typography>
            </Breadcrumbs>
            {/* <Card sx={{ p: 2 }}> */}
            <Typography sx={{ pt: 2 }} variant="body1">
                {t('Course Analysis banner', { ns: 'courses' })}
            </Typography>
            <Typography sx={{ py: 2 }} variant="body1">
                {t('Course Analysis description', { ns: 'courses' })}
            </Typography>
            <Button
                color="primary"
                onClick={() => navigate(DEMO.COURSES_ANALYSIS_EXPLANATION_LINK)}
                size="small"
                sx={{ mr: 2 }}
                variant="contained"
            >
                {t('Course Analysis explanation button')}
            </Button>
            <Button
                color="secondary"
                onClick={() => onDownload()}
                size="small"
                variant="contained"
            >
                {t('Download', { ns: 'common' })} Excel
            </Button>
            <Typography sx={{ pt: 2, pb: 1 }} variant="body1">
                {t('Programs')}:
            </Typography>
            <Select
                aria-label="course analysis tabs"
                fullWidth
                onChange={handleChange}
                size="small"
                sx={{ mb: 2 }}
                value={value}
            >
                {statedata.sheetNames.map((sheetName, i) => (
                    <MenuItem key={sheetName} value={i}>
                        {sheetName}
                    </MenuItem>
                ))}
            </Select>
            <TableContainer style={{ overflowX: 'auto' }}>
                <DataSheetGrid
                    columns={columns}
                    disableContextMenu={true}
                    disableExpandSelection={false}
                    disabled={true}
                    headerRowHeight={30}
                    height={6000}
                    ref={ref}
                    rowHeight={25}
                    style={{
                        minWidth: '450px',
                        '--dsg-selection-border-color':
                            theme.palette.text.primary,
                        '--dsg-cell-color': theme.palette.text.primary,
                        '--dsg-cell-background-color':
                            theme.palette.background.default,
                        '--dsg-header-text-color': theme.palette.text.primary,
                        '--dsg-header-active-text-color':
                            theme.palette.text.primary
                    }}
                    value={statedata.sheets[statedata.sheetNames[value]]}
                    // autoAddRow={true}
                />
            </TableContainer>
            {t('Last update', { ns: 'common' })}{' '}
            {convertDate(statedata.LastModified)}
            {/* </Card> */}
        </Box>
    );
}
