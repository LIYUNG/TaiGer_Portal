import React from 'react';
import { Button, Table, Col, Form } from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';
class EditDownloadFilesSubpage extends React.Component {
  // edit File subpage

  render() {
    const deleteStyle = 'danger';
    let keys2 = Object.keys(this.props.templatelist);
    let object_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = 'missing';
    }
    // console.log(this.props.templates);
    for (let i = 0; i < this.props.templates.length; i++) {
      object_init[this.props.templates[i].category_name] = 'uploaded';
    }

    let templatelist2;
    templatelist2 = this.props.templatelist.map((template, i) => {
      return (
        <tr key={i + 1}>
          <td>{template.name}</td>
          {this.props.role !== 'Student' ? (
            object_init[template.prop] === 'uploaded' ? (
              <>
                {this.props.role === 'Admin' ? (
                  <td>
                    <Col>
                      <Button
                        variant={deleteStyle}
                        size="sm"
                        type="submit"
                        title="Delete"
                        disabled={this.props.isLoaded}
                        onClick={(e) =>
                          this.props.onDeleteTemplateFile(e, template.prop)
                        }
                      >
                        <AiOutlineDelete size={16} />
                      </Button>
                    </Col>
                  </td>
                ) : (
                  <td></td>
                )}
                <td></td>
                <td>
                  <Col>
                    <Form
                      onSubmit={(e) =>
                        this.props.onDownloadFilefromstudent(e, template.prop)
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
              </>
            ) : (
              <>
                <td>
                  <Col>
                    <Form
                      onChange={(e) => this.props.onFileChange(e)}
                      onClick={(e) => (e.target.value = null)}
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
                      onSubmit={(e) => this.props.submitFile(e, template.prop)}
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Button size="sm" type="submit">
                          Upload
                        </Button>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td></td>
              </>
            )
          ) : object_init[template.prop] === 'uploaded' ? (
            <>
              <td></td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onDownloadFilefromstudent(e, template.prop)
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
              <td></td>
            </>
          ) : (
            <>
              <td></td>
              <td></td>
              <td></td>
            </>
          )}
        </tr>
      );
    });

    return (
      <Table variant="dark" text="light" className="my-0 mx-0">
        <tbody>{templatelist2}</tbody>
      </Table>
    );
  }
}

export default EditDownloadFilesSubpage;
