import React from "react";
import { Row, Col, Card, Tabs, Tab } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";

import avatar1 from "../../assets/images/user/avatar-1.jpg";
import avatar2 from "../../assets/images/user/avatar-2.jpg";
import avatar3 from "../../assets/images/user/avatar-3.jpg";
import Studentlist from "./Studentlist";

import {
  getStudents,
  download,
  deleteProgram,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors,
  acceptDocument,
} from "../../api";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student_i: -1,
      role: "",
      error: null,
      subpage: -1,
      modalShow: false,
      agent_list: [],
      editor_list: [],
      isLoaded: false,
      StudentId: "",
      students: [],
      updateAgentList: {},
      updateEditorList: {},
    };
  }
  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data: students, role } = resp.data;
        this.setState({ isLoaded: true, students, role });
      },
      (error) => {
        console.log(error);
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getStudents().then(
        (resp) => {
          console.log(resp.data.data);
          this.setState({
            isLoaded: true,
            students: resp.data.data,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: true,
          });
        }
      );
    }
  }

  onDownloadFilefromstudent(e, category, id) {
    e.preventDefault();
    const auth = localStorage.getItem("token");
    var actualFileName;

    fetch(`${window.download}/${category}/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      // download(category, id)
      .then((res) => {
        actualFileName = res.headers.get("Content-Disposition").split('"')[1];
        return res.blob();
      })
      .then(
        (blob) => {
          if (blob.size === 0) return;

          var filetype = actualFileName.split("."); //split file name
          filetype = filetype.pop(); //get the file type

          if (filetype === "pdf") {
            console.log(blob);
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: "application/pdf" })
            );

            //Open the URL on new Window
            console.log(url);
            window.open(url); //TODO: having a reasonable file name, pdf viewer
          } else {
            //if not pdf, download instead.

            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", actualFileName);
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // console.log(error);
          // console.log();
          alert("The file is not available.");
          // this.setState({
          //     isLoaded: true,
          //     error
          // });
        }
      );
  }
  onRejectFilefromstudent(e, category, id) {
    //id == student id
    e.preventDefault();
    const auth = localStorage.getItem("token");
    var rejectdoc_url = window.reject_document_API + "/" + category + "/" + id; // id === student id
    fetch(rejectdoc_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {},
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  }

  onAcceptFilefromstudent(e, category, id) {
    //id == student id
    e.preventDefault();
    const auth = localStorage.getItem("token");
    acceptDocument(category, id).then(
      (result) => {},
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }
  onDeleteProgram(e, student_id, program_id) {
    //program id
    e.preventDefault();
    const auth = localStorage.getItem("token");
    var del_prog_std_url =
      window.del_prog_std_API + "/" + program_id + "/" + student_id; // id === student id
    fetch(del_prog_std_url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {},
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  onDeleteFilefromstudent(e, category, id) {
    e.preventDefault();
    const auth = localStorage.getItem("token");
    var download_url = window.delete + "/" + category + "/" + id; // id === student id
    fetch(download_url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    }).then(
      (res) => {
        if (res.status === 200) {
          alert("Delete file success");
          this.setState({
            isLoaded: false,
          });
        } else {
          alert("Delete file failed");
          this.setState({
            isLoaded: false,
          });
        }
      }
      // (error) => {
      //     // console.log(error);
      //     // console.log();
      //     alert("The file is not available.")
      //     // this.setState({
      //     //     isLoaded: true,
      //     //     error
      //     // });
      // }
    );
  }

  editAgent(i) {
    console.log("click editAgent");
    const auth = localStorage.getItem("token");
    fetch(window.edit_agent_API, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.data);
          var tempAgentList = {};
          result.data.map((agent, i) => {
            if (
              this.state.students[this.state.student_i].agent_.indexOf(
                agent.emailaddress_
              ) > -1
            ) {
              console.log("true");
              tempAgentList[agent.emailaddress_] = true;
            } else {
              console.log("false");
              tempAgentList[agent.emailaddress_] = false;
            }
          });
          return this.setState({
            agent_list: result.data,
            updateAgentList: tempAgentList,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // this.setState({
          //     isLoaded: false,
          //     error
          // });
        }
      );
  }

  editEditor(i) {
    console.log("click editEditor");
    const auth = localStorage.getItem("token");
    fetch(window.edit_editor_API, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.data);
          // init updateEditorList value, which editors are already selected
          var tempEditorList = {};
          result.data.map((editor, i) => {
            if (
              this.state.students[this.state.student_i].editor_.indexOf(
                editor.emailaddress_
              ) > -1
            ) {
              console.log("true");
              tempEditorList[editor.emailaddress_] = true;
            } else {
              console.log("false");
              tempEditorList[editor.emailaddress_] = false;
            }
          });
          return this.setState({
            editor_list: result.data,
            updateEditorList: tempEditorList,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          // this.setState({
          //     isLoaded: false,
          //     error
          // });
        }
      );
  }

  handleChangeAgentlist = (e) => {
    const { value, checked } = e.target;
    console.log(value + " " + checked);
    this.setState((prevState) => ({
      updateAgentList: {
        ...prevState.updateAgentList,
        [value]: checked,
      },
    }));
  };

  handleChangeEditorlist = (e) => {
    const { value, checked } = e.target;
    console.log(value + " " + checked);
    this.setState((prevState) => ({
      updateEditorList: {
        ...prevState.updateEditorList,
        [value]: checked,
      },
    }));
  };

  submitUpdateAgentlist = (updateAgentList, student_id) => {
    console.log(updateAgentList + " " + student_id);
    this.UpdateAgentlist(updateAgentList, student_id);
    this.setState({
      updateAgentList: [],
      student_i: -1,
      subpage: -1,
      modalShow: false,
      isLoaded: false,
    });
  };

  submitUpdateEditorlist = (updateEditorList, student_id) => {
    console.log(updateEditorList + " " + student_id);
    this.UpdateEditorlist(updateEditorList, student_id);
    this.setState({
      updateEditorList: [],
      student_i: -1,
      subpage: -1,
      modalShow: false,
      isLoaded: false,
    });
  };

  UpdateAgentlist = (updateAgentList, student_id) => {
    updateAgents(student_id, updateAgentList);
  };

  UpdateEditorlist = (updateEditorList, student_id) => {
    updateEditors(student_id, updateEditorList);
  };

  handleRemove = (i) => {
    this.setState((state) => ({
      students: state.students.filter((row, j) => j !== i),
    }));
  };

  startEditingAgent = (i) => {
    console.log("startEditingAgent");
    this.editAgent(i);
    this.setState({
      student_i: i, // i = student array index
      subpage: 1,
      modalShow: true,
    });
  };

  startEditingEditor = (i) => {
    console.log("startEditingEditor");
    this.editEditor(i);
    this.setState({
      student_i: i, // i = student array index
      subpage: 2,
      modalShow: true,
    });
  };

  startEditingProgram = (i) => {
    console.log("startEditingAnddeleteProgram");
    this.setState({
      student_i: i, // i = student array index
      subpage: 3,
      modalShow: true,
    });
  };

  startUploadfile = (i) => {
    console.log("startUploadfile");
    console.log(i);
    this.setState({
      student_i: i,
      subpage: 4,
      modalShow: true,
    });
  };

  handleChange = (e, name, i) => {
    const { value } = e.target;
    this.setState((state) => ({
      students: this.state.students.map((row, j) =>
        j === i ? { ...row, [name]: value } : row
      ),
    }));
  };

  RemoveProgramHandler2 = (e) => {
    console.log("click save");
  };

  RemoveProgramHandler3 = (program_id) => {
    console.log("click delete");
    console.log("id = " + program_id);
    this.deleteProgram({ program_id });
    this.setState({
      isLoaded: false,
    });
  };

  setmodalhide = () => {
    this.setState({
      student_i: -1,
      subpage: -1,
      modalShow: false,
    });
  };

  render() {
    const tabContent = (
      <Aux>
        <div className="media friendlist-box align-items-center justify-content-center m-b-20">
          <div className="m-r-10 photo-table">
            <a href={DEMO.BLANK_LINK}>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar1}
                alt="activity-user"
              />
            </a>
          </div>
          <div className="media-body">
            <h6 className="m-0 d-inline">Silje Larsen</h6>
            <span className="float-right d-flex  align-items-center">
              <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
              3784
            </span>
          </div>
        </div>
        <div className="media friendlist-box align-items-center justify-content-center m-b-20">
          <div className="m-r-10 photo-table">
            <a href={DEMO.BLANK_LINK}>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar2}
                alt="activity-user"
              />
            </a>
          </div>
          <div className="media-body">
            <h6 className="m-0 d-inline">Julie Vad</h6>
            <span className="float-right d-flex  align-items-center">
              <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
              3544
            </span>
          </div>
        </div>
        <div className="media friendlist-box align-items-center justify-content-center m-b-20">
          <div className="m-r-10 photo-table">
            <a href={DEMO.BLANK_LINK}>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar3}
                alt="activity-user"
              />
            </a>
          </div>
          <div className="media-body">
            <h6 className="m-0 d-inline">Storm Hanse</h6>
            <span className="float-right d-flex  align-items-center">
              <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
              2739
            </span>
          </div>
        </div>
      </Aux>
    );

    const { error, isLoaded } = this.state;
    if (error) {
      //TODO: put error page component for timeout
      localStorage.removeItem("token");
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      if (this.state.students) {
        return (
          <Aux>
            <Row>
              {/* <Col md={6} xl={8}> */}
              <Col>
                <Card className="Recent-Users">
                  <Card.Header>
                    <Card.Title as="h5">Student List</Card.Title>
                  </Card.Header>
                  <Card.Body className="px-0 py-2">
                    <Studentlist
                      role={this.state.role}
                      agent_list={this.state.agent_list}
                      editor_list={this.state.editor_list}
                      ModalShow={this.state.modalShow}
                      setModalShow={this.setModalShow}
                      setmodalhide={this.setmodalhide}
                      handleRemove={this.handleRemove}
                      startEditingAgent={this.startEditingAgent}
                      startEditingEditor={this.startEditingEditor}
                      startEditingProgram={this.startEditingProgram}
                      handleChange={this.handleChange}
                      students={this.state.students}
                      RemoveProgramHandler3={this.RemoveProgramHandler3}
                      header={[
                        {
                          name: "StudentName",
                          prop: "StudentName",
                        },
                        {
                          name: "Agent",
                          prop: "agent_",
                        },
                        {
                          name: "Editor",
                          prop: "editor_",
                        },
                        {
                          name: "Program",
                          prop: "Program",
                        },
                      ]}
                      documentslist={window.documentlist}
                      startUploadfile={this.startUploadfile}
                      subpage={this.state.subpage}
                      student_i={this.state.student_i}
                      onDeleteProgram={this.onDeleteProgram}
                      onDownloadFilefromstudent={this.onDownloadFilefromstudent}
                      onRejectFilefromstudent={this.onRejectFilefromstudent}
                      onAcceptFilefromstudent={this.onAcceptFilefromstudent}
                      onDeleteFilefromstudent={this.onDeleteFilefromstudent}
                      updateAgentList={this.state.updateAgentList}
                      handleChangeAgentlist={this.handleChangeAgentlist}
                      submitUpdateAgentlist={this.submitUpdateAgentlist}
                      updateEditorList={this.state.updateEditorList}
                      handleChangeEditorlist={this.handleChangeEditorlist}
                      submitUpdateEditorlist={this.submitUpdateEditorlist}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {this.state.role === "Student" ? (
              <></>
            ) : (
              <Row>
                <Col className="m-b-30">
                  <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
                    <Tab eventKey="today" title="To Do list:">
                      {tabContent}
                    </Tab>
                    <Tab eventKey="week" title="Deadline overview">
                      {tabContent}
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            )}
          </Aux>
        );
      } else {
        return (
          <Aux>
            <Row>
              <Col>
                <div>
                  {" "}
                  Error: Can not get data. Please refresh the page again!{" "}
                </div>
              </Col>
            </Row>
          </Aux>
        );
      }
    }
  }
}

export default Dashboard;
