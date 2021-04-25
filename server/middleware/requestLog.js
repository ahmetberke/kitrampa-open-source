NowDate = () => {
  return `[${new Date().toLocaleString()}]`;
}

MethodAndUrl = (req) => {
  return ` ${req.method.toUpperCase()} to '${req.originalUrl}'`;
}

RemoteAddress = (req) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return `[${ip}]`;
}

LoggedUser = (req) => {
  if (req.userData) {
    return `[${req.userData.email}]`;
  }else{
    return "";
  }
}

Logger = (req) => {
  return NowDate() + RemoteAddress(req) + LoggedUser(req)  + MethodAndUrl(req);
}

module.exports = (req, res, next) => {
  console.log(Logger(req));
  next();
}