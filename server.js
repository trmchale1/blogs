var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var database;
app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true })); 
//app.use(bodyParser.json());
//var formidable = require('formidable');
//var util = require('util');
//var fs = require('fs-extra');
//var qt = require('quickthumb');
//app.use(qt.static(__dirname + '/'));

MongoClient.connect('mongodb://127.0.0.1:27017/test', function (error, db) {
        database = db;
        if(error) { throw error;} else {console.log("succesfully connected to database");}
});

app.get('/', function(req,res) {
	database.collection('blogs').find().toArray(function(err, results) {
  	console.log(results)
	res.render('index.ejs', {blogs: results});
	});
});

app.get('/admin', function(req,res){
	res.render('admin.ejs');
});

app.listen(8080,function() {
	console.log('Listening on 8080');
});

app.post('/admin', function(req,res) {		
	console.log(req.body);
	database.collection('blogs').save(req.body, function (err, result) {		if(err) return console.log(err);
		res.redirect('/admin');
	});
/*
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		res.write('received upload:\n\n');
		res.end(util.inspect({fields: fields, files: files}));
	});

	form.on('end', function(fields, files) {
	/* Temporary location of our uploaded file */
/*	var temp_path = this.openedFiles[0].path;
	/* The file name of the uploaded file */
//	var file_name = this.openedFiles[0].name;
	/* Location where we want to copy the uploaded file */
//	var new_location = 'uploads/';
//	fs.copy(temp_path, new_location + file_name, function(err) {  
//		if (err) {
//			console.error(err);
//		} else {
//			console.log("success!")
//			}
	});
//	});	
//});
