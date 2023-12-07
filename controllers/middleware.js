const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');
const User = mongoose.model('Userdata');
require('dotenv').config();
const jwt=require("jsonwebtoken");
const JWT_SERECTKEY=process.env.JWT_SERECTKEY;

exports.middleware = (req,res,next) =>{
      const {authorization} =req.headers
      if(!authorization){
          return res.status(401).json({error:"you must be logged in"})
      }
      const token=authorization.replace("Bearer ","")
      jwt.verify(token,JWT_SERECTKEY,(err,payload)=>{
          if(err)
          {
              return res.status(401).json({error:"you must be logged in"})
          }
          const {_id}=payload
          User.findById(_id).then(userdata=>{
              req.user=userdata
              next()
          })  
      })
  } 