const model = require("../model/model");
const creatUser = require("../model/createuser");
exports.check = async (req, res) => {
  res.send("ok");
};
exports.login = async (req, res) => {
  try {
    let data = await creatUser.find({ email: req.query.email });
    console.log(data);
    if (data.length == 1) {
      if (data[0].password == req.query.password) {
        res.send({ data: true });
      } else {
        res.send({ data: false });
      }
    } else {
      res.send({ data: false });
    }
  } catch (error) {
    // res.send({})
  }
};

exports.signup = async (req, res) => {
  try {
    let data = await creatUser.find({ email: req.body.email });
    if (data.length == 0) {
      await creatUser.create(req.body);
      res.send({ data: "user create successful" });
    } else {
      res.send({ data: "user already exists" });
    }
  } catch (error) {
    res.send({ error: error });
  }
};

exports.createTodo = async (req, res) => {
  try {
    try {
      let data = await model.create(req.body);
      res.send({ data });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {}
};

exports.getAll = async (req, res) => {
  try {
    let pageLimit = 5;
    let page = parseInt(req.query.page);
    let skip = parseInt(pageLimit * (page - 1));
    let data = await model.find({ userId: req.query.userId }).skip(skip).limit(pageLimit).sort({ updatedAt: -1 });
    let count = await model.countDocuments({ userId: req.query.userId });
    let totalPages = parseInt(Math.ceil(count / pageLimit));
    res.send({ data: data, totalPages: totalPages, page: parseInt(req.query.page) || 1, totalRecords: count });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteOne = async (req, res) => {
  let id = req.params.id;
  await model.deleteOne({ _id: id });
  res.send({ msg: "Record Deleted Successfully", statusCode: 200 });
};

exports.edit = async (req, res) => {
  let id = req.params.id;
  await model.updateOne({ _id: id }, { $set: req.body });
  res.send({ msg: "Record Updated Successfully", statusCode: 200 });
};
