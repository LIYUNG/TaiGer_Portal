import React from "react";
import { Button, Table, Col, Form } from "react-bootstrap";

class EditDownloadFilesSubpage extends React.Component {
  // edit File subpage

  render() {
    let keys2 = Object.keys(this.props.templatelist);
    let object_init = new Object();
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = "missing";
    }

    let templatelist2;
    templatelist2 = this.props.templatelist.map((template, i) => {
      return (
        <tr key={i + 1}>
          <td>{template.name}</td>
          <td>
            <Col>
              <Form
              // onChange={(e) => this.props.onFileChange(e)}
              // onClick={(e) => (e.target.value = null)}
              >
                <Form.File id={this.props.userId}>
                  {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                  <Form.File.Input />
                </Form.File>
              </Form>
            </Col>
          </td>
          <td>
            <Col>
              <Form
              // onSubmit={(e) => this.props.submitFile(e, this.props.userId, k)}
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Button size="sm" type="submit">
                    Upload
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </td>
          <td>
            <Col>
              <Form
                onSubmit={(e) =>
                  this.props.onDownloadFilefromstudent(
                    e,
                    template.prop,
                  )
                }
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Button size="sm" type="submit">
                    Download
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </td>
          {/* <th>
            <AiOutlineFieldTime
              size={24}
              color="orange"
              title="Uploaded successfully"
            />
          </th>
          <td>
            <p className="m-0"> {value2[i]}</p>
          </td>
          <td>
            <Col>
              <Form
                onSubmit={(e) => this.props.submitFile(e, this.props.userId, k)}
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Button size="sm" type="submit">
                    Upload
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </td>
          <td>
            <Col>
              <Form
                onSubmit={(e) =>
                  this.props.onDownloadFilefromstudent(e, k, this.props.userId)
                }
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Button size="sm" type="submit">
                    Download
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </td>
          <td>
            <Col>
              <Form
                onSubmit={(e) =>
                  this.props.onDeleteFilefromstudent(e, k, this.props.userId)
                }
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Button variant="danger" size="sm" type="submit">
                    Delete
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </td> */}
        </tr>
      );
    });

    return (
      <Table>
        <tbody>{templatelist2}</tbody>
      </Table>
    );
  }
}

export default EditDownloadFilesSubpage;
