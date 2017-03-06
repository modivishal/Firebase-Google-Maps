var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var firebase = require("firebase");
var admin = require("firebase-admin");

//Firebase Configuration
var config = {
    apiKey: "AIzaSyDLn_NOCXSeQNkFP60yjd6T0l2puITtt-U",
    authDomain: "application-task-4e8fe.firebaseapp.com",
    databaseURL: "https://application-task-4e8fe.firebaseio.com",
    storageBucket: "gs://application-task-4e8fe.appspot.com",
};
firebase.initializeApp(config);
var database = firebase.database();

// Allow access control from any domain.
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(bodyParser.json());

// Sign in post request.
app.post('/signIn',function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
		res.send(user);        
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        res.status(500);
        res.send(error);
    });
});

// Sign up post request.
app.post('/signUp', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
        firebase.database().ref(user.uid).set({
            firstName: firstName,
            lastName: lastName
        });
        res.send(user);
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        res.status(500);
        res.send(error);
    });
});

// Sign out post request.
app.post('/signOut',function(req,res){
    var token = req.body.token;
	/*firebase.auth().signInWithCustomToken(token).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
		console.log("Firbase auth error");
        res.status(500);
        res.send(error);
    });*/
	var user = firebase.auth().currentUser;
	if (user) {
	  // User is signed in.
	  firebase.auth().signOut().then(function() {
			 res.send("Logged out successfully.");
		}, function(error) {
			res.status(500);
			res.send(error);
		});
	} else {
	  // No user is signed in.
		res.status(500);
		res.send("No user found!!");
	}
    
});

// Get regions in post request.
app.post('/getAllMapRegions', function (req, res) {
    var userSessionToken =  req.body.userSessionToken;

    // working on it ... signin user with given token
    /*firebase.auth().signInWithCustomToken(userSessionToken).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
    });*/
    var ref = firebase.database().ref("regions");
    ref.on("value", function (snapshot) {
        res.json(snapshot.val());
    }, function (errorObject) {
        res.status(500);
        res.send(errorObject);
    });

});

app.listen(3000, function () {
    console.log('App is listening on port 3000!')
});