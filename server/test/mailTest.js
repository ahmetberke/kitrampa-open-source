const sendMail = require("../helper/email");
require('dotenv').config();

function Test(){
  const testReq = {headers:{host:"http://localhost:2000"}};
  const testUser = {email:"tuncel.ahmet.berke@gmail.com",id:"test",emailToken:"test"};

  sendMail.SendActivationMail(testReq, testUser)
}

Test()