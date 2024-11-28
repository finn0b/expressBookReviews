const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let validUsers = users.filter((user) => {
        return (user.username === username)
    });
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if(isValid(username)){
        users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
        return true;
  } else {
        return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 300 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username; //taking from authorisation
  const review = req.query.review;
  let finalMessage = "failure to read";
  const newMessage = {
    "Review": review
  };
  if (books[isbn].reviews[user]) { //Section only for final message
     finalMessage = "updated"; //Exists, so the review is going to be updated
  } else {
    finalMessage = "uploaded"; //doesn't exist, so review is going to be uploaded
  }
  books[isbn].reviews[user] = newMessage;
  res.send(`Review from ${user} has been ${finalMessage}`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization.username;
    if (isbn) { 
        delete books[isbn].reviews[user];
    }
    res.send(`Review from ${user} has been deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
