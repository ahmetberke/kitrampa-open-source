const User = require("../models/user");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailSender = require("../helper/email");
const authanticate = require("../authentication/authanticate");

const userResponse = require('../responses/userResponse');
const provinces = require('../helper/jsonFiles/provinces.json');
const districts = require('../helper/jsonFiles/districts.json');

exports.Login = async (req, res) => {
  try{

    if (req.userData) return res.status(200).send(userResponse(false, 111));

    var email = req.body.email;
    var password = req.body.password;
    if(!email || !password) return res.status(200).send(userResponse(false, 115, message='email and password'));
    email = email.toLowerCase();

    var auth = await authanticate(email, password)
    if(!auth.success) return res.status(200).send(auth)
    return res.status(200).send(auth)

  } catch(err) {
    return res.status(200).send(userResponse(false, 999))
  }
}


exports.Register = async (req, res) => {
  try{
    if (req.userData) return res.status(200).send(userResponse(false, 111));
    
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) return res.status(200).send(userResponse(false, 115, "email and password"));
    var email = email.toLowerCase();

    // check: Is email used?
    var anotherUser = await User.findOne({email : email, emailVerificated: true, isDeleted:false});
    if (anotherUser) return res.status(200).send(userResponse(false, 101));
    
    // setting Username
    var username = await email.slice(0, email.indexOf('@')).toLowerCase();
    var thisUsernamedUsers = User.find({username: {$regex : "^" + username}, isDeleted:false});
    if (thisUsernamedUsers > 0) username = username + thisUsernamedUsers.length.toString();

    // password hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // keep time
    var now = Date.now();

    // creating new user 
    const newUser = new User({
      email: email,
      password: hashedPassword,
      username: username,
      emailToken : crypto.randomBytes(16).toString('hex'),
      createdDate : now,
      lastUpdate : now
    })
    await newUser.save();

    // sending activation link for email.
    emailSender.SendActivationMail(req, newUser);
    
    // and finish now return success and user
    return res.status(201).send(userResponse(true, 100, null, {username:newUser.username}));

  } catch(err) {

    return res.status(200).send(userResponse(false, 999));
  }
}



exports.VerifyEmail = async (req, res) => {
  try{

    var id = req.params.id;
    var token = req.query.token;
    console.log(id, token)

    if (!id || !token) return res.status(200).send(userResponse(false, 115));
    
    var userToBeActivated = await User.findOne({_id:id, emailToken:token});
    if (!userToBeActivated) return res.status(200).send(userResponse(false, 102));

    var isEmailUsed = await User.findOne({email:userToBeActivated.email, emailVerificated:true});
    if (isEmailUsed){
      await userToBeActivated.delete();
      return res.status(200).send(userResponse(false, 101));
    }

    var update = {emailVerificated:true, lastUpdate:Date.now()};
    if (userToBeActivated.newEmail.length > 0){
       update["email"] = userToBeActivated.newEmail
       update["newEmail"] = ""
    }
    var updatedUser = await User.findByIdAndUpdate(userToBeActivated.id, update, {new:true});

    return res.status(200).send(userResponse(true, 103));
    
  }catch(err){
    return res.status(200).send(userResponse(false, 999));
  }

}



exports.UpdateFunctions = {

  async changePassword(req, res){
    try{
      
      if(!req.userData) return res.status(200).send(userResponse(false, 121));

      var oldPassword = req.body.oldPassword;
      var newPassword = req.body.newPassword;
      if(!oldPassword || !newPassword) return res.status(200).send(userResponse(false, 115, "oldPassword and newPassword"));

      //find user
      const user = await User.findById(req.userData.id);
      if (!user) return res.status(200).send(userResponse(false, 102));

      // check old password
      const match = await bcrypt.compare(oldPassword, user.password);
      if(!match) return res.status(401).send(userResponse(false, 113));

      // password hashing
      const saltRounds = 10;
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(newPassword, saltRounds, (err, hash) => {
          if(err) reject(err);
          resolve(hash);
        });
      });

      // update user
      await user.updateOne({password:hashedPassword, lastUpdate:Date.now()}, {new:true});

      return res.status(200).send(userResponse(true, 120, 'password'));

    }catch(err){
      console.log(err);
      return res.status(200).send(userResponse(false, 999))
    }
  },


  async changeEmail(req, res){
    try{

      if(!req.userData) return res.status(200).send(userResponse(false, 121));

      var newEmail = req.body.newEmail;
      var password = req.body.password;
      if(!newEmail || !password) return res.status(200).send(userResponse(false, 115, "email and password"));
      newEmail = newEmail.toLowerCase();

      // Check password
      const match = await bcrypt.compare(password, req.userData.password);
      if(!match) return res.status(401).send(userResponse(false, 113));
            
      // If new email is not email
      if(newEmail === req.userData.email || newEmail === req.userData.newEmail) return res.status(200).send(userResponse(false, 122));

      // Is email using?
      const isUsed = await User.findOne({email:newEmail,emailVerificated:true, isDeleted:false});
      if (isUsed) return res.status(200).send(userResponse(false, 101));

      // user update
      const user = await User.findByIdAndUpdate(req.userData.id,{emailVerificated:false,newEmail:newEmail, emailToken:crypto.randomBytes(16).toString('hex'), lastUpdate:Date.now()}, {new:true});
      if (!user) return res.status(200).send(userResponse(false, 102)); 

      emailSender.SendReplacementMail(req, user, newEmail);

      return res.status(200).send(userResponse(true, 120, 'email', {email:user.email, newEmail:user.newEmail}));

    }catch(err){
      return res.status(200).send(userResponse(false, 999));
    }
    
  },


  async changeUsername(req, res) {
    try{

      if(!req.userData) return res.status(200).send(userResponse(false, 121));

      // check field
      var newUsername = req.body.newUsername;
      if (!newUsername) return res.status(200).send(userResponse(false, 115, "newUsername"));
      newUsername = newUsername.toLowerCase();

      // If new username is not username
      if(newUsername === req.userData.username) return res.status(200).send(userResponse(false, 122));

      // check: Is this username using
      const isUsed = await User.findOne({username:newUsername, isDeleted:false});
      if (isUsed) return res.status(200).send(userResponse(false, 123));
      
      // update user
      const user = await User.findOneAndUpdate(req.userData.id, {username:newUsername});
      if (!user) return res.status(200).send(userResponse(false, 999));

      return res.status(200).send(userResponse(true, 120, "username", {username: req.userData.username, newUsername:newUsername}));

    }catch(err){
      return res.status(200).send(userResponse(false, 999));
    }
  },


  async updateAddress(req, res) {
    try{

      if(!req.userData) return res.status(200).send(userResponse(false, 121));

      // check field
      var province = req.body.province;
      var district = req.body.district;
      if (!province && !district) return res.status(200).send(userResponse(false, 115, "province or district"));

      // If nothing changed, return
      if(province === req.userData.address.province && district === req.userData.address.district) return res.status(200).send(userResponse(false, 122));

      // update object's setting
      var update = {}
      if (province) {
        if(!provinces[province]) return res.status(200).send(userResponse(false, 124));
        update['address.province'] = province;
      }
      
      if (district){
        if(!districts[province][district]) return res.status(200).send(userResponse(false, 124));
          update['address.district'] = district
      }

      if (Object.keys(update).length == 0) return res.status(200).send(userResponse(false, 122));
      
      // address is updating
      var updatedUser = await User.findByIdAndUpdate(req.userData.id, update, {new:true});
      if (!updatedUser) return res.status(200).send(userResponse(false, 102));

      return res.status(200).send(userResponse(true, 120,'address', {user:{email:updatedUser.email, username:updatedUser.username, profile:updatedUser.profile, address:updatedUser.address}}));
      
    }catch(err){
      return res.status(200).send(userResponse(false, 999));
    }
  },


  async updateProfile(req, res) {
    try{

      if(!req.userData) return res.status(200).send(userResponse(false, 121));

      var newName = req.body.name;
      var newSurname = req.body.surname;
      var newPhoto = req.body.photo;
      var newDescription = req.body.description;
      var newBirthday = req.body.birthday;
      var showBirthday = req.body.showBirthday;
      var update = {lastUpdate:Date.now()}

      if(newName) {
        if(newName !== req.userData.profile.name) update['profile.name'] = newName;
      }
      if(newSurname) {
        if(newSurname !== req.userData.profile.surname) update['profile.surname'] = newSurname;
      }

      if(newPhoto) {
        if (newPhoto != req.userData.profile.photo) update['profile.photo'] = newPhoto;
      }
      
      if(newDescription) {
        if (newDescription !== req.userData.profile.description) update['profile.description'] = newDescription;
      }
      if(newBirthday) {
        if (newBirthday !== req.userData.profile.birthday) update['profile.birthday'] = newBirthday;
      }

      if(showBirthday === true) {
        if (req.userData.profile.showBirthday != true) update['profile.showBirthday'] = true;
      }
      if(showBirthday === false) {
        if (req.userData.profile.showBirthday != false) update['profile.showBirthday'] = false;
      }
      // check: Did something changed or updated
      if (Object.keys(update).length === 0) return res.status(200).send(userResponse(false, 122));
      var updatedUser = await User.findByIdAndUpdate(req.userData.id, update, {new:true});
      if (!updatedUser) return res.status(200).send(userResponse(false, 102));
      
      return res.status(200).send(userResponse(true, 120,'profile', {profile:updatedUser.profile}));

    }catch(err){
      console.log(err)
      return res.status(200).send(userResponse(false, 999));
    }
  } 
}



exports.Delete = async (req, res) => {
  try{
    if(!req.userData) return res.status(200).send(userResponse(false, 121));

    var now = Date.now();
    var update =  {isDeleted:true, deletedDate:now, lastUpdate:now};

    var deletedUser = await User.findByIdAndUpdate(req.userData.id, update, {new:true});
    if (!deletedUser) return res.status(200).send(userResponse(false, 102));

    return res.status(200).send(userResponse(true, 130));

  }catch(err){
    return res.status(200).send(userResponse(false, 999))
  }
}



exports.Freeze = async (req, res) => {
  try{
    if(!req.userData) return res.status(200).send(userResponse(false, 121));

    var now = Date.now();
    var update =  {isFreezed:true, freezedDate:now, lastUpdate:now};

    var freezedUser = await User.findByIdAndUpdate(req.userData.id, update, {new:true});
    if (!freezedUser) return res.status(200).send(userResponse(false, 102));

    return res.status(200).send(userResponse(true, 131));

  }catch(err){
    return res.status(200).send(userResponse(false, 999))
  }
}



exports.UserProfile = async (req, res) => {
  try{

    var username = req.params.username;

    var user = await User.findOne({username:username, isBlocked:false ,isFreezed:false, isDeleted:false});
    if (!user) return res.status(200).send(userResponse(false, 102));
    username = username.toLowerCase();

    var isLoggedUser = false
    if (req.userData) {
      if (req.userData.id === user.id){
        isLoggedUser = true;
      } 
    }

    return res.status(200).send(userResponse(true, 140, null, {isLoggedUser:isLoggedUser, user:{username:user.username, email:user.email, profile:user.profile, address:user.address}}));

  }catch(err){
    return res.status(200).send(userResponse(false, 999))
  }
}

exports.GetUserData = async (req, res) => {
  try{
    console.log(req.userData);
    if (!req.userData)  return res.status(200).send(userResponse(false, 102));
    return res.status(200).send(userResponse(true, 140, null, {user:{email:req.userData.email, username:req.userData.username, profile:req.userData.profile, address:req.userData.address}}));
  }catch(err){
    return res.status(200).send(userResponse(false, 999))
  }
}



exports.ForgetPassword = {
  async SendMail(req, res) {
    try{
      if(req.userData) return res.status(200).send(userResponse(false, 111));
      var email = req.query.email;
      if (!email) return res.status(200).send(userResponse(false, 115, "email"));
      
      var digitCode = Math.floor(Math.random() * 90000) + 10000
      var resetToken = crypto.randomBytes(16).toString('hex');

      const updatedUser = await User.findOneAndUpdate({email:email, isDeleted:false, isBlocked:false}, {lastUpdate:Date.now(), resetPassword:{digitCode:digitCode, token: resetToken, isActivated:true}});
      if (!updatedUser) return res.status(200).send(userResponse(false, 151));
      
      emailSender.SendResetPassword(req, updatedUser, digitCode);

      return res.status(200).send(userResponse(true, 150));
      


    }catch(err){
      console.log(err)
      return res.status(200).send(userResponse(false, 999))
    }
  },

  async TakeToken (req, res) {
    try {
      
      // return token for change password 

      var email = req.query.email;
      var digitCode = req.query.digitcode;
      if (!email || !digitCode) return res.status(200).send(userResponse(false, 115, "email and/or digitCode"));
      
      const user = await User.findOne({email:email, 'resetPassword.digitCode':digitCode, 'resetPassword.isActivated':true, isDeleted:false, isBlocked:false})
      if (!user) return res.status(200).send(userResponse(false, 102));
      
      return res.status(200).send(userResponse(true, 153,null, {email:user.email, token:user.resetPassword.token}));

    }catch(err){
      console.log(err)
      return res.status(200).send(userResponse(false, 999))
    }
  
  },

  async ResetPassword(req, res) {
    try {
     
      var email = req.query.email;
      var token = req.query.token;
      var newPassword = req.body.newPassword;
      if (!email || !token || !newPassword) return res.status(200).send(userResponse(false, 115, "query: email and/or token, body: newPassword"));
      
      //find user
      const user = await User.findOne({email:email, 'resetPassword.token':token, 'resetPassword.isActivated':true, isDeleted:false, isBlocked:false});
      if (!user) return res.status(200).send(userResponse(false, 102));

      // password hashing
      const saltRounds = 10;
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(newPassword, saltRounds, (err, hash) => {
          if(err) reject(err);
          resolve(hash);
        });
      });

      // update user
      await user.updateOne({password:hashedPassword, lastUpdate:Date.now(), resetPassword:{digitCode:"", token:"", isActivated:false}}, {new:true});

      return res.status(200).send(userResponse(true, 152, 'password'));

    }catch(err){
      return res.status(200).send(userResponse(false, 999))
    }
  }
}