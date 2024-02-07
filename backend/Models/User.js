const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{ type:String,required:[true,'Please provide a name for the blog']},
    email:{ type: String, required:[true,'Please provide a name for the blog'] , unique: true},
    password:{type : String , required: [true,"please enter your password"] },
    date:{ type :Date , default: Date.now}
  });
const user= mongoose.model("User", UserSchema);
user.createIndexes();
module.exports = user;
