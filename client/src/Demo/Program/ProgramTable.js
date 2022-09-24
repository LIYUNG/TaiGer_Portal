import React from "react";
import { Row, Col } from "react-bootstrap";
import Card from "../../App/components/MainCard";
import Aux from "../../hoc/_Aux";
import ProgramList from "./ProgramList";

class ProgramTable extends React.Component {

  render() {
    return (
      <Aux>
        <Row>
          <Col>
            {this.props.user.role === "Guest" ? (
              <Card>This is for Premium only. Please contact our sales!</Card>
            ) : (
              <ProgramList
                role={this.props.user.role}
                userId={this.props.user._id}
              />
            )}
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default ProgramTable;
