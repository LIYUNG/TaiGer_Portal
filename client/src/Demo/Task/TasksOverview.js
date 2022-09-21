import React, { Component } from 'react';
import { Spinner, Card } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
// import TasksList from "./TasksList";
// import TaskItem from './TaskItem';
import Board from 'react-trello';

import { getMyStudentsTasks } from '../../api';

const handleDragStart = (cardId, laneId) => {
  console.log('drag started');
  console.log(`cardId: ${cardId}`);
  console.log(`laneId: ${laneId}`);
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log('drag ended');
  console.log(`cardId: ${cardId}`);
  console.log(`sourceLaneId: ${sourceLaneId}`);
  console.log(`targetLaneId: ${targetLaneId}`);
};
const onDataChange = (newData) => {
  console.log(newData);
};

const onCardClick = (cardId, metadata) => {
  console.log(cardId);
  console.log(metadata);
};

class TasksOverview extends Component {
  state = {
    error: null,
    isLoaded: false,
    tasks: null,
    success: null
  };

  completeCard = () => {
    this.state.eventBus.publish({
      type: 'ADD_CARD',
      laneId: 'COMPLETED',
      card: {
        id: 'Milk',
        title: 'Buy Milk',
        label: '15 mins',
        description: 'Use Headspace app'
      }
    });
    this.state.eventBus.publish({
      type: 'REMOVE_CARD',
      laneId: 'PLANNED',
      cardId: 'Milk'
    });
  };

  addCard = () => {
    this.state.eventBus.publish({
      type: 'ADD_CARD',
      laneId: 'BLOCKED',
      card: {
        id: 'Ec2Error',
        title: 'EC2 Instance Down',
        label: '30 mins',
        description: 'Main EC2 instance down'
      }
    });
  };

  setEventBus = (eventBus) => {
    this.setState({ eventBus });
  };

  handleCardAdd = (card, laneId) => {
    console.log(`New card added to lane ${laneId}`);
    console.dir(card);
  };

  shouldReceiveNewData = (nextData) => {
    console.log('New card has been added');
    console.log(nextData);
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
            isLoaded: true
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: false,
          error
        });
      }
    );
  }

  render() {
    const { error, isLoaded } = this.state;
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
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
    const tasks_list = this.state.tasks.map((task, i) => (
      <>
        <Card.Body key={i}>
          {task.student_id.firstname} {task.student_id.lastname}
        </Card.Body>
        <Board

          // editable
          // editLaneTitle
          data={task}
          style={{ backgroundColor: 'transparent' }}
          cardDraggable={true}
          onDataChange={onDataChange}
          onCardAdd={this.handleCardAdd}
          eventBusHandle={this.setEventBus}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          onCardClick={onCardClick}
        />
      </>
    ));
    return (
      <Aux>
        {/* <button onClick={this.completeCard} style={{ margin: 5 }}>
          Complete Buy Milk
        </button>
        <button onClick={this.addCard} style={{ margin: 5 }}>
          Add Blocked
        </button> */}
        {/* <Board
          // editable
          // editLaneTitle
          data={this.state.tasks}
          style={{ backgroundColor: 'transparent' }}
          cardDraggable={true}
          onDataChange={onDataChange}
          onCardAdd={this.handleCardAdd}
          eventBusHandle={this.setEventBus}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          onCardClick={onCardClick}
        /> */}
        {tasks_list}
      </Aux>
    );
  }
}

export default TasksOverview;
