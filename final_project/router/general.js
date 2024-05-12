//import axios from 'axios';
const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorBooks = [];
  const author = req.params.author;

  // Iterate through the books and check if the author matches
  for (const isbn in books) {
      if (books[isbn].author === author) {
        authorBooks.push(books[isbn]);
    }
}
  return res.send(JSON.stringify(authorBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleBooks = [];
  const title = req.params.title;

  // Iterate through the books and check if the title matches
  for (const isbn in books) {
      if (books[isbn].title === title) {
        titleBooks.push(books[isbn]);
    }
}
  return res.send(JSON.stringify(titleBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Get Books with Axios async-await
const getBooks = async () => {
  try {
      const response = await axios.get('http://localhost:5000/');
      console.log(response.data); // Handle the response data
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};
getBooks();

// Get Book by ISBN with Axios async-await
const getBookBy_isbn = async (isbn) => {
  try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      console.log(response.data); // Handle the response data
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};
getBookBy_isbn(1);

// Get Book by Author with Axios async-await
const getBookBy_author = async (author) => {
  try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      console.log(response.data); // Handle the response data
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};
getBookBy_author('Jane Austen');

// Get Book by Title with Axios async-await
const getBookBy_title = async (title) => {
  try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log(response.data); // Handle the response data
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};
getBookBy_title('The Epic Of Gilgamesh');

module.exports.general = public_users;
