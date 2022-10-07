const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  template_name: {
    type: String,
  },
  subject: {
    type: String,
  },
  body: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Template = mongoose.model("template", TemplateSchema);
