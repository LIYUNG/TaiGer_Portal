import React, { Component } from 'react';
import { Row, Col, Spinner, Button } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
// import TasksList from "./TasksList";
import TaskItem from './TaskItem';
import Board from 'react-trello';

import { getStudentTask } from '../../api';

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

class Task extends Component {
  state = {
    error: null,
    isLoaded: false,
    tasks: null,
    success: null,
    empty: false
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
    const student_id = this.props.match
      ? this.props.match.params.student_id
      : this.props.student_id;
    if (student_id)
      getStudentTask(student_id).then(
        (resp) => {
          const { success, data } = resp.data;
          const task = data[0];
          if (data.length !== 0) {
            if (success) {
              this.setState({
                success,
                tasks: task,
                isLoaded: true
              });
            } else {
              alert(resp.data.message);
            }
          } else {
            if (success) {
              this.setState({
                success,
                empty: true,
                isLoaded: true
              });
            } else {
              alert(resp.data.message);
            }
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

    return (
      <Aux>
        {/* <button onClick={this.completeCard} style={{ margin: 5 }}>
          Complete Buy Milk
        </button>
        <button onClick={this.addCard} style={{ margin: 5 }}>
          Add Blocked
        </button> */}
        {this.state.empty ? (
          <>
            <Button style={style}>Create Tasks</Button>
          </>
        ) : (
          <Board
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
          />
        )}
      </Aux>
    );
  }
}

export default Task;
