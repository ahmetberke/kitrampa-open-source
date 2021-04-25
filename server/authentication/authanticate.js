const User = require('../models/user');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userResponse = require('../responses/userResponse');

module.exports = async (email, password) => {
  const user = await User.findOne({email:email, isDeleted:false, isBlocked:false});
  if (!user) return userResponse(false, 112);

  const match = await bcrypt.compare(password, user.password);

  if(!match) return userResponse(false, 113);
  if(!user.emailVerificated) return userResponse(false, 114);
  if(user.isFreezed){
    user.isFreezed = false
    await user.save();
  }

  const token = await jwt.sign({email:user.email, _id:user.id}, process.env.SECURITY_KEY, {expiresIn:"2h"});

  return userResponse(true, 110, null, {user:{email:user.email, username:user.username, profile:user.profile, address:user.address}, token:token});
}