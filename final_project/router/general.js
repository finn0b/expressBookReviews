const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //res.send(JSON.stringify(books,null,4)); //Original code
  let allBooks = new Promise((resolve, reject) => {
    try {
        resolve(JSON.stringify(books,null,4))
    }
    catch(err) {
        reject(err);
    }
  });
  allBooks.then(
    (message) => {
    res.send(message);
  },
  (err) => {
    res.send(err);
  }
)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  /*const isbn = req.params.isbn;
  res.send(books[isbn]);*/ // Original code
  let isbnPromise = new Promise((resolve,reject) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book){
            resolve(book);
        } else {
            resolve("Can't find book with ISBN: " + isbn);
        }
    } catch(err) {
        reject(err);
    }
   })
    isbnPromise.then(
        (message) => {
            res.send(message);
        },
        (err) => {
            res.send(err);
        }
    )
  });
 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  /*const author = req.params.author;
  let filtered_books = Object.values(books).filter((book) => book.author === author);
  res.send(filtered_books);*/ // original code
  let filterPromise = new Promise((resolve,reject) => {
    try {
        const author = req.params.author;
        let filtered_books = Object.values(books).filter((book) => book.author === author);
        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            resolve("Author " + author + " not found.")
        }
    }
    catch(err) {
        reject(err);
    }    
  })
  filterPromise.then(
    (message) => {
    res.send(message);
  },
    (err) => {
    res.send(err);
  }
)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    /*const title = req.params.title;
    let filtered_books = Object.values(books).filter((book) => book.title === title);
    res.send(filtered_books);*/ //old code
    let titlePromise = new Promise((resolve,reject) => {
        try {
            const title = req.params.title;
            let filtered_books = Object.values(books).filter((book) => book.title === title);
            if (filtered_books.length > 0) {
                resolve(filtered_books);
            } else {
                resolve("Book with title " + title + " not found.")
            }
        }
        catch(err) {
            reject(err);
        }    
      })
      titlePromise.then(
        (message) => {
        res.send(message);
      },
        (err) => {
        res.send(err);
      }
    )
    });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
