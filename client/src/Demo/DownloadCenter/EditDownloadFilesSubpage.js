import React from 'react';
import { Button, Table, Col, Form, Spinner } from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdCloudUpload } from 'react-icons/io';
class EditDownloadFilesSubpage extends React.Component {
  state = {
    isLoaded: this.props.isLoaded
  };

  submitFile = (e, prop) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    this.props.submitFile(e, prop);
  };

  render() {
    const deleteStyle = 'danger';
    let keys2 = Object.keys(this.props.templatelist);
    let object_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = 'missing';
    }
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
                        disabled={!this.props.isLoaded}
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
                    <Form.Group controlId="formFile">
                      {/* <Form.Label>
                        <IoMdCloudUpload color={'white'} size={32} />
                      </Form.Label> */}
                      <Form.Control
                        type="file"
                        onChange={(e) => this.props.onFileChange(e)}
                      />
                    </Form.Group>
                  </Col>
                </td>
                <td>
                  <Col>
                    <Form onSubmit={(e) => this.submitFile(e, template.prop)}>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Button size="sm" type="submit">
                          {!this.state.isLoaded ? (
                            <div>
                              <Spinner
                                size="sm"
                                animation="border"
                                role="status"
                                variant="light"
                              >
                                <span className="visually-hidden"></span>
                              </Spinner>
                            </div>
                          ) : (
                            'Upload'
                          )}
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
      <Table variant="dark" text="light" className="my-0 mx-0" size="sm">
        <tbody>{templatelist2}</tbody>
      </Table>
    );
  }
}

export default EditDownloadFilesSubpage;
