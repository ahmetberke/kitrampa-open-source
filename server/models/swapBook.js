const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SwapBookSchema = Schema({
  book : {
    type : Schema.Types.ObjectId,
    ref : 'book'
  },
  user : {
    type : Schema.Types.ObjectId,
    ref : 'user'
  },
  description : {
    type : String,
    default : ''
  },
  views : {
    type : Schema.Types.ObjectId,
    ref : 'category'
  },
  addedDate : {
    type : Number,
    required : true
  },
  isRemoved : {
    type : Boolean,
    default : false
  },
  incomingRequests : [{
    type : Schema.Types.ObjectId,
    ref : 'swapRequest'
  }],
  outgoingRequests : [{
    type : Schema.Types.ObjectId,
    ref : 'swapRequest'
  }]
});

const SwapBook = mongoose.model('swapBook', SwapBookSchema);
module.exports = SwapBook;
