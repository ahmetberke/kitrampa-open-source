const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {

    const token = req.headers['x-access-token'];

    if (!token) return res.status(403).end();
    
    const verify = await jwt.verify(token, process.env.SECURITY_KEY);

    if(verify.key !== process.env.ACCESS_KEY) return res.status(403).end();
    next();

  }catch{
    if (!token) return res.status(403).end();
  }

} 