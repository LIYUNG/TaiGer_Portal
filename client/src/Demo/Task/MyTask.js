import React, { Component } from 'react';
import { Spinner, Modal, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// import Aux from '../../hoc/_Aux';
// import TasksList from "./TasksList";
// import TaskItem from './TaskItem';
import Board from 'react-trello';
// import data_test from './demo_task_data.json';
import { getMyStudentsTasks, initTasks } from '../../api';
import './MyTask.css';

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

class MyTask extends Component {
  state = {
    error: null,
    isLoaded: false,
    tasks: null,
    success: null,
    card_title: '',
    card_description: '',
    card_modal_flag: false,
    empty: false
  };

  componentDidMount() {
    // getStudent(this.props.match.params.studentId).then(
    getMyStudentsTasks().then(
      (resp) => {
        const { success, data } = resp.data;
        const task = data[0];

        if (data.length !== 0) {
          if (success) {
            this.setState({
              success,
              tasks: task,
              empty: false,
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

  handeCardClick = (cardId, metadata, laneId) => {
    console.log('On card click');
  };

  closeCardWindow = () => {
    this.setState({ card_modal_flag: false });
  };
  shouldReceiveNewData = (nextData) => {
    console.log('New card has been added');
    console.log(nextData);
  };

  onCardClick = (cardId, metadata, laneId) => {
    console.log(cardId);
    console.log(metadata);
    console.log(laneId);
    const Lane = this.state.tasks.lanes.find(({ id }) => id === laneId);
    console.log(Lane);
    const card = Lane.cards.find(({ id }) => id === cardId);
    this.setState({
      card_title: card.title,
      card_description: card.description,
      card_modal_flag: true
    });
  };

  initTask = () => {
    const student_id = this.props.user._id;
    initTasks(student_id).then(
      (resp) => {
        const { success, data } = resp.data;
        const task = data[0];
        if (data.length !== 0) {
          if (success) {
            this.setState({
              success,
              tasks: task,
              empty: false,
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
  };

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

    // let eventBus = undefined;

    // const setEventBus = (handle) => {
    //   eventBus = handle;
    // };
    // //To add a card
    // eventBus.publish({
    //   type: "ADD_CARD",
    //   laneId: "COMPLETED",
    //   card: {
    //     id: "M1",
    //     title: "Buy Milk",
    //     label: "15 mins",
    //     description: "Also set reminder",
    //   },
    // });

    // //To update a card
    // eventBus.publish({
    //   type: "UPDATE_CARD",
    //   laneId: "COMPLETED",
    //   card: {
    //     id: "M1",
    //     title: "Buy Milk (Updated)",
    //     label: "20 mins",
    //     description: "Also set reminder (Updated)",
    //   },
    // });

    // //To remove a card
    // eventBus.publish({ type: "REMOVE_CARD", laneId: "PLANNED", cardId: "M1" });

    // //To move a card from one lane to another. index specifies the position to move the card to in the target lane
    // eventBus.publish({
    //   type: "MOVE_CARD",
    //   fromLaneId: "PLANNED",
    //   toLaneId: "WIP",
    //   cardId: "Plan3",
    //   index: 0,
    // });

    //To update the lanes
    // eventBus.publish({ type: "UPDATE_LANES", lanes: newLaneData });

    const my_task = (
      <Board
        // editable
        // editLaneTitle
        data={this.state.tasks}
        style={{ backgroundColor: 'transparent', height: 'auto' }}
        cardDraggable={true}
        onDataChange={onDataChange}
        onCardAdd={this.handleCardAdd}
        eventBusHandle={this.setEventBus}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        onCardClick={this.onCardClick}
      />
    );
    // const students_tasks = (
    //   <Table>
    //     <thead>
    //       <tr>
    //         <th></th>
    //         {this.state.tasks[0].lanes.map((lane, i) => (
    //           <>
    //             <th>{lane.title}</th>
    //           </>
    //         ))}
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {this.state.tasks.map((student, i) => (
    //         <>
    //           <tr>
    //             <td>
    //               <Link 
    //                  to={'/tasks/' + student.student_id._id}
    //                  style={{ textDecoration: 'none' }}
    //               >
    //                 {student.student_id.firstname} {student.student_id.lastname}
    //               </Link>
    //             </td>
    //             {student.lanes.map((lane, k) => (
    //               <td>
    //                 {lane.cards.map((card, l) => (
    //                   <>
    //                     <tr>{card.title}</tr>
    //                   </>
    //                 ))}
    //               </td>
    //             ))}
    //           </tr>
    //         </>
    //       ))}
    //     </tbody>
    //   </Table>
    // );

    return (
      <>
        {/* <button onClick={this.completeCard} style={{ margin: 5 }}>
          Complete Buy Milk
        </button>
        <button onClick={this.addCard} style={{ margin: 5 }}>
          Add Blocked
        </button> */}
        {this.state.empty ? (
          <>
            <Button style={style} onClick={this.initTask}>
              Create Tasks
            </Button>
          </>
        ) : (
          my_task
        )}
        <Modal
          show={this.state.card_modal_flag}
          onHide={this.closeCardWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.state.card_title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.card_description} </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeCardWindow}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default MyTask;
