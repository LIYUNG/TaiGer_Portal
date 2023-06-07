import React, { useState } from 'react';
import { Collapse, Table } from 'react-bootstrap';

export function ExtendableTable({ data }) {
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
              className="bg-light text-dark"
              onClick={() => toggleRow(index)}
            >
              <td>
                <b>
                  {selectedRows[index] === index ? '🔽 ' : '▶️ '}
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
