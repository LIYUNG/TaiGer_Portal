import React from 'react';
import { Card, Spinner, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import {
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  Cell,
  ResponsiveContainer,
  Legend,
  Label
} from 'recharts';

import Aux from '../../../hoc/_Aux';
import { spinner_style } from '../../Utils/contants';
import ErrorPage from '../../Utils/ErrorPage';
import {
  frequencyDistribution,
  is_TaiGer_role,
  numStudentYearDistribution,
  open_tasks_with_editors,
  programs_refactor
} from '../../Utils/checking-functions';

import { getStatistics } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import TasksDistributionBarChart from '../../../components/Charts/TasksDistributionBarChart';
import ProgramListVisualization from './ProgramListVisualization.js';
import { appConfig } from '../../../config';

class InternalDashboard extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    teams: null,
    students: null,
    documents: null,
    students_details: null,
    finished_docs: null,
    agents: null,
    editors: null,
    res_status: 0
  };

  componentDidMount() {
    getStatistics().then(
      (resp) => {
        const {
          data,
          success,
          students,
          agents,
          editors,
          finished_docs,
          documents,
          students_details
        } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            teams: data,
            students: students,
            documents: documents,
            agents: agents,
            editors: editors,
            finished_docs,
            students_details,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(`${appConfig.companyName} Dashboard`);
    const {
      res_status,
      isLoaded,
      students,
      finished_docs,
      documents,
      agents,
      editors,
      students_details
    } = this.state;

    if (
      !isLoaded &&
      !this.state.teams &&
      !this.state.students &&
      !this.state.documents
    ) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    const colors = [
      '#ff8a65',
      '#f4c22b',
      '#04a9f5',
      '#3ebfea',
      '#4F5467',
      '#1de9b6',
      '#a389d4',
      '#FE8A7D'
    ];

    const editors_data = [];
    editors.forEach((editor, i) => {
      editors_data.push({
        key: `${editor.firstname}`,
        student_num: editor.student_num,
        color: colors[i]
      });
    });

    const application_status = ['Open', 'Close'];
    const applications_decided = programs_refactor(students_details).filter(
      (application) =>
        application.program_id !== '-' && application.decided === 'O'
    );
    const applications_submitted = applications_decided.filter(
      (application) => application.closed === 'O'
    );
    const obj = {
      Open: applications_decided.length - applications_submitted.length,
      Close: applications_submitted.length
    };
    const applications_data = [];
    application_status.forEach((status, i) => {
      applications_data.push({
        name: `${status}`,
        uv: obj[status]
        // color: colors[i]
      });
    });
    const admissions_data = [];
    const admission_status = ['Admission', 'Rejection', 'Pending'];
    const applications_admission = applications_submitted.filter(
      (application) => application.admission === 'O'
    );
    const applications_rejection = applications_submitted.filter(
      (application) => application.admission === 'X'
    );
    const applications_pending = applications_submitted.filter(
      (application) => application.admission === '-'
    );
    const obj2 = {
      Admission: applications_admission.length,
      Rejection: applications_rejection.length,
      Pending: applications_pending.length
    };
    admission_status.forEach((status, i) => {
      admissions_data.push({
        name: `${status}`,
        uv: obj2[status]
      });
    });
    // Only open tasks. Closed tasks are excluded
    const open_tasks_arr = open_tasks_with_editors(students_details);
    const task_distribution = open_tasks_arr
      .filter(({ isFinalVersion, show }) => isFinalVersion !== true)
      .map(({ deadline, file_type, show }) => {
        return { deadline, file_type, show };
      });
    const open_distr = frequencyDistribution(task_distribution);
    const sort_date = Object.keys(open_distr).sort();

    const sorted_date_freq_pair = [];
    sort_date.forEach((date, i) => {
      sorted_date_freq_pair.push({
        name: `${date}`,
        active: open_distr[date].show,
        potentials: open_distr[date].potentials
      });
    });

    const students_years_arr = numStudentYearDistribution(students_details);
    const students_years_pair = [];
    let students_years = Object.keys(students_years_arr).sort();
    students_years = students_years.slice(
      Math.max(students_years.length - 10, 1) // 3 >> the last x year students
    );
    students_years.forEach((date, i) => {
      students_years_pair.push({
        name: `${date}`,
        uv: students_years_arr[date]
      });
    });
    const documents_data = [];
    const editor_tasks_distribution_data = [];
    const cat = ['ML', 'CV', 'RL', 'ESSAY'];
    cat.forEach((ca, i) => {
      documents_data.push({
        name: `${ca}`,
        uv: documents[ca].count
        // color: colors[i]
      });
    });
    editors.forEach((editor, i) => {
      editor_tasks_distribution_data.push({
        name: `${editor.firstname}`,
        active: open_tasks_arr.filter(
          ({ editors, isFinalVersion, show }) =>
            editors.findIndex(
              (ed) => ed._id.toString() === editor._id.toString()
            ) !== -1 &&
            isFinalVersion !== true &&
            show
        ).length,
        potentials: open_tasks_arr.filter(
          ({ editors, isFinalVersion, show }) =>
            editors.findIndex((ed) => ed._id == editor._id) !== -1 &&
            isFinalVersion !== true &&
            !show
        ).length
        // color: colors[i]
      });
    });
    const agents_data = [];
    agents.forEach((agent, i) => {
      agents_data.push({
        key: `${agent.firstname}`,
        student_num_no_offer: agent.student_num_no_offer,
        student_num_with_offer: agent.student_num_with_offer,
        color: colors[i]
      });
    });
    const calculateDuration = (start, end) => {
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      const duration = (endTime - startTime) / (1000 * 60 * 60 * 24); // Duration in days
      return duration;
    };
    const refactor_finished_cv_docs = finished_docs
      .filter(
        (doc) =>
          doc.messages.length !== 0 &&
          doc.messages.length > 2 &&
          doc.file_type === 'CV'
      )
      .map((finished_doc, u) => {
        const start_date = finished_doc.messages[0].createdAt;
        const end_date =
          finished_doc.messages[finished_doc.messages.length - 1].createdAt;
        return {
          name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
          start: start_date,
          end: end_date
        };
      });
    const CVdataWithDuration = refactor_finished_cv_docs.map((item, index) => ({
      ...item,
      name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
      duration: calculateDuration(item.start, item.end)
    }));

    const refactor_finished_ml_docs = finished_docs
      .filter(
        (doc) =>
          doc.messages.length !== 0 &&
          doc.messages.length > 2 &&
          doc.file_type === 'ML'
      )
      .map((finished_doc, u) => {
        const start_date = finished_doc.messages[0].createdAt;
        const end_date =
          finished_doc.messages[finished_doc.messages.length - 1].createdAt;
        return {
          name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
          start: start_date,
          end: end_date
        };
      });
    const MLdataWithDuration = refactor_finished_ml_docs.map((item, index) => ({
      ...item,
      name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
      duration: calculateDuration(item.start, item.end)
    }));

    const refactor_finished_rl_docs = finished_docs
      .filter(
        (doc) =>
          doc.messages.length !== 0 &&
          doc.messages.length > 2 &&
          (doc.file_type === 'RL_A' ||
            doc.file_type === 'RL_B' ||
            doc.file_type === 'RL_C' ||
            doc.file_type === 'Recommendation_Letter_A' ||
            doc.file_type === 'Recommendation_Letter_B' ||
            doc.file_type === 'Recommendation_Letter_C')
      )
      .map((finished_doc, u) => {
        const start_date = finished_doc.messages[0].createdAt;
        const end_date =
          finished_doc.messages[finished_doc.messages.length - 1].createdAt;
        return {
          name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
          start: start_date,
          end: end_date
        };
      });
    const RLdataWithDuration = refactor_finished_rl_docs.map((item, index) => ({
      ...item,
      name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
      duration: calculateDuration(item.start, item.end)
    }));
    return (
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">
                      {appConfig.companyName} Dashboard
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Tabs defaultActiveKey="default" fill={true} justify={true}>
          <Tab eventKey="default" title="Overview">
            <Row>
              <Col md={12}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Open Tasks Distribution</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    Tasks distribute among the date. Note that CVs, MLs, RLs,
                    and Essay are mixed together.
                    <p className="my-0">
                      <b style={{ color: 'red' }}>active:</b> students decide
                      programs. These will be shown in{' '}
                      <Link to={`${DEMO.CV_ML_RL_DASHBOARD_LINK}`}>
                        Tasks Dashboard
                      </Link>
                    </p>
                    <p className="my-0">
                      <b style={{ color: '#A9A9A9' }}>potentials:</b> students
                      do not decide programs yet. But the tasks will be
                      potentially active when they decided.
                    </p>
                    <TasksDistributionBarChart data={sorted_date_freq_pair} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Students</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {/* Close: {students.isClose}. Open: {students.isOpen} */}
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={students_years_pair}
                        margin={{
                          top: 20,
                          right: 0,
                          left: 0,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar
                          dataKey="uv"
                          fill="#8884d8"
                          label={{ position: 'top' }}
                        >
                          {students_years_pair.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % 20]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Tasks</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    Number of Open Tasks:{' '}
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={documents_data}
                        margin={{
                          top: 20,
                          right: 0,
                          left: 0,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar
                          dataKey="uv"
                          fill="#8884d8"
                          label={{ position: 'top' }}
                        >
                          {documents_data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % 20]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Agents</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    Number of active students per agent:
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={agents_data}
                        layout={'vertical'}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="key" interval={0} />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Bar
                          dataKey="student_num_no_offer"
                          fill={'#8884d8'}
                          stackId={'a'}
                          label={{ position: 'right' }}
                        >
                          {agents_data.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                          ))}
                        </Bar>
                        <Bar
                          dataKey="student_num_with_offer"
                          fill="#A9A9A9"
                          stackId={'a'}
                          label={{ position: 'right' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Editors</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    Number of active students per editor:
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={editors_data}
                        layout={'vertical'}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="key" interval={0} />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Bar
                          dataKey="student_num"
                          fill={'#8884d8'}
                          stackId={'a'}
                          label={{ position: 'right' }}
                        >
                          {editor_tasks_distribution_data.map(
                            (entry, index) => (
                              <Cell key={`cell-${index}`} />
                            )
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Editors</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    Number of open and potential tasks per editor:
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={editor_tasks_distribution_data}
                        layout={'vertical'}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 40,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="name" interval={0} />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Bar
                          dataKey="active"
                          fill={'#8884d8'}
                          stackId={'a'}
                          label={{ position: 'right' }}
                        >
                          {editor_tasks_distribution_data.map(
                            (entry, index) => (
                              <Cell key={`cell-${index}`} />
                            )
                          )}
                        </Bar>
                        <Bar
                          dataKey="potentials"
                          fill="#A9A9A9"
                          stackId={'a'}
                          label={{ position: 'right' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Applications</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    Number of Applications:
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={applications_data}
                        margin={{
                          top: 20,
                          right: 0,
                          left: 0,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar
                          dataKey="uv"
                          fill="#8884d8"
                          label={{ position: 'top' }}
                        >
                          {applications_data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % 20]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Admissions</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    Number of Admissions:
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={admissions_data}
                        margin={{
                          top: 20,
                          right: 0,
                          left: 0,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar
                          dataKey="uv"
                          fill="#8884d8"
                          label={{ position: 'top' }}
                        >
                          {admissions_data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % 20]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="kpi" title="KPI">
            <Row>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Closed CV KPI</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={CVdataWithDuration}
                        margin={{
                          top: 20,
                          right: 0,
                          left: 0,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={270}
                          dx={0}
                          dy={25}
                          minTickGap={-200}
                          axisLine={false}
                        />
                        <YAxis>
                          <Label
                            value="Duration (days)"
                            angle={-90}
                            position="insideLeft"
                          />
                        </YAxis>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="duration" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Closed ML KPI</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={MLdataWithDuration}
                        margin={{
                          top: 20,
                          right: 0,
                          left: 0,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={270}
                          dx={0}
                          dy={25}
                          minTickGap={-200}
                          axisLine={false}
                        />
                        <YAxis>
                          <Label
                            value="Duration (days)"
                            angle={-90}
                            position="insideLeft"
                          />
                        </YAxis>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="duration" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header text={'dark'}>
                    <Card.Title>
                      <Row>
                        <Col className="my-0 mx-0">Closed RL KPI</Col>
                      </Row>
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={RLdataWithDuration}
                        margin={{
                          top: 20,
                          right: 0,
                          left: 0,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={270}
                          dx={0}
                          dy={25}
                          minTickGap={-200}
                          axisLine={false}
                        />
                        <YAxis>
                          <Label
                            value="Duration (days)"
                            angle={-90}
                            position="insideLeft"
                          />
                        </YAxis>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="duration" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="program_list" title="Program List">
            <Row>
              <Col>
                <ProgramListVisualization user={this.props.user} />
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Aux>
    );
  }
}

export default InternalDashboard;
