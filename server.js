
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin1@ds213615.mlab.com:13615/samtalsdb', {useNewUrlParser: true});


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
var ThemeSchema = new Schema ({
  themeobj: {
    type: String
  }
});
var Theme = mongoose.model("Theme", ThemeSchema);



// Question Schema.
var QuestionSchema = new Schema ({
  questionobj: {
    type: String
  }
});
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
/*
app.get("/test", function(req, res) {

  function hej() {
    
    Theme.find({}).then(function(data) {
      var json = data;

      var randomTheme = json[Math.floor(Math.random() * json.length)];
      
      
      console.log(randomTheme);
    });

  }
  hej()

});
*/







// Welcome route.
app.get("/", function(req, res) {
  res.send("Hello World from the server")
});


// Shows all users in json, this is for admin. 
app.get("/users", function(req, res) {

  User.find({}).then(function(data) {
    res.json(data);
  });

});


// Post a new user object to database.
app.post("/register", function(req, res) {
  var user = new User(req.body); //This creates a new object in the Userschema.

  // Saves the new object to the mongodb database.
  user.save( function(error, data) {
    res.json(data);
  });

});

// Delete a existing user object with it's id. 
app.delete("/delete/user", function(req, res) {
  var id = req.body.id;

  // findOneAndRemove() is function that mongoose uses. It is not standard javascript!
  User.findOneAndRemove({_id: id}, function(req, res) {
    if(!err) {
      res.send("Deleted user with id:" + id + "successfully.");
    } else {
      res.send(err);
    }

  });
});






// Randomize a random string from json array and send it back.
app.get("/theme/random-theme", function(req, res) {

  function Random() {
    Theme.find({}).then(function(data) {
      var json = data;
      var randomTheme = json[Math.floor(Math.random() * json.length)];
      res.send(randomTheme.themeobj);
    });
  }
  Random()

});

// Shows all the themes, this is for admin.
app.get("/theme", function(req, res) {

  Theme.find({}).then(function(data) {
    res.json(data);
  });

});

// Post a new theme object to database.
app.post("/theme/post", function(req, res) {
  var theme = new Theme(req.body); //This creates a new object in the Themeschema.

  // Saves the new object to the mongodb database.
  theme.save( function(error, data) {
    res.json(data);
  });

});


app.delete("/theme/delete", function(req, res) {
  var id = req.body.id;

  // findOneAndRemove() is function that mongoose uses. It is not standard javascript!
  Theme.findOneAndRemove({_id: id}, function(req, res) {
    if(!err) {
      res.send("Theme with: " + id + " successfully.");
    } else {
      res.send(err);
    }

  });
});






// Randomize a random string from json array and send it back.
app.get("/question/random-question", function(req, res) {

  function Random() {
    Theme.find({}).then(function(data) {
      var json = data;
      var randomQuestion = json[Math.floor(Math.random() * json.length)];
      res.send(randomQuestion.questionobj);
    });
  }
  Random()

});


// Shows all the questions, this is for admin.
app.get("/theme", function(req, res) {

  Question.find({}).then(function(data) {
    res.json(data);
  });

});

// Post a new theme object to database.
app.post("/question/post", function(req, res) {
  var question = new Question(req.body); //This creates a new object in the Questionschema.

  // Saves the new object to the mongodb database.
  question.save( function(error, data) {
    res.json(data);
  });


});


app.delete("/question/delete", function(req, res) {
  var id = req.body.id;

  // findOneAndRemove() is function that mongoose uses. It is not standard javascript!
  Theme.findOneAndRemove({_id: id}, function(req, res) {
    if(!err) {
      res.send("Theme with: " + id + " successfully.");
    } else {
      res.send(err);
    }

  });
});


// Listen to process environment port, or port 3000.
app.listen(process.env.PORT || 3000, () => console.log("Server is running"));