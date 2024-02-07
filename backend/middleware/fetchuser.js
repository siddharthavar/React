var jwt = require('jsonwebtoken');
const JWT_secret="this_is_siddharthather";
const User = require("../Models/User")
const fetchuser=(req, res, next)=>{
   
        const token= req.header("auth-token");
        if(!token) { res.status(401).send({msg: "No Token Provided!"})
    }
    try {
        const data =jwt.verify(token,JWT_secret);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({auth:false, message:"catch block"})
    }
}
module.exports =fetchuser;