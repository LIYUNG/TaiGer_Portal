import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer
} from 'recharts';

import ErrorPage from '../../../Utils/ErrorPage';
import ModalMain from '../../../Utils/ModalHandler/ModalMain';
import { spinner_style } from '../../../Utils/contants';

import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { getPrograms } from '../../../../api';
import DEMO from '../../../../store/constant';
import { is_TaiGer_role } from '../../../Utils/checking-functions';

function ProgramDistributionChart({ data, x_key }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={`${x_key}`} />
        <YAxis allowDecimals={false} />
        <Bar
          dataKey="programCount"
          fill="#8884d8"
          label={{ position: 'top' }}
        />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ProgramListVisualization(props) {
  let [tableStates, setTableStates] = useState({
    success: false,
    isloaded: false,
    isAssigning: false,
    isButtonDisable: false,
    error: null,
    modalShowAssignWindow: false,
    modalShowAssignSuccessWindow: false,
    res_modal_status: 0,
    res_modal_message: ''
  });
  let [statedata, setStatedata] = useState({
    success: false,
    programs: null,
    isloaded: false,
    res_modal_status: 0,
    error: '',
    res_status: 0
  });

  if (!is_TaiGer_role(props.user)) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  useEffect(() => {
    getPrograms().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStatedata((state) => ({
            ...state,
            success: success,
            programs: data,
            isloaded: true,
            res_status: status
          }));
        } else {
          setStatedata((state) => ({
            ...state,
            isloaded: true,
            res_status: status
          }));
        }
      },
      (error) =>
        setStatedata((state) => ({
          ...state,
          error,
          isloaded: true
        }))
    );
  }, []);

  const ConfirmError = () => {
    setTableStates((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
    setStatedata((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  // const data = React.useMemo(() => makeData(100000), []);
  if (!statedata.isloaded && !statedata.programs) {
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

  // Create a new array to store the output data
  const outputDataByCountry = [];
  const outputDataBySchool = [];
  const outputDataByLang = [];
  const outputDataByDegree = [];
  const outputDataByUpdate = [];
  const outputDataByWhoUpdate = [];

  // Use a Map to count occurrences of each country
  const countryCountMap = new Map();
  const schoolCountMap = new Map();
  const langCountMap = new Map();
  const degreeCountMap = new Map();
  const updatedAtCountMap = new Map();
  const whoUpdatedCountMap = new Map();
  statedata.programs.forEach((entry) => {
    const country = entry.country;

    if (countryCountMap.has(country)) {
      countryCountMap.set(country, countryCountMap.get(country) + 1);
    } else {
      countryCountMap.set(country, 1);
    }
  });
  statedata.programs.forEach((entry) => {
    const school = entry.school;

    if (schoolCountMap.has(school)) {
      schoolCountMap.set(school, schoolCountMap.get(school) + 1);
    } else {
      schoolCountMap.set(school, 1);
    }
  });
  statedata.programs.forEach((entry) => {
    const lang = entry.lang;

    if (langCountMap.has(lang)) {
      langCountMap.set(lang, langCountMap.get(lang) + 1);
    } else {
      langCountMap.set(lang, 1);
    }
  });
  statedata.programs.forEach((entry) => {
    const degree = entry.degree;

    if (degreeCountMap.has(degree)) {
      degreeCountMap.set(degree, degreeCountMap.get(degree) + 1);
    } else {
      degreeCountMap.set(degree, 1);
    }
  });
  statedata.programs.forEach((entry) => {
    const updatedAt = entry.updatedAt?.substring(0, 10); // get date only

    if (updatedAtCountMap.has(updatedAt)) {
      updatedAtCountMap.set(updatedAt, updatedAtCountMap.get(updatedAt) + 1);
    } else {
      updatedAtCountMap.set(updatedAt, 1);
    }
  });
  statedata.programs.forEach((entry) => {
    const whoupdated = entry.whoupdated?.substring(0, 10); // get date only

    if (whoUpdatedCountMap.has(whoupdated)) {
      whoUpdatedCountMap.set(
        whoupdated,
        whoUpdatedCountMap.get(whoupdated) + 1
      );
    } else {
      whoUpdatedCountMap.set(whoupdated, 1);
    }
  });

  countryCountMap.forEach((count, country) => {
    outputDataByCountry.push({ country: `${country}`, programCount: count });
  });
  schoolCountMap.forEach((count, school) => {
    outputDataBySchool.push({ school: `${school}`, programCount: count });
  });
  langCountMap.forEach((count, lang) => {
    outputDataByLang.push({ lang: `${lang}`, programCount: count });
  });
  degreeCountMap.forEach((count, degree) => {
    outputDataByDegree.push({ degree: `${degree}`, programCount: count });
  });
  updatedAtCountMap.forEach((count, updatedAt) => {
    outputDataByUpdate.push({ updatedAt: `${updatedAt}`, programCount: count });
  });
  whoUpdatedCountMap.forEach((count, whoupdated) => {
    outputDataByWhoUpdate.push({
      whoupdated: `${whoupdated}`,
      programCount: count
    });
  });

  return (
    <>
      {tableStates.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={tableStates.res_modal_status}
          res_modal_message={tableStates.res_modal_message}
        />
      )}
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      <Card>
        <Card.Header text={'dark'}>
          <Card.Title>
            <Row>
              <Col className="my-0 mx-0">TaiGer ProgramList Distribution</Col>
            </Row>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          By Country:
          <ProgramDistributionChart
            data={outputDataByCountry}
            x_key="country"
          />
          By School:
          <ProgramDistributionChart data={outputDataBySchool} x_key="school" />
          By Language:
          <ProgramDistributionChart data={outputDataByLang} x_key="lang" />
          By Degree:
          <ProgramDistributionChart data={outputDataByDegree} x_key="degree" />
          By Last Update:
          <ProgramDistributionChart
            data={outputDataByUpdate.sort((a, b) =>
              a.updatedAt < b.updatedAt ? -1 : 1
            )}
            x_key="updatedAt"
          />
          By Who Updates
          <ProgramDistributionChart
            data={outputDataByWhoUpdate.sort((a, b) =>
              a.whoupdated < b.whoupdated ? -1 : 1
            )}
            x_key="whoupdated"
          />
        </Card.Body>
      </Card>
      {/* <>
        {statedata.programs.map((program, i) => (
          <>{program.school}</>
        ))}
      </> */}
    </>
  );
}

export default ProgramListVisualization;
