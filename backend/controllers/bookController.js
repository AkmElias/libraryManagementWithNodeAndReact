const express = require("express");
const mongodb = require('mongodb');

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verify = require("../verifytoken");
const Book = require("../models/Book");
const User = require("../models/User");
const Review = require("../models/Review")
const Bookmark = require('../models/Bookmark');

const { bookValidation } = require("../validation");

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

exports.addBook = async (req, res, next) => {
  if (req.user.role === "admin") {
    //validate before creating a new book
    const { error } = bookValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    //add book
    const book = new Book({
      name: req.body.name,
      author: req.body.author,
      category: req.body.category ? req.body.category : "Novel/Drama",
      rating: req.body.rating ? req.body.rating : 5,
      paid: req.body.paid ? req.body.paid : false,
      price: req.body.price ? req.body.price : 0.0,
    });

    try {
      const bokkAdded = await book.save();
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  } else {
    return res.status(401).send("not authorized.");
  }
};

exports.viewBook = async (req,res,next) => {
    try{
     
    const book = await Book.findById({_id: req.params.bookId});
    const reviews = await Review.find({bookId: req.params.bookId});
    
    let everythingAboutTheBook = {
       bookId: book._id,
       // @ts-ignore
       bookName: book.name,
       // @ts-ignore
       bookAuthor: book.author,
       // @ts-ignore
       bookPrice: book.price ,
       reviews:  reviews  
    }
    res.status(200).send(everythingAboutTheBook)
    } catch(err) {
        res.status(400).json({ message: err });
    }
}

exports.bookmark = async (req,res,next) => {
   
    const bookMark = new Bookmark({
        userId: req.user._id,
        bookId: req.params.bookId
    })

    try{
      const bookmarked = await bookMark.save()
      res.status(201).send(bookmarked)
    } catch(err) {
      res.status(401).send(err)
    }
}

exports.editBook = async (req, res, next) => {
  if (req.user.role === "admin") {
    //  //checking validation
    //  const {error} = bookValidation(req.body);
    //  if (error)
    //  return res.status(400).send({message: error.details[0].message})

    //checking if the book is in DB
    try {
      const book = await Book.findById({ _id: req.params.bookId });
      if (!book) return res.status(401).send("Book doesn't exist!");
    } catch (err) {
      res.status(400).json({ message: err });
    }

    //updating
    try {
      const book = await Book.updateOne({ _id: req.params.bookId }, req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  } else {
    return res.status(401).send("Not authorized for this action.");
  }
};

exports.deleteBook = async (req, res, next) => {
  if (req.user.role === "admin") {
    //checking if the book is in DB
    try {
      const book = await Book.findById({ _id: req.params.bookId });
      if (!book) return res.status(401).send("Book doesn't exist!");
    } catch (err) {
      res.status(400).json({ message: err });
    }

    //deleting
    try {
      const book = await Book.deleteOne({ _id: req.params.bookId });
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  } else {
    return res.status(401).send("Not authorized for this action.");
  }
};


exports.addReview = async (req,res,next) => {

    let bookId = new mongodb.ObjectID(req.params.bookId);
    let userId = new mongodb.ObjectID(req.user._id)
    const review = new Review({
        rating: req.body.rating,
        comment: req.body.comment,
        bookId: bookId,
        userId: userId
    })

    try{
      const reviewAdded = await review.save();
      res.status(201).send(reviewAdded)
    } catch (err) {
        res.status(401).send(err)
    }
}

