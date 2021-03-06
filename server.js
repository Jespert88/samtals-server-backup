
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.connect('mongodb+srv://jeppe:123@skolprojekt-0pyfl.mongodb.net/samtalsdb?retryWrites=true', { useNewUrlParser: true });

const morgan = require('morgan');
app.use(morgan("tiny"));





// Varible for all the models / collections.
var Schema = mongoose.Schema;


// User Schema.
var UserSchema = new Schema({

  username: { type: String },

  password: { type: String },

  hours: { type: Number },

  minutes: { type: Number },

  seconds: { type: Number },

  points: { type: Number },
  
  qrcode: { type: String }

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
// The middleware was a part of Express.js earlier but now you have to install it separately. 
// This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request.
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
  res.send("Hello World from the samtals-server")
});


// Shows all users in json, this is for admin. 
app.get("/users", function (req, res, err) {

  if (!err) {
    User.find({}).then(function (data) {
      res.json(data);
    });
  } else {
    console.log(err);
  }

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
        hours: 0,
        minutes: 0,
        seconds: 0,
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



/*
  Check if given username and password exist and match in db. 
  If they exist, respond with that object from db else respond with false.
*/
app.post("/login", function (req, res) {
 
  User.find({ username: req.body.username, password: req.body.password }).then(function (data) {
    if (data[0] != null) {
      res.send(data[0]);
      console.log("Login successful");
    } else {
      res.send(false);
      console.log("Login failed");
    }
  });

});


//Get data from existing user by matching username to req.body.username (Input from the user).
app.post("/get-user-data", function (req, res) {
  User.find({ username: req.body.username }, function(err, data) {
      if (data[0] != null) {
        res.send(data[0]);
      } else {
        res.send(err);
      }
    });
});




//"_id": new ObjectId(req.body._id)
//Get existing user info by id. (This route is for the profile, so that user can send req to update from a button.)
app.post("/get-user-info-by-id", function (req, res) {
  User.findOne({ "_id": new ObjectId(req.body._id) }, function (err, data) {

    if (!err) {
      console.log("Data sent.." + data);
    } else {
      console.log(err);
    }

  });
});


//Post data to existing user.
app.post("/post-data-to-user", function (req, res) {
  User.findOneAndUpdate({ "_id": req.body._id },
  
    //Update to existing one  $set:
    //Add to existing one $inc:
  
  {
      $inc: {
          "hours": req.body.hours,
          "minutes": req.body.minutes,
          "seconds": req.body.seconds,
          "points": req.body.points,
      }
   }, { new: true }, (err, doc) => {
      if (!err) { 
        console.log(doc);
      }
      else {
        console.log('Error during update : ' + err);
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


// Listen to process environment port, or port 3000.
app.listen(process.env.PORT || 3000, () => console.log("Server is running"));