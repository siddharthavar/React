const mongoose = require('mongoose');
const { Schema } = mongoose;
const NoteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // reference to`  users` model
    title:{ type:String,required:[true,'Please provide a name for the blog']},
    description:{ type: String, required:[true,'Please provide a name for the blog'] },
    tag:{type : String , default: "general" },
    date:{ type :Date , default: Date.now}
  });

  module.exports = mongoose.model("Note",NoteSchema );