const Documentation = require("../models/Documentation");

exports.ReadDocumentation = async (req, res) => {
  //TODO: Check user if they are able to access (Student/Agent)
  const Get_Documentation = await Documentation.find({
    Category_: "Application",
  });
  console.log(Get_Documentation);
  console.log("read articles success");

  return res.send({
    documents: Get_Documentation,
  });
};

exports.AddNewDocumentation = async (req, res) => {
  //TODO: Check user if they are able to modify (Student/Agent)
  console.log(req.body);
  let New_Documentation = new Documentation(req.body);
  await New_Documentation.save();
  console.log("add article success");

  return res.send({
    documents: New_Documentation,
  });
};
exports.UpdateDocumentation = async (req, res) => {
  //TODO: Check user if they are able to modify (Student/Agent)

  console.log("req.params.article_id = " + req.params.article_id);
  await Documentation.findByIdAndUpdate(req.params.article_id, req.body);
  // let ToBeUpdatedDoc = await Documentation.findById(req.params.article_id);
  // ToBeUpdatedDoc = req.body;
  // await ToBeUpdatedDoc.save();
  console.log("update article success");

  return res.send({
    success: true,
  });
};

exports.DeleteDocumentation = async (req, res) => {
  //TODO: Check user if they are able to modify (Student/Agent)

  console.log(req.params.article_id);
  await Documentation.findByIdAndDelete(req.params.article_id);
  //   const date_now = Date();
  //   let New_Documentation = new Documentation(req.body);
  //   New_Documentation.LastUpdate_ = date_now;
  //   await New_Documentation.save();
  console.log("delete article success");

  return res.send({
    success: true,
  });
};
