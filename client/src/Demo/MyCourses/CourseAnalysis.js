import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Breadcrumbs,
  Link,
  Typography,
  Select,
  MenuItem,
  TableContainer
} from '@mui/material';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import * as XLSX from 'xlsx/xlsx.mjs';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, useNavigate, useParams } from 'react-router-dom';
import 'react-datasheet-grid/dist/style.css';
import { is_TaiGer_role } from '@taiger-common/core';

import { convertDate } from '../Utils/contants';
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
  const { admin_id, student_id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
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
    if (admin_id) {
      WidgetanalyzedFileDownload(user._id.toString()).then(
        (resp) => {
          // TODO: timeout? success?
          const { status } = resp;
          if (status < 300) {
            const actualFileName = decodeURIComponent(
              resp.headers['content-disposition'].split('"')[1]
            );
            const student_name_temp = `Pre-Customer`;
            const { data: blob } = resp;
            if (blob.size === 0) return;
            handleFile(blob).then((wb) => {
              const { mySheetData: sheets, ModifiedDate: LastModified } =
                readDataFormExcel(wb);
              const sheetNames = Object.keys(sheets);
              setStatedata((state) => ({
                ...state,
                sheets,
                student_name: student_name_temp,
                excel_file: blob,
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
    } else {
      const studentId = student_id || user._id.toString();
      analyzedFileDownload_test(studentId).then(
        (resp) => {
          // TODO: timeout? success?
          const { status } = resp;
          if (status < 300) {
            const actualFileName = decodeURIComponent(
              resp.headers['content-disposition'].split('"')[1]
            );
            const temp = actualFileName.split('_');
            const lastname = temp[3].split('.');
            const student_name_temp = `${temp[2]} - ${lastname[0]}`;
            const { data: blob } = resp;
            if (blob.size === 0) return;
            handleFile(blob).then((wb) => {
              const { mySheetData: sheets, ModifiedDate: LastModified } =
                readDataFormExcel(wb);
              const sheetNames = Object.keys(sheets);
              setStatedata((state) => ({
                ...state,
                sheets,
                student_name: student_name_temp,
                excel_file: blob,
                studentId,
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
    }
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
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        {is_TaiGer_role(user) && (
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              statedata.studentId,
              DEMO.PROFILE_HASH
            )}`}
          >
            {statedata.student_name}
          </Link>
        )}
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={
            !admin_id
              ? `${DEMO.COURSES_INPUT_LINK(statedata.studentId)}`
              : '/internal/widgets/course-analyser'
          }
        >
          {t('My Courses')}
        </Link>
        <Typography color="text.primary">{t('Courses Analysis')}</Typography>
      </Breadcrumbs>
      {/* <Card sx={{ p: 2 }}> */}
      <Typography variant="body1" sx={{ pt: 2 }}>
        {t('Course Analysis banner', { ns: 'courses' })}
      </Typography>
      <Typography variant="body1" sx={{ py: 2 }}>
        {t('Course Analysis description', { ns: 'courses' })}
      </Typography>
      <Button
        size="small"
        color="primary"
        variant="contained"
        onClick={() => navigate(DEMO.COURSES_ANALYSIS_EXPLANATION_LINK)}
        sx={{ mr: 2 }}
      >
        {t('Course Analysis explanation button')}
      </Button>
      <Button
        size="small"
        color="secondary"
        variant="contained"
        onClick={() => onDownload()}
      >
        {t('Download', { ns: 'common' })} Excel
      </Button>
      <Typography variant="body1" sx={{ pt: 2, pb: 1 }}>
        {t('Programs')}:
      </Typography>
      <Select
        fullWidth
        size="small"
        value={value}
        onChange={handleChange}
        aria-label="course analysis tabs"
        sx={{ mb: 2 }}
      >
        {statedata.sheetNames.map((sheetName, i) => (
          <MenuItem key={sheetName} value={i}>
            {sheetName}
          </MenuItem>
        ))}
      </Select>
      <TableContainer style={{ overflowX: 'auto' }}>
        <DataSheetGrid
          ref={ref}
          height={6000}
          style={{ minWidth: '450px' }}
          disableContextMenu={true}
          disableExpandSelection={false}
          headerRowHeight={30}
          rowHeight={25}
          value={statedata.sheets[statedata.sheetNames[value]]}
          // autoAddRow={true}
          disabled={true}
          columns={columns}
        />
      </TableContainer>
      {t('Last update', { ns: 'common' })} {convertDate(statedata.LastModified)}
      {/* </Card> */}
    </Box>
  );
}
