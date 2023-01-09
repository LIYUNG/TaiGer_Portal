import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Button, Card, Modal, Form } from 'react-bootstrap';
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
    error: null,
    isLoaded: false,
    coursesdata: {},
    analysis: {},
    confirmModalWindowOpen: false,
    analysisSuccessModalWindowOpen: false,
    success: false,
    student: null,
    file: '',
    study_group: '',
    analyzed_course: '',
    expand: true,
    isAnalysing: false,
    isUpdating: false,
    isDownloading: false,
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

        const actualFileName = decodeURIComponent(
          resp.headers['content-disposition'].split('"')[1]
        ); //  檔名中文亂碼 solved
        const { data: blob } = resp;
        if (blob.size === 0) return;
        convertBlobToBase64(blob).then((data) => {
          readDataFormExcel(data);
        //   const wb = XLSX.read(data);
        //   console.log(wb.SheetNames);
        //   console.log(wb);
        });
        return blob;
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: message,
          isUpdating: false
        }));
      }
    );
  }, []);

  const convertBlobToBase64 = async (blob) => {
    // blob data
    return await blobToBase64(blob);
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFile = async (blob) => {
    if (!blob) return;
    const data = await blob.arrayBuffer();
    const mySheetData = readDataFormExcel(data);
  };
  const readDataFormExcel = (data) => {
    const wb = XLSX.read(data);
    console.log(wb);
    for (let i = 0; i < wb.SheetNames.length; i += 1) {
      console.log(wb.SheetNames[i]);
    }
  };
  const ConfirmError = () => {
    setStatedata((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const onAnalyse = () => {
    if (statedata.study_group === '') {
      alert('Please select study group');
      return;
    }
    setStatedata((state) => ({
      ...state,
      isAnalysing: true
    }));
    transcriptanalyser_test(
      statedata.student._id.toString(),
      statedata.study_group
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            analysis: data,
            analysisSuccessModalWindowOpen: true,
            success: success,
            isAnalysing: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStatedata((state) => ({
            ...state,
            isLoaded: true,
            isAnalysing: false,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setStatedata((state) => ({
          ...state,
          isLoaded: true,
          isAnalysing: false
        }));
        alert(
          'Make sure that you updated your courses and your credits are number!'
        );
      }
    );
  };

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
                    {statedata.student.firstname} {statedata.student.lastname}{' '}
                    Courses
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
                    Please fill the courses you have taken. (Ignore if you are
                    high school student)
                  </p>
                  <p>
                    <b>Only Bachelor's courses </b>are considered in this table.
                  </p>
                </Col>
              </Row>
              <br />
              <DataSheetGrid
                height={6000}
                disableContextMenu={true}
                disableExpandSelection={false}
                headerRowHeight={30}
                rowHeight={25}
                value={statedata.coursesdata}
                autoAddRow={true}
                onChange={onChange}
                columns={columns}
              />
              <Row className="my-2">
                <Col>Last update at: {convertDate(statedata.updatedAt)}</Col>
              </Row>
              <Row className="mx-1">
                {showButtonIfMyStudentB(props.user, statedata.student) && (
                  <Button onClick={onSubmit} disabled={statedata.isUpdating}>
                    {statedata.isUpdating ? 'Updating' : 'Update'}
                  </Button>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Aux>
  );
}
