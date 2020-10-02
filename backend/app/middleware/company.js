const jwt = require("jsonwebtoken");
const User = require("../models/userModel");



module.exports.isCompany  = async (req,res,next) => { 
    try{
      const { authorization } = req.headers;
      if (!authorization) {
        return res.end("You are not authorized");
      }
      const token = authorization.replace("Bearer ", "");
      const { id } = jwt.decode(token)
      const currentUser = await User.findById(id)
      const {role } = currentUser
      
      if(!id || !currentUser || role == 'employee'){
        throw new Error('You are not authorized')
      }
      else{
        req.body.currentUser = currentUser
        req.body.token = token
        next()
      }
    }catch(err){
      res.end("You are not authorized");
    }
  }