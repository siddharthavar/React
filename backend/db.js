const mongoose = require("mongoose");
const mongoUrl ="mongodb://localhost:27017/test"; // 连接地址

const connectToMongo = ()=>{mongoose.connect(mongoUrl )}
console.log("connection established");
module.exports=  connectToMongo;