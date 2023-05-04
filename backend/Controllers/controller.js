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


exports.update = async (req, res) => {
  try {
    const { todo, description, category, date, tempUidd } = req.body;
    const filter = { _id: tempUidd };
    const update = {
      category,
      todo,
      description,
      date,
    };
    const result = await model.updateOne(filter, update);
    res.send(result);
  } catch (error) {
    console.log("Error in updateOne function", error);
    res.status(500).send(error.message);
  }
};

exports.getOne = async (req, res) => {
  try {
    let id = req.query.id;
    console.log("REquest in getOne",req);
    let data = await model.findOne({ _id: id });
    console.log(data);
    if (data) {
      res.send({ data: data });
    } 
    else {
      res.send({ data: "not found" });
    }
        
  } catch (error) {
    console.log("Error in getone function",error)
  }
};



exports.deleteOne = async (req, res) => {
  try {
    let id = req.query.id;
    console.log("REquest in delete",id);
    let result = await model.findByIdAndDelete(id);
    res.send(result);
    console.log(result);
  }
  catch (error) {
    console.log(error);
  }
};




exports.getAll = async (req, res) => {
  try {
    try {
      let pageLimit = 5;
      let page = parseInt(req.query.page);
      let skip = parseInt(pageLimit * (page - 1));
      let data = await model.find({}).skip(skip).limit(pageLimit).sort({ updatedAt: -1 });
      let count = await model.countDocuments({});
      let totalPages = parseInt(Math.ceil(count / pageLimit));
      res.send({ data: data, totalPages: totalPages, page: parseInt(req.query.page) || 1, totalRecords: count });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {}
};


