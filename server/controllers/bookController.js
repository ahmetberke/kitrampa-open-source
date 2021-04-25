const User = require("../models/user");
const Book = require("../models/book");
const SwapBook = require("../models/swapBook");

const bookResponse = require("../responses/bookResponse");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const authanticate = require("../authentication/authanticate");
const axios = require('axios');
const SwapRequest = require("../models/swapRequest");


exports.test = async (req, res) => {
  try {
    const resp = await axios.get('https://www.googleapis.com/books/v1/volumes/LhaXE5LkOocC');
    const book = resp.data;
  }catch(err){
    if (err.isAxiosError) console.log("no book")
  }
  

}



exports.NewSwapBook = async (req, res) => {
  try{

    if (!req.userData) return res.status(200).send(bookResponse(false, 121));
    var refId = req.body.refId;
    var description = req.body.description;
    if (!refId || !description) return res.status(200).send(bookResponse(false, 115));

    var book = await Book.findOne({refId});
    

    if (!book) {

      var resp = await axios.get(`https://www.googleapis.com/books/v1/volumes/${refId}`)
      var data = resp.data;

      var book = Book({
        refId: data.id,
        title: data.volumeInfo.title,
        subtitle: data.volumeInfo.subtitle,
        authors: data.volumeInfo.authors, 
        publisher: data.volumeInfo.publisher, 
        publishedDate: data.volumeInfo.publishedDate,
        description: data.volumeInfo.description,
        industryIdentifiers: data.volumeInfo.industryIdentifiers,
        imageLinks: data.volumeInfo.imageLinks,
        language: data.volumeInfo.language,
        categories: data.volumeInfo.categories,
        createdDate: Date.now(),
        pageCount: data.volumeInfo.pageCount           
      });

      await book.save();
    }

    var swapBook = SwapBook({
      book: book,
      addedDate: Date.now(),
      description: description,
      user: req.userData
    });
    
    await swapBook.save();

    const updatedUser = await User.findByIdAndUpdate(req.userData.id, { $push: {bookList:swapBook}, lastUpdate: Date.now()}, {new:true});

    return res.status(200).send(bookResponse(true, 310, null, {user:updatedUser.username, book:{book:swapBook.book, addedDate:swapBook.addedDate, description:swapBook.description}}));

  }catch(err){
    if (err.isAxiosError) return res.status(200).send(bookResponse(false, 301))
    return res.status(200).send(bookResponse(false, 999))
  }
}


exports.RemoveSwapBook = async (req, res) => {
  try{
    
    if (!req.userData) return res.status(200).send(bookResponse(false, 121));

    var id = req.params.id;

    const swapBook = await SwapBook.findOneAndUpdate({_id:id, user:req.userData, isRemoved:false}, {isRemoved:true}, {new:true}).populate('user');
    if (!swapBook) return res.status(200).send(bookResponse(false, 321));
    
    return res.status(200).send(bookResponse(true, 320, null, {book:swapBook, user:req.userData.username}));

  }catch(err){
    console.log(err);
    return res.status(200).send(bookResponse(false, 999))
  }
}


exports.GetSwapBook = async (req, res) => {
  try{
    var id = req.params.id;
    if (!id) return res.status(200).send(bookResponse(false, 115, "id"));

    const swapBook = await SwapBook.findById({_id:id, isRemoved:false}).populate('user');
    if (!swapBook) return res.status(200).send(bookResponse(false, 321));
    var isLoggedUser = false;
    if (req.userData){
      if (req.userData.id === swapBook.user.id) isLoggedUser = true;
    }
    return res.status(200).send(bookResponse(true, 140, null, {book:swapBook, user:{username:swapBook.user.username, profile:swapBook.user.profile}, isLoggedUser:isLoggedUser}));
  

  }catch(err){
    console.log(err);
    return res.status(200).send(bookResponse(false, 999))
  }
}

exports.GetSwapBooks = async (req, res) => {
  try{
    var userId = req.body.userId;
    var limit = parseInt(req.query.limit, 10);
    
    if (!userId) return res.status(200).send(bookResponse(false, 115, "userId"));

    const user = await User.findById(userId);
    if (!user) return res.status(200).send(bookResponse(false, 102));

    max = 20
    if (!limit) limit = 20
    if (limit > max) limit = max;

    const swapBooks = await SwapBook.find({userId, isRemoved:false}).populate('user').sort({'createdDate':-1}).limit(limit);
    if (swapBooks.length === 0) return res.status(200).send(bookResponse(false, 321));

    var isLoggedUser = false;
    if (req.userData){
      if (userData.id === user.id) isLoggedUser = true;
    }
    return res.status(200).send(bookResponse(true, 140, null, {books:swapBooks, user:{username:user.username, profile:user.profile}, isLoggedUser:isLoggedUser}));
  
  }catch(err){
    console.log(err);
    return res.status(200).send(bookResponse(false, 999))
  }
}



exports.NewSwapRequest = async (req, res) => {
  try{
    
    if (!req.userData) return res.status(200).send(bookResponse(false, 121));

    // take data from body 
    var toBookIdList = req.body.toBooks;
    var fromBookIdList = req.body.fromBooks;
    var toUserId = req.body.toUserId;
    if (!fromBookIdList || !toBookIdList || !toUserId) return res.status(200).send(bookResponse(false, 115));

    // Get User
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(200).send(bookResponse(false, 102));

    // Get books and put verified lists
    var verifiedToBooks = [];
    var verifiedFromBooks = [];
    var book;
    await toBookIdList.forEach(async id => {
      book =  await SwapBook.findById(id);
      if (book) verifiedToBooks.push(book);
    });
    await fromBookIdList.forEach(async id => {
      book = await SwapBook.findById(id);
      if (book) verifiedFromBooks.push(book);
    });
    console.log(verifiedToBooks);
    if (verifiedToBooks.length === 0 || verifiedFromBooks === 0) return res.status(200).send(bookResponse(false, 330));

    // Create Swap Request
    const swapRequest = await SwapRequest({
      fromUser : req.userData,
      fromBooks : verifiedFromBooks,
      toUser : toUser,
      toBooks : verifiedToBooks
    })

    await swapRequest.save();

    return res.status(200).send(bookResponse(true, 331));

  }catch(err){
    console.log(err);
    return res.status(200).send(bookResponse(false, 999));
  }
}


exports.RemoveSwapRequest = async (req, res) => {
  try{
    
    if (!req.userData) return res.status(200).send(bookResponse(false, 121));

    // take data from body 
    var id = req.body.id;
    if (!id) return res.status(200).send(bookResponse(false, 115));

    // delete swap request
    const swapRequest = SwapRequest.findOneAndUpdate({_id:id, 'user.id':req.userData.id, isDeleted:false, isDone:false}, {isDeleted:true, finishedDate: Date.now()}, {new:true});
    if (!swapRequest) return res.status(200).send(bookResponse(false, 332)); 

    return res.status(200).send(bookResponse(true, 333));
    
  }catch(err){
    console.log(err);
    return res.status(200).send(bookResponse(false, 999));
  }
}



exports.GetSwapRequest = async (req, res) => {
  try{
    
    if (!req.userData) return res.status(200).send(bookResponse(false, 121));

    // take data from body 
    var id = req.params.id

    // get swap request
    const swapRequest = SwapRequest.findOne({_id:id, $or:[{'toUser.id':req.userData.id}, {'fromUser.id':req.userData.id}], isDeleted:false, isDone:false}).populate('user').populate('swapBook').populate('book');
    if (!swapRequest) return res.status(200).send(bookResponse(false, 332)); 
    
    const data = {
      toUser: {
        username : swapRequest.toUser.username,
        profile : swapRequest.toUser.profile
      }, 
      fromUser: {
        username :  swapRequest.fromUser.username,
        profile : swapRequest.fromUser.profile
      },
      toBooks : swapRequest.toBooks ,
      fromBooks : swapRequest.fromBooks,
      createdDate : swapRequest.createdDate,
      isDone : swapRequest.isDone,
      status : swapRequest.status
    }


    return res.status(200).send(bookResponse(true, 140, null, data));
        
  }catch(err){
    console.log(err);
    return res.status(200).send(bookResponse(false, 999));
  }
}



