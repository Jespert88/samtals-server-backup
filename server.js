
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jeppe:123@skolprojekt-0pyfl.mongodb.net/samtalsdb?retryWrites=true', { useNewUrlParser: true });



// Varible for all the models / collections.
var Schema = mongoose.Schema;


// User Schema.
var UserSchema = new Schema({

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
var ThemeSchema = new Schema({
  themeobj: {
    type: String
  }
});
var Theme = mongoose.model("Theme", ThemeSchema);



// Question Schema.
var QuestionSchema = new Schema({
  questionobj: {
    type: String
  }
});
var Question = mongoose.model("Question", QuestionSchema);



// body-parser extract the entire body portion of an incoming request stream and exposes it on req.body 
//. The middleware was a part of Express.js earlier but now you have to install it separately. 
//This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//Allow CORS.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});






// Welcome route.
app.get("/", function (req, res) {
  res.send("Hello World from the server")
});


// Shows all users in json, this is for admin. 
app.get("/users", function (req, res) {

  User.find({}).then(function (data) {
    res.json(data);
  });

});


// Post a new user object to database.
app.post("/register", function (req, res) {
  //Check if user object exists. If it exists sen back false, else create new user object to the user model in db. 
 
  User.find({ username: req.body.username }).then(function (data) {
    if (data[0] != null) {
      res.send(false);
      console.log("User already exists");
    } else {

      // This function generate a random qr code.
      function makeQR(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
      

      // This is the user object with all the keys that exist in the db.
      var userObj = {
        username: req.body.username,
        password: req.body.password,
        points: 0,
        qrcode: makeQR(10)
      };





      var user = new User(userObj); //This creates a new object in the Userschema.

      // Saves the new object to the mongodb database.
      user.save(function (error, data) {
        res.json(data);
      });
      console.log("User register was successful");
    }
    console.log(data);
  });
});

// .
app.post("/login", function (req, res) {
  // Check if given username and password exist and match in db. If they exist, respond with true. If they don't exist, respond with false.

  User.find({ username: req.body.username, password: req.body.password }).then(function (data) {
    if (data[0] != null) {
      res.send(true);
      console.log("Login successful");
    } else {
      res.send(false);
      console.log("Login failed");
    }
  });
});


// Delete a existing user object with it's id. 
app.delete("/delete/user", function (req, res) {
  var id = req.body.id;

  // findOneAndRemove() is function that mongoose uses. It is not standard javascript!
  User.findOneAndRemove({ _id: id }, function (req, res) {
    if (!err) {
      res.send("Deleted user with id:" + id + "successfully.");
    } else {
      res.send(err);
    }

  });
});







// Shows all the themes, this is for admin.
app.get("/theme", function (req, res) {

  Theme.find({}).then(function (data) {
    res.json(data);
  });

});


// Randomize a random string from json array and send it back.
app.get("/theme/random-theme", function (req, res) {

  function Random() {
    Theme.find({}).then(function (data) {
      var json = data;
      var randomTheme = json[Math.floor(Math.random() * json.length)];
      res.send({randomObj: randomTheme.themeobj});
    });
  }
  Random()

});

/* Save this code.
// Post a new theme object to database.
app.post("/theme/post", function(req, res) {
  var theme = new Theme(req.body); //This creates a new object in the Themeschema.

  // Saves the new object to the mongodb database.
  theme.save( function(error, data) {
    res.json(data);
  });

});
*/



// Shows all the questions, this is for admin.
app.get("/question", function (req, res) {

  Question.find({}).then(function (data) {
    res.json(data);
  });

});


// Randomize a random string from json array and send it back.
app.get("/question/random-question", function (req, res) {

  function Random() {
    Question.find({}).then(function (data) {
      var json = data;
      var randomQuestion = json[Math.floor(Math.random() * json.length)];
      res.send({randomObj: randomQuestion.questionobj});
    });
  }
  Random()

});
/* Save for later..
// Post a new theme object to database.
app.post("/question/post", function(req, res) {
  var question = new Question(req.body); //This creates a new object in the Themeschema.

  // Saves the new object to the mongodb database.
  question.save( function(error, data) {
    res.json(data);
  });

});
*/




// Listen to process environment port, or port 3000.
app.listen(process.env.PORT || 3000, () => console.log("Server is running"));