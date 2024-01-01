import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Tab, Tabs } from 'react-bootstrap';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import * as XLSX from 'xlsx/xlsx.mjs';
import { useTranslation } from 'react-i18next';

import Aux from '../../hoc/_Aux';
import { convertDate, spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import 'react-datasheet-grid/dist/style.css';

import {
  analyzedFileDownload_test,
  WidgetanalyzedFileDownload
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { Link } from 'react-router-dom';
import DEMO from '../../store/constant';

export default function CourseAnalysis(props) {
  const { t, i18n } = useTranslation();
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: false,
    coursesdata: {},
    analysis: {},
    sheets: {},
    sheetNames: [],
    success: false,
    student: null,
    excel_file: {},
    student_id: '',
    file: '',
    analyzed_course: '',
    isAnalysing: false,
    isUpdating: false,
    isDownloading: false,
    LastModified: '',
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    if (props.match.params.admin_id) {
      WidgetanalyzedFileDownload(props.user._id.toString()).then(
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
                res_modal_status: status,
                isUpdating: false
              }));
            });
          } else {
            const { statusText } = resp;
            setStatedata((state) => ({
              ...state,
              isLoaded: true,
              res_modal_status: status,
              res_modal_message: statusText,
              isUpdating: false
            }));
          }
        },
        (error) => {
          const { statusText } = resp;
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_modal_status: 500,
            res_modal_message: statusText,
            isUpdating: false
          }));
        }
      );
    } else {
      const student_id = props.match.params.student_id
        ? props.match.params.student_id
        : props.user._id.toString();
      analyzedFileDownload_test(student_id).then(
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
                student_id,
                isLoaded: true,
                file_name: actualFileName,
                LastModified,
                sheetNames,
                res_modal_status: status,
                isUpdating: false
              }));
            });
          } else {
            const { statusText } = resp;
            setStatedata((state) => ({
              ...state,
              isLoaded: true,
              res_modal_status: status,
              res_modal_message: statusText,
              isUpdating: false
            }));
          }
        },
        (error) => {
          const { statusText } = resp;
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_modal_status: 500,
            res_modal_message: statusText,
            isUpdating: false
          }));
        }
      );
    }
  }, []);

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
      title: '0'
    },
    {
      ...keyColumn('1', textColumn),
      title: '1'
    },
    {
      ...keyColumn('2', textColumn),
      title: '2'
    },
    { ...keyColumn('3', textColumn), title: '3' },
    { ...keyColumn('4', textColumn), title: '4' },
    { ...keyColumn('5', textColumn), title: '5' },
    { ...keyColumn('6', textColumn), title: '6' }
  ];
  if (!statedata.isLoaded) {
    return (
      <div style={spinner_style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }
  TabTitle(`Student ${statedata.student_name} || Courses Analysis`);
  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }

  return (
    <Aux>
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      <Row className="sticky-top ">
        <Col>
          <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
            <Card.Header text={'dark'}>
              <Card.Title>
                <Row>
                  <Col className="my-0 mx-0 text-light">
                    {!props.match.params.admin_id ? (
                      <Link
                        className="text-warning"
                        to={`$${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                          statedata.student_id,
                          DEMO.PROFILE
                        )}`}
                      >
                        {statedata.student_name}{' '}
                      </Link>
                    ) : (
                      <>{statedata.student_name} </>
                    )}
                    Courses Analysis
                  </Col>
                </Row>
              </Card.Title>
            </Card.Header>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Card className="mb-2 mx-0">
            {/* <Card.Header>
                <Card.Title></Card.Title>
              </Card.Header> */}
            <Card.Body>
              <Row>
                <Col>
                  <p>{t('Course Analysis banner')}</p>
                  <p>{t('Course Analysis description')}</p>
                  <Link to={`${DEMO.COURSES_ANALYSIS_EXPLANATION_LINK}`}>
                    <Button size="sm" className="my-1" variant="secondary">
                      {t('Course Analysis explanation button')}
                    </Button>
                  </Link>
                </Col>
              </Row>
              <br />
              <Button size="sm" onClick={() => onDownload()}>
                {t('Download')} Excel
              </Button>
              <Tabs>
                {statedata.sheetNames.map((sheetName, i) => (
                  <Tab
                    key={`${sheetName}`}
                    eventKey={`${sheetName}`}
                    title={`${sheetName}`}
                  >
                    <DataSheetGrid
                      height={6000}
                      disableContextMenu={true}
                      disableExpandSelection={false}
                      headerRowHeight={30}
                      rowHeight={25}
                      value={statedata.sheets[sheetName]}
                      autoAddRow={true}
                      disabled={true}
                      columns={columns}
                    />
                  </Tab>
                ))}
              </Tabs>
              <Row className="my-2">
                <Col>
                  {t('Last update')} {convertDate(statedata.LastModified)}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Aux>
  );
}
