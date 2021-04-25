const User = require('../models/user');

const jwt = require('jsonwebtoken');

module.exports= async (req, res, next) => {
  try {
    if(req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = await jwt.verify(token, process.env.SECURITY_KEY);
      const user = await User.findOne({_id: decodedToken._id, emailVerificated:true, isDeleted:false});
      if (!user) {
        req.userData = null
      }else{
        req.userData = user
      }
  
      if (user.adminRole > 0) {
        req.isAdmin = true
      }else{
        req.isAdmin = false
      }
    }

    next();

  }catch(error){
    req.isAdmin = false
    next();
  }
}
