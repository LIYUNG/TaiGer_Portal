import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Tab, Tabs } from 'react-bootstrap';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import * as XLSX from 'xlsx/xlsx.mjs';

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

export default function CourseAnalysis(props) {
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
                        to={`/student-database/${statedata.student_id}/profile`}
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
                  <p>
                    此份課程分析<b>僅供選課參考</b>
                    。請仔細看過每個向度所缺的課程，並對照學校之後學期是否有開期課程，抓出來，並和您的
                    Agent 討論。
                  </p>
                  <p>
                    The course analysis provided is for{' '}
                    <b>reference purposes only</b>. Please carefully review the
                    courses missing in each category and cross-reference whether
                    your university offers those courses in the upcoming
                    semesters. Once you have identified them, discuss with your
                    Agent.
                  </p>
                  <p>
                    在 General 頁面，為大略依照您主修向度做分類，其餘的 Tabs
                    為指標性學校的課程匹配度分析。你會看到每個學校會要求的向度會不一樣，每個向度會對應一個
                    <b>Required_ECTS</b>，代表你修的課程學分（經過
                    <b>ECTS轉換</b> (1.5x 台灣學分)換算後），必須超過該向度的
                    <b>Required_ECTS</b>
                    才算達到該項度要求。若有缺少學分、向度，請參考每個 Program
                    Tab 表格最右側，每個向度的
                    <b>建議修課</b>名單
                  </p>
                  <p>
                    On the General page, courses are roughly categorized
                    according to your major category, while the remaining tabs
                    provide an analysis of the curriculum match for benchmark
                    programs. You will notice that each school has different
                    requirements for the major course category, and each
                    category corresponds to a <b>Required_ECTS</b>, which
                    represents the credits you need to complete for the courses
                    (<b>ECTS轉換</b>, 1.5 times the credits in Taiwan). You must
                    exceed the <b>Required_ECTS</b> for a specific category to
                    meet the degree requirements. If there are any deficiencies
                    of credits in any categories, please refer to the rightmost
                    column of each Program Tab table for the <b>建議修課</b> for
                    each category.
                  </p>
                  <Link to="/docs/search/64c3817811e606a89a10ea47">
                    <Button variant='secondary'>點我詳細解說</Button>
                  </Link>
                </Col>
              </Row>
              <br />
              <Button onClick={() => onDownload()}>Download Excel</Button>
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
                <Col>Last update at: {convertDate(statedata.LastModified)}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Aux>
  );
}
