const mongoose = require("mongoose");

const thesisGroupSchema = new mongoose.Schema({
  userId:{type:String, required:true,unique:true},
  email: { type: String, required: true, unique:true },
  possibleDomains: [String],
  possibleTopics: [String],
  membersNeeded: { type: Number, required: true },
  currentMembers: { type: Number, required: true },
  supervisor: { type: String, default: "" },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ThesisGroup", thesisGroupSchema);
