const Documentation = require("../models/Documentation");

exports.ReadDocumentation = async (req, res) => {
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
  console.log(req.body);
  let New_Documentation = new Documentation(req.body);
  await New_Documentation.save();
  console.log("add article success");

  return res.status(200).end();
};
exports.UpdateDocumentation = async (req, res) => {
  console.log("update article success");
  let ToBeUpdatedDoc = await Documentation.findById(req.body._id);
  console.log(ToBeUpdatedDoc);

  return res.status(200).end();
};

exports.DeleteDocumentation = async (req, res) => {
  console.log(req.params.article_id);
  await Documentation.findByIdAndDelete(req.params.article_id);
  //   const date_now = Date();
  //   let New_Documentation = new Documentation(req.body);
  //   New_Documentation.LastUpdate_ = date_now;
  //   await New_Documentation.save();
  console.log("delete article success");

  return res.status(200).end();
};
