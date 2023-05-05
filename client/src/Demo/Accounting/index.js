import React, { useState } from 'react';
import { Row, Col, Card, Spinner, Collapse, Table } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
// import AdmissionsTable from './AdmissionsTable';
import ErrorPage from '../Utils/ErrorPage';
import { spinner_style } from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';

import { getExpenses } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

function ExtendableTable({ data }) {
  const [selectedRows, setSelectedRows] = useState([
    new Array(data.length)
      .fill()
      .map((x, i) => (i === data.length - 1 ? i : -1))
  ]);
  const toggleRow = (index) => {
    let selectedRows_temp = { ...selectedRows };
    selectedRows_temp[index] = selectedRows_temp[index] !== index ? index : -1;
    setSelectedRows(selectedRows_temp);
  };
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th># Applications</th>
          <th>Income</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <tr
              className="bg-secondary text-light"
              onClick={() => toggleRow(index)}
            >
              <td>
                <b>
                  {item.firstname}
                  {item.lastname}
                </b>
              </td>
              <td>{item.applying_program_count}</td>
              <td>{item.expenses}</td>
            </tr>

            <Collapse in={selectedRows[index] === index}>
              <tr>
                <td colSpan="4">
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Column 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>1</th>
                        <th>b 2</th>
                      </tr>
                    </tbody>
                  </Table>
                </td>
              </tr>
            </Collapse>
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

class Accounting extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    students: [],
    success: false,
    res_status: 0
  };

  componentDidMount() {
    getExpenses().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
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
    TabTitle('TaiGer Accounting');
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.data) {
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

    if (this.state.success) {
      return (
        <Aux>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <h4>In Progress!</h4>
                  <ExtendableTable data={this.state.students} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default Accounting;
