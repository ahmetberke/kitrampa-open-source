module.exports = (req, res, next) =>{
  if (!req.isAdmin) return res.status(403).end();
  next();
}