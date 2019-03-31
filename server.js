
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin1@ds145053.mlab.com:45053/samtaldb', {useNewUrlParser: true});


// Varible for all the models / collections.
var Schema = mongoose.Schema;


// User Schema.
var UserSchema = new Schema ({
  
  username: {
    type: String
  },

  password: {
    type: String
  },

  points: {
    type: Number
  },

  qrcode: {
    type: String
  }

});
var User = mongoose.model("User", UserSchema);


// Theme Schema.
var ThemeSchema = new Schema ({});
var Theme = mongoose.model("Theme", ThemeSchema);


// Question Schema.
var QuestionSchema = new Schema ({});
var Question = mongoose.model("Question", QuestionSchema);



// body-parser extract the entire body portion of an incoming request stream and exposes it on req.body 
//. The middleware was a part of Express.js earlier but now you have to install it separately. 
//This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



//Allow CORS.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});



// Test route.
app.get("/test", function(req, res) {

  function hej() {
    var data = 23

    if ( data > 30) {
      console.log("Data is " + data + " and is bigger.")
    } else {
      console.log("Data is " + data + " and is not bigger.")
    }
  }
  hej()

});








// Root route.
app.get("/", function(req, res) {
  res.send("Hello World from the server")
});


app.post("/register", function(req, res) {
  var user = new User(req.body); //This creates a new object in the Userschema.

  // Saves the new object to the mongodb database.
  user.save( function(error, data) {
    res.json(data);
  });


});


app.delete("/delete/user", function(req, res) {
  var id = req.body.id;

  User.findOneAndRemove({_id: id}, function(req, res) {
    if(!err) {
      res.send("Deleted user with id:" + id + "successfully.");
    } else {
      res.send(err);
    }

  });
});


//app.post("/login", function(req, res) {});

//app.get("/user", function(req, res) {});


app.get("/users", function(req, res) {

  User.find({}).then(function(data) {
    res.json(data);
  });

});

/*
app.get("/:writeYourParamsHere", function(req, res) {
  res.send(req.params.writeYourParamsHere);
});
*/



// Listen to process environment port, or port 3000.
app.listen(process.env.PORT || 3000, () => console.log("Server is running"));