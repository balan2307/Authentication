const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// var mongoose = require('mongoose');


module.exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
  .then((user) => {
    if (!user) {
      return res.status(401).json({
        title: "user not found",
        error: "invalid credentials",
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        title: "login failed",
        error: "invalid credentials",
      });
    }

    let token = jwt.sign({ userId: user._id }, "secretkey", {
      expiresIn: "6d",
    });

    return res.status(200).json({
      title: "login success",
      token,
      uid: user._id,
      username: user.username,
    });
  })
  .catch((err) => {
    return res.status(500).json({
      title: "server error",
      error: err,
    });
  });




};



module.exports.RegisterUser = async (req, res) => {




  const { email, username, password } = req.body;
  const newUser = new User({
    email,
    username,
    password: bcrypt.hashSync(password, 10),
  });


  newUser.save()
  .then(() => {
    return res.status(200).json({
      title: "signup success",
    });
  })
  .catch((err) => {
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({
        title: "error",
        error: "An account with this email already exists, try login",
      });
    } else if (err.code === 11000 && err.keyPattern.username) {
      return res.status(400).json({
        title: "error",
        error: "Username already in use, try a different one",
      });
    } else {
      // Handle other errors
      return res.status(500).json({
        title: "error",
        error: "Internal server error",
      });
    }
  });

 



};




module.exports.resetPassword = async (req, res) => {


  
    const { username, password } = req.body;
  
  
    User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          title: "user not found",
          error: "invalid credentials",
        });
      }
  

      User.updateOne({username:username}, { $set: {password: bcrypt.hashSync(password, 10),}})
      .then(()=>{

        return res.status(200).json({
            title: "Password reset successfully",
          });

      })
    


    
    })
    .catch((err) => {
      return res.status(500).json({
        title: "server error",
        error: err,
      });
    });
  
   
  
  
  
  };
  
  
  