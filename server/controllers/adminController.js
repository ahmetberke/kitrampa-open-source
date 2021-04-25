const User = require("../models/user");

const adminResponse = require('../responses/adminResponse');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const authanticate = require("../authentication/authanticate");
const { read } = require("fs");


exports.BlockUser = async (req, res) => {
  try{

    var userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(200).send(adminResponse(false, 102));

    if (req.userData.adminRole <= user.adminRole) return res.status(403).send(adminResponse(false, 201));
    if (user.isBlocked) return res.status(200).send(adminResponse(false, 202))
    var now = Date.now();
    await user.updateOne({lastUpdate:now, blockedDate:now, isBlocked:true});

    return res.status(200).send(adminResponse(true, 200, null, {username:user.username}));

  }catch(err){
    return res.status(200).send(adminResponse(false, 999));
  }
}

exports.UnblockUser = async (req, res) => {
  try{

    var userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(200).send(adminResponse(false, 102));

    if (req.userData.adminRole <= user.adminRole) return res.status(403).send(adminResponse(false, 201));
    if (!user.isBlocked) return res.status(200).send(adminResponse(false, 203))

    var now = Date.now();
    await user.updateOne({lastUpdate:now, isBlocked:false});

    return res.status(200).send(adminResponse(true, 204, null, {username:user.username}));

  }catch(err){
    return res.status(200).send(adminResponse(false, 999));
  }
}