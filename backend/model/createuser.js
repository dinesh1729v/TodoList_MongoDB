const { model, Schema } = require("mongoose");
const usercreate = new Schema(
  {
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

module.exports = model("todoUser", usercreate);
