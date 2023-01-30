import React from 'react';
import { Button, Table, Col, Form, Spinner } from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';
import { BASE_URL } from '../../api/request';

class EditDownloadFilesSubpage extends React.Component {
  state = {};

  submitFile = (e, prop) => {
    e.preventDefault();
    this.props.submitFile(e, prop);
  };

  render() {
    const deleteStyle = 'danger';
    let object_init = {};
    for (let i = 0; i < this.props.templatelist.length; i++) {
      object_init[this.props.templatelist[i].prop] = 'missing';
    }
    for (let i = 0; i < this.props.templates.length; i++) {
      object_init[this.props.templates[i].category_name] = 'uploaded';
    }
    let templatelist2;
    templatelist2 = this.props.templatelist.map((template, i) => {
      return (
        <tr key={i + 1}>
          <td>{template.name}</td>
          <td>
            {this.props.role === 'Admin' && (
              <Col>
                {object_init[template.prop] === 'uploaded' ? (
                  <Button
                    variant={deleteStyle}
                    size="sm"
                    type="submit"
                    title="Delete"
                    disabled={!this.props.areLoaded[template.prop]}
                    onClick={(e) =>
                      this.props.onDeleteTemplateFile(e, template.prop)
                    }
                  >
                    <AiOutlineDelete size={16} />
                  </Button>
                ) : (
                  <Col>
                    <Form.Group controlId="formFile">
                      <Form.Control
                        type="file"
                        onChange={(e) => this.props.onFileChange(e)}
                      />
                    </Form.Group>
                  </Col>
                )}
              </Col>
            )}
          </td>
          <td>
            {object_init[template.prop] === 'uploaded' ? (
              <Col>
                <a
                  href={`${BASE_URL}/api/account/files/template/${template.prop}`}
                  target="_blank"
                  className="text-info"
                >
                  <Button size="sm">Download</Button>
                </a>
              </Col>
            ) : (
              this.props.role === 'Admin' && (
                <Col>
                  <Form onSubmit={(e) => this.submitFile(e, template.prop)}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        {!this.props.areLoaded[template.prop] ? (
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
              )
            )}
          </td>
        </tr>
      );
    });

    return (
      <Table
        responsive
        variant="dark"
        text="light"
        className="my-0 mx-0"
        size="sm"
      >
        <tbody>{templatelist2}</tbody>
      </Table>
    );
  }
}

export default EditDownloadFilesSubpage;
