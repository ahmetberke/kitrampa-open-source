const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SwapRequestSchema = Schema({
  fromUser : {
    type : Schema.Types.ObjectId,
    ref : 'user',
    required : true
  },
  fromBooks : [{
    type : Schema.Types.ObjectId,
    ref : 'swapBook',
    required : true
  }],
  toUser : {
    type : Schema.Types.ObjectId,
    ref : 'user',
    required : true
  },
  toBooks : [{
    type : Schema.Types.ObjectId,
    ref : 'swapBook',
    required : true
  }],
  createdDate : {
    type : Number,
    default : Date.now()
  },
  isDone : {
    type : Boolean,
    default : false
  },
  finishedDate : {
    type : Number,
    default : 0
  },
  isDeleted : {
    type : Boolean,
    default : false
  },
  status : {
    type : Number,
    default : 0
  }
});

const SwapRequest = mongoose.model('swapRequest', SwapRequestSchema);
module.exports = SwapRequest;