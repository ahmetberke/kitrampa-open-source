const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  email : {
    type : String,
    lowercase:true,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  resetPassword : {
    digitCode : {type:Number},
    token : {type:String},
    isActivated : {type:Boolean}
  },
  username : {
    type : String,
    lowercase:true,
    required : true
  },
  createdDate : {
    type : Number,
    required : true
  },
  emailToken : {
    type : String,
    required : true
  },
  emailVerificated : {
    type : Boolean,
    default : false
  },
  newEmail : {
    type : String,
    default : ""
  },
  profile : {
    type : Object,
    default:{
      name:"",
      surname:"",
      photo:"1",
      description:"",
      birthday:"",
      showBirthday:true
    }
  },
  isDeleted : {
    type : Boolean,
    default : false
  },
  isFreezed : {
    type : Boolean,
    default : false
  },
  isBlocked : {
    type : Boolean,
    default : false
  },
  deletedDate : {
    type : Number,
    default : 0
  },
  freezedDate : {
    type : Number,
    default :0
  },
  blockedDate : {
    type : Number,
    default : 0
  },
  lastUpdate : {
    type : Number,
    default : 0
  },
  bookList : [{
    type : Schema.Types.ObjectId,
    ref : 'swapBook'
  }],
  swapHistory : [{
    type : Schema.Types.ObjectId,
    ref : 'swapRequest'
  }],
  followers : [{
    type : Schema.Types.ObjectId,
    ref : 'user'
  }],
  folowings : [{
    type : Schema.Types.ObjectId,
    ref : 'user'
  }],
  stage : {
    type : Number,
    default : 0
  },
  adminRole : {
    type : Number,
    default : 0
  },
  address : {
    type : Object,
    default : {
      province:"", 
      district:""
    }
  }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;