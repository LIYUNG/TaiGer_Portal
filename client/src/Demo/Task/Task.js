import React, { Component } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
// import TasksList from "./TasksList";
import TaskItem from "./TaskItem";

import { getMyStudentsTasks } from "../../api";

class Task extends Component {
  state = {
    error: null,
    isLoaded: false,
    tasks: [],
  };
  componentDidMount() {
    // getStudent(this.props.match.params.studentId).then(
    getMyStudentsTasks().then(
      (resp) => {
        const { success, data } = resp.data;
        if (success) {
          this.setState({
            success,
            tasks: data,
            isLoaded: true,
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: false,
          error,
        });
      }
    );
  }

  render() {
    const { error, isLoaded } = this.state;
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!isLoaded && !this.state.tasks) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    const tasks_list = this.state.tasks.map((task) => (
      <TaskItem
        key={task._id}
        id={task._id}
        task={task}
        role={this.props.user.role}
      />
    ));

    return <Aux>{tasks_list}</Aux>;
  }
}

export default Task;
