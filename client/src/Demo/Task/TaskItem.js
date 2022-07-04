import React, { Component } from "react";
// import Card from "../../App/components/MainCard";
import { Row, Col, Spinner, Button, Card } from "react-bootstrap";
// import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class TaskItem extends Component {
  state = {
    editorState: null,
    ConvertedContent: "",
    isLoaded: false,
  };

  render() {
    let sub_tasks_key = Object.keys(this.props.task);
    console.log(sub_tasks_key);
    const x = sub_tasks_key.map((key, i) => (
      <Card className="mt-2" key={i}>
        <Card.Body> {JSON.stringify(this.props.task[key])}</Card.Body>
      </Card>
    ));
    return (
      <>
        <Card className="mt-2" key={this.props.key}>
          <Card.Header>
            <Card.Title as="h5">
              <Row>
                <Col>
                  {this.props.task.student_id.firstname}{" "}
                  {this.props.task.student_id.lastname}
                </Col>
              </Row>
            </Card.Title>
          </Card.Header>

          <Card.Body> {JSON.stringify()}</Card.Body>
        </Card>
        {x}
      </>
    );
  }
}

export default TaskItem;
