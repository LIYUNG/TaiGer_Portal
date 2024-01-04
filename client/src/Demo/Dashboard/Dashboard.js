import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import AdminMainView from './AdminDashboard/AdminMainView';
import AgentMainView from './AgentDashboard/AgentMainView';
import EditorMainView from './EditorDashboard/EditorMainView';
import ManagerMainView from './ManagerDashboard/ManagerMainView';
import StudentDashboard from './StudentDashboard/StudentDashboard';
import GuestDashboard from './GuestDashboard/GuestDashboard';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { SYMBOL_EXPLANATION, spinner_style } from '../Utils/contants';

import {
  getStudents,
  updateArchivStudents,
  updateProfileDocumentStatus,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import {
  is_TaiGer_Admin,
  is_TaiGer_Agent,
  is_TaiGer_Editor,
  is_TaiGer_Manager,
  is_TaiGer_Student
} from '../Utils/checking-functions';

function Dashboard(props) {
  const [dashboardState, setDashboardState] = useState({
    error: '',
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isDashboard: true,
    file: '',
    notification: {},
    isCoursesFilled: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });
  useEffect(() => {
    getStudents().then(
      (resp) => {
        const { data, success, isCoursesFilled, notification } = resp.data;
        const { status } = resp;
        if (success) {
          setDashboardState({
            isLoaded: true,
            students: data,
            isCoursesFilled: isCoursesFilled,
            notification,
            success: success,
            res_status: status
          });
        } else {
          setDashboardState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        setDashboardState({
          ...dashboardState,
          isLoaded: true,
          error,
          res_status: 500
        });
      }
    );
  }, []);

  const editAgent = (student) => {
    getAgents().then(
      (resp) => {
        // TODO: check success
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const agents = data; //get all agent
          const { agents: student_agents } = student;
          const updateAgentList = agents.reduce(
            (prev, { _id }) => ({
              ...prev,
              [_id]: student_agents
                ? student_agents.findIndex(
                    (student_agent) => student_agent._id === _id
                  ) > -1
                : false
            }),
            {}
          );

          setDashboardState({
            ...dashboardState,
            agent_list: agents,
            updateAgentList,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          setDashboardState({
            ...dashboardState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        setDashboardState({
          ...dashboardState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        });
      }
    );
  };

  const editEditor = (student) => {
    getEditors().then(
      (resp) => {
        // TODO: check success
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const editors = data;
          const { editors: student_editors } = student;
          const updateEditorList = editors.reduce(
            (prev, { _id }) => ({
              ...prev,
              [_id]: student_editors
                ? student_editors.findIndex(
                    (student_editor) => student_editor._id === _id
                  ) > -1
                : false
            }),
            {}
          );

          setDashboardState({
            ...dashboardState,
            editor_list: editors,
            updateEditorList,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          setDashboardState({
            ...dashboardState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        setDashboardState({
          ...dashboardState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        });
      }
    );
  };

  const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    UpdateAgentlist(e, updateAgentList, student_id);
  };

  const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    UpdateEditorlist(e, updateEditorList, student_id);
  };

  const UpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...dashboardState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setDashboardState({
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          setDashboardState({
            ...dashboardState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        setDashboardState({
          ...dashboardState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        });
      }
    );
  };

  const UpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...dashboardState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setDashboardState({
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          setDashboardState({
            ...dashboardState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        setDashboardState({
          ...dashboardState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        });
      }
    );
  };

  const updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setDashboardState({
            ...dashboardState,
            isLoaded: true,
            students: data,
            success: success,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          setDashboardState({
            ...dashboardState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        setDashboardState({
          ...dashboardState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        });
      }
    );
  };

  const onUpdateProfileFilefromstudent = (
    category,
    student_id,
    status,
    feedback
  ) => {
    var student_arrayidx = dashboardState.students.findIndex(
      (student) => student._id === student_id
    );
    // var student = dashboardState.students.find(
    //   (student) => student._id === student_id
    // );
    var students = [...dashboardState.students];
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (res) => {
        const { success, data } = res.data;
        const { status } = res;
        if (success) {
          students[student_arrayidx] = data;
          setDashboardState({
            ...dashboardState,
            students: students,
            success,
            isLoaded: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          setDashboardState({
            ...dashboardState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        const { statusText } = resp;
        setDashboardState({
          ...dashboardState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        });
      }
    );
  };

  const ConfirmError = () => {
    setDashboardState({
      ...dashboardState,
      res_modal_status: 0,
      res_modal_message: ''
    });
  };

  const { res_modal_status, res_modal_message, isLoaded, res_status } =
    dashboardState;
  TabTitle('Home Page');
  if (!isLoaded || !dashboardState.students) {
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

  if (is_TaiGer_Admin(props.user)) {
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <AdminMainView
          user={props.user}
          editAgent={editAgent}
          editEditor={editEditor}
          agent_list={dashboardState.agent_list}
          editor_list={dashboardState.editor_list}
          UpdateAgentlist={UpdateAgentlist}
          students={dashboardState.students}
          updateAgentList={dashboardState.updateAgentList}
          submitUpdateAgentlist={submitUpdateAgentlist}
          updateEditorList={dashboardState.updateEditorList}
          submitUpdateEditorlist={submitUpdateEditorlist}
          updateStudentArchivStatus={updateStudentArchivStatus}
          isDashboard={dashboardState.isDashboard}
        />
      </Aux>
    );
  } else if (is_TaiGer_Manager(props.user)) {
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <ManagerMainView
          user={props.user}
          students={dashboardState.students}
          notification={dashboardState.notification}
          editAgent={editAgent}
          agent_list={dashboardState.agent_list}
          UpdateAgentlist={UpdateAgentlist}
          updateAgentList={dashboardState.updateAgentList}
          submitUpdateAgentlist={submitUpdateAgentlist}
          updateStudentArchivStatus={updateStudentArchivStatus}
          isDashboard={dashboardState.isDashboard}
          onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        />
      </Aux>
    );
  } else if (is_TaiGer_Agent(props.user)) {
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <AgentMainView
          data-testid="agent_main_view"
          user={props.user}
          students={dashboardState.students}
          notification={dashboardState.notification}
          editAgent={editAgent}
          editEditor={editEditor}
          agent_list={dashboardState.agent_list}
          UpdateAgentlist={UpdateAgentlist}
          updateAgentList={dashboardState.updateAgentList}
          submitUpdateAgentlist={submitUpdateAgentlist}
          updateStudentArchivStatus={updateStudentArchivStatus}
          isDashboard={dashboardState.isDashboard}
          onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        />
      </Aux>
    );
  } else if (is_TaiGer_Editor(props.user)) {
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <EditorMainView
          user={props.user}
          editAgent={editAgent}
          editEditor={editEditor}
          agent_list={dashboardState.agent_list}
          editor_list={dashboardState.editor_list}
          students={dashboardState.students}
          updateEditorList={dashboardState.updateEditorList}
          updateStudentArchivStatus={updateStudentArchivStatus}
          submitUpdateEditorlist={submitUpdateEditorlist}
          isDashboard={dashboardState.isDashboard}
        />
      </Aux>
    );
  } else if (is_TaiGer_Student(props.user)) {
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <StudentDashboard
          user={props.user}
          isCoursesFilled={dashboardState.isCoursesFilled}
          role={props.user.role}
          student={dashboardState.students[0]}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        />
      </Aux>
    );
  } else {
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <GuestDashboard
          role={props.user.role}
          success={dashboardState.success}
          students={dashboardState.students}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        />
      </Aux>
    );
  }
}

export default Dashboard;
