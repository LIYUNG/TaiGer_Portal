import React, { Component } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
// import TasksList from "./TasksList";
import TaskItem from "./TaskItem";
import Board from "react-trello";

import { getMyTask } from "../../api";

const data = {
  lanes: [
    {
      id: "lane1",
      title: "Planned Tasks",
      label: "2/2",
      cards: [
        {
          id: "Card1",
          title: "Locked",
          description: "Can AI make memes",
          label: "30 mins",
          draggable: false,
        },
        {
          id: "Card2",
          title: "Pay Rent",
          description: "Transfer via NEFT",
          label: "5 mins",
          metadata: { sha: "be312a1" },
        },
      ],
    },
    {
      id: "lane2",
      title: "In Progress",
      label: "0/0",
      cards: [
        {
          id: "Card2",
          title: "Pay Rent",
          description: "Transfer via NEFT",
          label: "5 mins",
          metadata: { sha: "be312a1" },
        },
        {
          id: "Card4",
          title: "Pay Rent",
          description: "Transfer via NEFT",
          label: "5 mins",
          metadata: { sha: "be312a1" },
        },
      ],
    },
    {
      id: "lane3",
      title: "Double Check",
      label: "0/0",
      cards: [],
    },
    {
      id: "lane4",
      title: "Closed",
      label: "0/0",
      cards: [],
    },
  ],
};

class MyTask extends Component {
  state = {
    error: null,
    isLoaded: false,
    tasks: [],
    success: null,
  };

  completeCard = () => {
    this.state.eventBus.publish({
      type: "ADD_CARD",
      laneId: "COMPLETED",
      card: {
        id: "Milk",
        title: "Buy Milk",
        label: "15 mins",
        description: "Use Headspace app",
      },
    });
    this.state.eventBus.publish({
      type: "REMOVE_CARD",
      laneId: "PLANNED",
      cardId: "Milk",
    });
  };

  addCard = () => {
    this.state.eventBus.publish({
      type: "ADD_CARD",
      laneId: "BLOCKED",
      card: {
        id: "Ec2Error",
        title: "EC2 Instance Down",
        label: "30 mins",
        description: "Main EC2 instance down",
      },
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
    console.log("New card has been added");
    console.log(nextData);
  };

  componentDidMount() {
    // getStudent(this.props.match.params.studentId).then(
    getMyTask().then(
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

    return (
      <>
        <button onClick={this.completeCard} style={{ margin: 5 }}>
          Complete Buy Milk
        </button>
        <button onClick={this.addCard} style={{ margin: 5 }}>
          Add Blocked
        </button>
        <Board
          editable
          editLaneTitle
          data={data}
          style={{ backgroundColor: "transparent" }}
          cardDraggable={true}
          onCardAdd={this.handleCardAdd}
          eventBusHandle={this.setEventBus}
        />
      </>
    );
    // return (
    //   <Aux>
    //     <Row>
    //       <Col>{tasks_list}</Col>
    //     </Row>
    //   </Aux>
    // );
  }
}

export default MyTask;
