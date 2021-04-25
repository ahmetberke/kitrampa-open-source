const codes = require("./codes.json");

const Response  = {
  success:false,
  code:"",
  message:"",
  data:null
}

module.exports =  (success, code, message, data) => {
  var r = Object.create(Response);
  
  r.success = success
  r.code = code.toString();
  r.message = codes[r.code];

  if(message) r.message += ` (${message})`;
  
  if(data){
    r.data = data
  }else{
    r.data = null
  }


  return r;
}