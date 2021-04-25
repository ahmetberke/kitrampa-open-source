const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = Schema({
  refId : {
    type : String,
    required: true
  },
  title : {
    type : String,
    required: true
  },
  subtitle : {
    type : String,
    default : ""
  },
  authors : {
    type : Array,
    required: true
  },
  publisher : {
    type : String,
    required:true
  },
  publishedDate : {
    type : String,
    required : true
  },
  description : {
    type : String,
    default : ""
  },
  industryIdentifiers : {
    type : Array,
    required : true
  },
  imageLinks : {
    type : Object,
    required : true
  },
  language: {
    type : String,
    default: 'tr'
  },
  categories : {
    type : Array,
  },
  createdDate : {
    type : Number,
    required : true
  },
  pageCount : {
    type : Number,
    required : true
  }
});

const Book = mongoose.model('book', BookSchema);
module.exports = Book;