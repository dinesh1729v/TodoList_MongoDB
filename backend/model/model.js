const { model, Schema } = require("mongoose");
const todoschema = new Schema(
  {
    category: { type: String },
    todo: { type: String },
    description: { type: String },
    date: { type: String },
    userId: { type: String  },
  },
  { timestamps: true }
);

module.exports = model("todo", todoschema);
