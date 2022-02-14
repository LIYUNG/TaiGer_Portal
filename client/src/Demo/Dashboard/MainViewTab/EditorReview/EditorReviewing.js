import React from "react";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineUndo,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import { uploadforstudent } from "../../../api";
import { Link } from "react-router-dom";

class EditorReviewing extends React.Component {
  render() {
    var applying_university_ML;
    var applying_university;
    var applying_program;
    var application_deadline;
    var application_ML_template_ToBefilled;
    var general_RL_A_template_ToBefilled;
    var general_RL_B_template_ToBefilled;
    var general_RL_C_template_ToBefilled;
    var general_CV_template_ToBefilled;
    var application_ML_template_filled;
    var general_RL_A_template_filled;
    var general_RL_B_template_filled;
    var general_RL_C_template_filled;
    var general_CV_template_filled;
    var application_ML_status;
    var general_RL_A_status;
    var general_RL_B_status;
    var general_RL_C_status;
    var general_CV_status;
    var finished_RL_A;
    var finished_RL_B;
    var finished_RL_C;
    var finished_CV;
    var finished_application_ML;
    var application_ML_Lastupdate;
    var general_RL_A_Lastupdate;
    var general_RL_B_Lastupdate;
    var general_RL_C_Lastupdate;
    var general_CV_Lastupdate;
    if (
      this.props.student.applications === undefined ||
      this.props.student.applications.length === 0
    ) {
      applying_university = <></>;
      applying_program = <></>;
      application_deadline = <></>;
    } else {
      applying_university_ML = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <h6 className="mb-1" key={application._id}>
                ML
              </h6>
            ) : (
              <></>
            )}
          </>
        )
      );
      applying_university = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <h6 className="mb-1" key={application._id}>
                {application.programId.school}
              </h6>
            ) : (
              <></>
            )}
          </>
        )
      );
      applying_program = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <h6 className="mb-1" key={application._id}>
                {application.programId.program}
              </h6>
            ) : (
              <></>
            )}
          </>
        )
      );
      application_deadline = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <h6 className="mb-1" key={application._id}>
                {application.programId.application_deadline}
              </h6>
            ) : (
              <></>
            )}
          </>
        )
      );
      application_ML_Lastupdate = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {application.student_inputs &&
                application.student_inputs.findIndex((doc) =>
                  doc.name.includes("ML_Template")
                ) !== -1 ? (
                  <h6 className="mb-1" key={application._id}>
                    {new Date(
                      application.student_inputs[
                        application.student_inputs.findIndex((doc) =>
                          doc.name.includes("ML_Template")
                        )
                      ].updatedAt
                    ).toLocaleDateString()}
                    {", "}
                    {new Date(
                      application.student_inputs[
                        application.student_inputs.findIndex((doc) =>
                          doc.name.includes("ML_Template")
                        )
                      ].updatedAt
                    ).toLocaleTimeString()}
                  </h6>
                ) : (
                  <h6 className="mb-1" key={i}>
                    Not existed
                  </h6>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
      application_ML_template_filled = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {application.student_inputs &&
                application.student_inputs.findIndex((doc) =>
                  doc.name.includes("ML_Template")
                ) !== -1 &&
                application.documents &&
                application.documents.findIndex(
                  (doc) =>
                    doc.name.includes("ML") && doc.isFinalVersion === true
                ) === -1 ? (
                  application.documents &&
                  application.documents.findIndex(
                    (doc) =>
                      doc.name.includes("ML") &&
                      (doc.isReceivedFeedback === false ||
                        doc.isReceivedFeedback === undefined)
                  ) !== -1 ? (
                    <></>
                  ) : (
                    <>
                      <h6 className="mb-1" key={application._id}>
                        ML - {application.programId.school}
                        {" - "}
                        {application.programId.program}
                      </h6>
                    </>
                  )
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
      //For editor
      application_ML_status = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {application.documents &&
                application.documents.findIndex((doc) =>
                  doc.name.includes("ML")
                ) !== -1 ? (
                  application.documents &&
                  application.documents.findIndex(
                    (doc) =>
                      doc.name.includes("ML") && doc.isFinalVersion === true
                  ) !== -1 ? (
                    <></>
                  ) : application.documents &&
                    application.documents.findIndex(
                      (doc) =>
                        doc.name.includes("ML") &&
                        (doc.isReceivedFeedback === false ||
                          doc.isReceivedFeedback === undefined)
                    ) !== -1 ? (
                    <>
                      <h6 className="mb-1" key={application._id}>
                        ML - {application.programId.school}
                        {" - "}
                        {application.programId.program}
                      </h6>
                    </>
                  ) : (
                    <></>
                  )
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
      finished_application_ML = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {application.documents &&
                application.documents.findIndex(
                  (doc) =>
                    doc.name.includes("_ML") &&
                    doc.isFinalVersion !== undefined &&
                    doc.isFinalVersion === true
                ) !== -1 ? (
                  <h6 className="mb-1" key={application._id}>
                    <IoCheckmarkCircle
                      size={18}
                      color="limegreen"
                      title="Final Version"
                    />{" "}
                    ML - {application.programId.school}
                    {" - "}
                    {application.programId.program}
                  </h6>
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
      application_ML_template_ToBefilled = this.props.student.applications.map(
        (application, i) => (
          <>
            {application.decided !== undefined &&
            application.decided === true ? (
              <>
                {(application.student_inputs &&
                  application.student_inputs.findIndex((doc) =>
                    doc.name.includes("ML_Template")
                  )) === -1 &&
                application.documents &&
                application.documents.findIndex((doc) =>
                  doc.name.includes("ML")
                ) === -1 &&
                (application.programId.ml_required === "yes" ||
                  application.programId.ml_required === "Yes") ? (
                  <h6 className="mb-1" key={application._id}>
                    <AiFillQuestionCircle
                      size={18}
                      color="lightgray"
                      title="No Document uploaded"
                    />{" "}
                    ML - {application.programId.school}
                    {" - "}
                    {application.programId.program}
                  </h6>
                ) : (
                  // TODO: add new case: replace prepared by "programId.requiredML?"
                  <> </>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        )
      );
    }

    if (
      this.props.student.generaldocs === undefined ||
      this.props.student.generaldocs.editoroutputs === undefined ||
      this.props.student.generaldocs.editoroutputs.length === 0
    ) {
      general_CV_status = <></>;
      general_RL_A_status = <></>;
      general_RL_B_status = <></>;
      general_RL_C_status = <></>;
    } else {
      //For Editor: (TODO: add another flags: student read, editor read?)
      general_RL_A_status =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (
            doc //TODO: get the latest RL and isReceivedFeedback flag
          ) => doc.name.includes("RL_A")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex(
            (
              doc //TODO: get the latest RL and isReceivedFeedback flag
            ) =>
              doc.name.includes("RL_A") &&
              doc.isReceivedFeedback === false &&
              doc.isFinalVersion === false
          ) !== -1 ? (
            <h6 className="mb-1" key={10}>
              RL (Referee A) Revised
            </h6>
          ) : (
            <></>
          )
        ) : (
          <></>
        );
      general_RL_B_status =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (
            doc //TODO: get the latest RL and isReceivedFeedback flag
          ) => doc.name.includes("RL_B")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex(
            (
              doc //TODO: get the latest RL and isReceivedFeedback flag
            ) =>
              doc.name.includes("RL_B") &&
              doc.isReceivedFeedback === false &&
              doc.isFinalVersion === false
          ) !== -1 ? (
            <h6 className="mb-1" key={10}>
              RL (Referee B) Revised
            </h6>
          ) : (
            <></>
          )
        ) : (
          <></>
        );
      general_RL_C_status =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (
            doc //TODO: get the latest RL and isReceivedFeedback flag
          ) => doc.name.includes("RL_C")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex(
            (
              doc //TODO: get the latest RL and isReceivedFeedback flag
            ) =>
              doc.name.includes("RL_C") &&
              doc.isReceivedFeedback === false &&
              doc.isFinalVersion === false
          ) !== -1 ? (
            <h6 className="mb-1" key={10}>
              RL (Referee C) Revised
            </h6>
          ) : (
            <></>
          )
        ) : (
          <></>
        );
      general_CV_status =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (
            doc //TODO: get the latest CV and isReceivedFeedback flag
          ) => doc.name.includes("CV")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex(
            (
              doc //TODO: get the latest RL and isReceivedFeedback flag
            ) => doc.name.includes("CV") && doc.isFinalVersion === true
          ) !== -1 ? (
            <></>
          ) : (
            <h6 className="mb-1" key={1}>
              CV Revised
            </h6>
          )
        ) : (
          <></>
        );
      finished_CV =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (doc) => doc.name.includes("CV") && doc.isFinalVersion
        ) !== -1 ? (
          <>
            <h6 className="mb-1" key={1}>
              <IoCheckmarkCircle
                size={18}
                color="limegreen"
                title="Final Version"
              />{" "}
              CV {" - "}- Final
            </h6>
          </>
        ) : (
          // TODO: add new case: replace prepared by "programId.requiredML?"
          <></>
        );
      finished_RL_A =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (doc) => doc.name.includes("RL_A") && doc.isFinalVersion
        ) !== -1 ? (
          <h6 className="mb-1" key={10}>
            <IoCheckmarkCircle
              size={18}
              color="limegreen"
              title="Final Version"
            />
            RL (Referee A)-- Final
          </h6>
        ) : (
          // TODO: add new case: replace prepared by "programId.requiredML?"
          <></>
        );
      finished_RL_B =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (doc) => doc.name.includes("RL_B") && doc.isFinalVersion
        ) !== -1 ? (
          <h6 className="mb-1" key={10}>
            <IoCheckmarkCircle
              size={18}
              color="limegreen"
              title="Final Version"
            />
            RL (Referee B)-- Final
          </h6>
        ) : (
          // TODO: add new case: replace prepared by "programId.requiredML?"
          <></>
        );
      finished_RL_C =
        this.props.student.generaldocs.editoroutputs.findIndex(
          (doc) => doc.name.includes("RL_C") && doc.isFinalVersion
        ) !== -1 ? (
          <h6 className="mb-1" key={10}>
            <IoCheckmarkCircle
              size={18}
              color="limegreen"
              title="Final Version"
            />
            RL (Referee C)-- Final
          </h6>
        ) : (
          // TODO: add new case: replace prepared by "programId.requiredML?"
          <></>
        );
    }

    if (
      this.props.student.generaldocs === undefined ||
      this.props.student.generaldocs.studentinputs === undefined ||
      this.props.student.generaldocs.studentinputs.length === 0
    ) {
      general_CV_template_filled = <></>;
      general_RL_A_template_filled = <></>;
      general_RL_B_template_filled = <></>;
      general_RL_C_template_filled = <></>;
      general_CV_template_ToBefilled = (
        <h6 className="mb-1" key={1}>
          <AiFillQuestionCircle
            size={18}
            color="lightgray"
            title="No Document uploaded"
          />{" "}
          CV template
        </h6>
      );
      general_RL_A_template_ToBefilled = (
        <h6 className="mb-1" key={10}>
          <AiFillQuestionCircle
            size={18}
            color="lightgray"
            title="No Document uploaded"
          />{" "}
          RL template (Referee A)
        </h6>
      );
      general_RL_B_template_ToBefilled = (
        <h6 className="mb-1" key={10}>
          <AiFillQuestionCircle
            size={18}
            color="lightgray"
            title="No Document uploaded"
          />{" "}
          RL template (Referee B)
        </h6>
      );
      general_RL_C_template_ToBefilled = (
        <h6 className="mb-1" key={10}>
          <AiFillQuestionCircle
            size={18}
            color="lightgray"
            title="No Document uploaded"
          />{" "}
          RL template (Referee C)
        </h6>
      );
      general_CV_Lastupdate = (
        <h6 className="mb-1" key={1}>
          Not existed
        </h6>
      );
      general_RL_A_Lastupdate = (
        <h6 className="mb-1" key={10}>
          Not existed
        </h6>
      );
    } else {
      general_CV_template_filled =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("CV_Template")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
            doc.name.includes("CV")
          ) === -1 ? (
            <h6 className="mb-1" key={1}>
              CV template filled
            </h6>
          ) : (
            <></>
          )
        ) : (
          <></>
        );

      general_CV_Lastupdate =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("CV_Template")
        ) !== -1 ? (
          <h6 className="mb-1" key={1}>
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("CV_Template")
                )
              ].updatedAt
            ).toLocaleDateString()}
            {", "}
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("CV_Template")
                )
              ].updatedAt
            ).toLocaleTimeString()}
          </h6>
        ) : (
          <h6 className="mb-1" key={1}>
            Not existed
          </h6>
        );
      general_RL_A_template_filled =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("RL_A_Template")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
            doc.name.includes("RL_A")
          ) !== -1 ? (
            this.props.student.generaldocs.editoroutputs.findIndex(
              (doc) =>
                doc.name.includes("RL_A") &&
                doc.isReceivedFeedback === true &&
                doc.isFinalVersion === false
            ) !== -1 ? (
              this.props.student.generaldocs.editoroutputs.findIndex(
                (doc) =>
                  doc.name.includes("RL_A") &&
                  doc.isReceivedFeedback === false &&
                  doc.isFinalVersion === false
              ) !== -1 ? (
                <></>
              ) : (
                <h6 className="mb-1" key={10}>
                  RL (Referee A) received feedback
                </h6>
              )
            ) : (
              <></>
            )
          ) : (
            <h6 className="mb-1" key={10}>
              RL (Referee A) template filled
            </h6>
          )
        ) : (
          <></>
        );

      general_RL_A_Lastupdate =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("RL_A_Template")
        ) !== -1 ? (
          <h6 className="mb-1" key={10}>
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("RL_A_Template")
                )
              ].updatedAt
            ).toLocaleDateString()}
            {", "}
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("RL_A_Template")
                )
              ].updatedAt
            ).toLocaleTimeString()}
          </h6>
        ) : (
          <h6 className="mb-1" key={10}>
            Not existed
          </h6>
        );

      general_RL_B_template_filled =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("RL_B_Template")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
            doc.name.includes("RL_B")
          ) !== -1 ? (
            this.props.student.generaldocs.editoroutputs.findIndex(
              (doc) =>
                doc.name.includes("RL_B") &&
                doc.isReceivedFeedback === true &&
                doc.isFinalVersion === false
            ) !== -1 ? (
              this.props.student.generaldocs.editoroutputs.findIndex(
                (doc) =>
                  doc.name.includes("RL_B") &&
                  doc.isReceivedFeedback === true &&
                  doc.isFinalVersion === false
              ) !== -1 ? (
                <></>
              ) : (
                <h6 className="mb-1" key={10}>
                  RL (Referee B) received feedback
                </h6>
              )
            ) : (
              <></>
            )
          ) : (
            <h6 className="mb-1" key={10}>
              RL (Referee B) template filled
            </h6>
          )
        ) : (
          <></>
        );

      general_RL_B_Lastupdate =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("RL_B_Template")
        ) !== -1 ? (
          <h6 className="mb-1" key={10}>
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("RL_B_Template")
                )
              ].updatedAt
            ).toLocaleDateString()}
            {", "}
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("RL_B_Template")
                )
              ].updatedAt
            ).toLocaleTimeString()}
          </h6>
        ) : (
          <h6 className="mb-1" key={10}>
            Not existed
          </h6>
        );

      general_RL_C_template_filled =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("RL_C_Template")
        ) !== -1 ? (
          this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
            doc.name.includes("RL_C")
          ) !== -1 ? (
            this.props.student.generaldocs.editoroutputs.findIndex(
              (doc) =>
                doc.name.includes("RL_C") &&
                doc.isReceivedFeedback === true &&
                doc.isFinalVersion === false
            ) !== -1 ? (
              this.props.student.generaldocs.editoroutputs.findIndex(
                (doc) =>
                  doc.name.includes("RL_C") &&
                  doc.isReceivedFeedback === true &&
                  doc.isFinalVersion === false
              ) !== -1 ? (
                <></>
              ) : (
                <h6 className="mb-1" key={10}>
                  RL (Referee C) received feedback
                </h6>
              )
            ) : (
              <></>
            )
          ) : (
            <h6 className="mb-1" key={10}>
              RL (Referee C) template filled
            </h6>
          )
        ) : (
          <></>
        );

      general_RL_C_Lastupdate =
        this.props.student.generaldocs.studentinputs.findIndex((doc) =>
          doc.name.includes("RL_C_Template")
        ) !== -1 ? (
          <h6 className="mb-1" key={10}>
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("RL_C_Template")
                )
              ].updatedAt
            ).toLocaleDateString()}
            {", "}
            {new Date(
              this.props.student.generaldocs.studentinputs[
                this.props.student.generaldocs.studentinputs.findIndex((doc) =>
                  doc.name.includes("RL_C_Template")
                )
              ].updatedAt
            ).toLocaleTimeString()}
          </h6>
        ) : (
          <h6 className="mb-1" key={10}>
            Not existed
          </h6>
        );
    }
    general_RL_A_template_ToBefilled =
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.studentinputs !== undefined &&
      this.props.student.generaldocs.studentinputs.findIndex((doc) =>
        doc.name.includes("RL_A_Template")
      ) === -1 &&
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.editoroutputs !== undefined &&
      this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
        doc.name.includes("RL_A")
      ) === -1 ? (
        <h6 className="mb-1" key={10}>
          <AiFillQuestionCircle
            size={18}
            color="lightgray"
            title="No Document uploaded"
          />{" "}
          RL template (Referee A)
        </h6>
      ) : (
        <></>
      );
    general_RL_B_template_ToBefilled =
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.studentinputs !== undefined &&
      this.props.student.generaldocs.studentinputs.findIndex((doc) =>
        doc.name.includes("RL_B_Template")
      ) === -1 &&
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.editoroutputs !== undefined &&
      this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
        doc.name.includes("RL_B")
      ) === -1 ? (
        <h6 className="mb-1" key={10}>
          <AiFillQuestionCircle
            size={18}
            color="lightgray"
            title="No Document uploaded"
          />{" "}
          RL template (Referee B)
        </h6>
      ) : (
        <></>
      );

    general_RL_C_template_ToBefilled =
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.studentinputs !== undefined &&
      this.props.student.generaldocs.studentinputs.findIndex((doc) =>
        doc.name.includes("RL_C_Template")
      ) === -1 &&
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.editoroutputs !== undefined &&
      this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
        doc.name.includes("RL_C")
      ) === -1 ? (
        <h6 className="mb-1" key={10}>
          <AiFillQuestionCircle
            size={18}
            color="lightgray"
            title="No Document uploaded"
          />{" "}
          RL template (Referee C)
        </h6>
      ) : (
        <></>
      );
    general_CV_template_ToBefilled =
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.studentinputs !== undefined &&
      this.props.student.generaldocs.studentinputs.findIndex((doc) =>
        doc.name.includes("CV_Template")
      ) === -1 &&
      this.props.student.generaldocs !== undefined &&
      this.props.student.generaldocs.editoroutputs !== undefined &&
      this.props.student.generaldocs.editoroutputs.findIndex((doc) =>
        doc.name.includes("CV")
      ) === -1 ? (
        <h6 className="mb-1" key={1}>
          <AiFillQuestionCircle
            size={18}
            color="lightgray"
            title="No Document uploaded"
          />{" "}
          CV - Template
        </h6>
      ) : (
        <></>
      );
    return (
      <>
        <tr>
          {this.props.role !== "Student" ? (
            <>
              <td>
                <Link
                  to={
                    "/student-database/" +
                    this.props.student._id +
                    "/application-files"
                  }
                >
                  {this.props.student.firstname}
                  {" - "}
                  {this.props.student.lastname}
                </Link>
              </td>
              <td>
                {general_CV_template_ToBefilled}
                {general_RL_A_template_ToBefilled}
                {general_RL_B_template_ToBefilled}
                {general_RL_C_template_ToBefilled}
                {application_ML_template_ToBefilled}
              </td>
            </>
          ) : (
            <></>
          )}

          <td>
            {general_RL_A_template_filled}
            {general_RL_B_template_filled}
            {general_RL_C_template_filled}
            {general_CV_template_filled}
            {application_ML_template_filled}
          </td>
          {this.props.role !== "Student" ? (
            <td>
              {general_RL_A_status}
              {general_RL_B_status}
              {general_RL_C_status}
              {general_CV_status}
              {application_ML_status}
            </td>
          ) : (
            <></>
          )}
          {this.props.role !== "Student" ? (
            <td>
              {finished_RL_A}
              {finished_RL_B}
              {finished_RL_C}
              {finished_CV}
              {finished_application_ML}
            </td>
          ) : (
            <></>
          )}
        </tr>
      </>
    );
  }
}

export default EditorReviewing;
