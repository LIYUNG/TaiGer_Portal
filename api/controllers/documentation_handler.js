const Documentation = require("../models/Documentation");
const Student = require("../models/Students");
const jwt_decode = require("jwt-decode");

exports.ReadDocumentation = async (req, res) => {
  console.log(req.params.article_category)
  const bearer = req.headers.authorization.split(" ");
  const token = bearer[1];
  // Extract user email info by token
  var emailaddress = jwt_decode(token);
  // Get user email
  emailaddress = emailaddress["emailaddress"];
  console.log(emailaddress);
  const students_exists = await Student.findOne({
    emailaddress_: emailaddress,
  });
  if (students_exists.role_ === "Guest") {
    return res.send({
      documents: [],
      isAbleToSee: false,
    });
  }
  const Get_Documentation = await Documentation.find({
    Category_: req.params.article_category,
  });
  console.log(Get_Documentation);
  console.log("read articles success");

  return res.send({
    documents: Get_Documentation,
    isAbleToSee: true,
  });
};

exports.AddNewDocumentation = async (req, res) => {
  const bearer = req.headers.authorization.split(" ");
  const token = bearer[1];
  // Extract user email info by token
  var emailaddress = jwt_decode(token);
  // Get user email
  emailaddress = emailaddress["emailaddress"];
  console.log(emailaddress);
  const students_exists = await Student.findOne({
    emailaddress_: emailaddress,
  });
  // Check user if they are able to modify (Student/Agent)
  if (students_exists.role_ === "Agent" || students_exists.role_ === "Admin") {
    let New_doc = req.body;
    delete New_doc._id;
    console.log("New_doc: " + JSON.stringify(New_doc));

    let New_Documentation = new Documentation(New_doc);
    console.log("New_Documentation: " + JSON.stringify(New_Documentation));
    await New_Documentation.save();
    console.log("add article success");
    return res.send({
      documents: New_Documentation,
    });
  } else {
    console.log("add article failed: Not authorized permission");
    return res.status(401).end();
  }
};
exports.UpdateDocumentation = async (req, res) => {

  const bearer = req.headers.authorization.split(" ");
  const token = bearer[1];
  // Extract user email info by token
  var emailaddress = jwt_decode(token);
  //Get user email
  emailaddress = emailaddress["emailaddress"];
  console.log(emailaddress);
  const students_exists = await Student.findOne({
    emailaddress_: emailaddress,
  });
  // Check user if they are able to modify (Student/Agent)
  if (students_exists.role_ === "Agent" || students_exists.role_ === "Admin") {
    console.log("req.params.article_id = " + req.params.article_id);
    await Documentation.findByIdAndUpdate(req.params.article_id, req.body);
    console.log("update article success");
    return res.send({
      success: true,
    });
  } else {
    console.log("update article failed: Not authorized permission");
    return res.status(401).end();
  }
};

exports.DeleteDocumentation = async (req, res) => {

  const bearer = req.headers.authorization.split(" ");
  const token = bearer[1];
  // Extract user email info by token
  var emailaddress = jwt_decode(token);
  // Get user email
  emailaddress = emailaddress["emailaddress"];
  console.log(emailaddress);
  const students_exists = await Student.findOne({
    emailaddress_: emailaddress,
  });
  // Check user if they are able to modify (Student/Agent)
  if (students_exists.role_ === "Agent" || students_exists.role_ === "Admin") {
    console.log(req.params.article_id);
    await Documentation.findByIdAndDelete(req.params.article_id);
    console.log("delete article success");
    return res.send({
      success: true,
    });
  } else {
    console.log("delete article failed: Not authorized permission");
    return res.status(401).end();
  }
};
