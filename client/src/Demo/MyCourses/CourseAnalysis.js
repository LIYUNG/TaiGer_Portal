import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Spinner,
  Button,
  Card,
  Tab,
  Tabs,
  Table
} from 'react-bootstrap';
import { DataSheetGrid, textColumn, keyColumn } from 'react-datasheet-grid';
import * as XLSX from 'xlsx/xlsx.mjs';

import Aux from '../../hoc/_Aux';
import { convertDate, spinner_style, study_group } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { showButtonIfMyStudentB } from '../Utils/checking-functions';
import 'react-datasheet-grid/dist/style.css';

import { analyzedFileDownload_test, transcriptanalyser_test } from '../../api';

export default function CourseAnalysis(props) {
  let [statedata, setStatedata] = useState({
    error: '',
    isLoaded: false,
    coursesdata: {},
    analysis: {},
    confirmModalWindowOpen: false,
    sheets: {},
    sheetNames: [],
    analysisSuccessModalWindowOpen: false,
    success: false,
    student: null,
    excel_file: {},
    file: '',
    study_group: '',
    analyzed_course: '',
    expand: true,
    isAnalysing: false,
    isUpdating: false,
    isDownloading: false,
    LastModified: '',
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
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
        res_modal_message: "Please try it later",
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
                    {statedata.student_name} Courses Analysis
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
                    The courses analysis for each program as reference.{' '}
                    <b>The results are not garanteed.</b>
                  </p>
                  <p>
                    The <b>Required_ECTS</b> means the requirement from the
                    programs. If your converted credits are still less then
                    Required_ECTS. You need to take the recommended courses
                    (建議修課) on the right side.
                  </p>
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
                  //   <Tab eventKey={`${sheetName}`} title={`${sheetName}`}>
                  //     <Table responsive>
                  //       <thead>
                  //         <tr>
                  //           {statedata.sheets[sheetName][0].map((h, j) => (
                  //             <th key={h}>{h}</th>
                  //           ))}
                  //         </tr>
                  //       </thead>
                  //       <tbody>
                  //         {statedata.sheets[sheetName].map((row) => (
                  //           <tr>
                  //             {row.map((c) => (
                  //               <td>{c}</td>
                  //             ))}
                  //           </tr>
                  //         ))}
                  //       </tbody>
                  //     </Table>
                  //   </Tab>
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