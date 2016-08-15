var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var database;
app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true })); 
var formidable = require('formidable');
var util = require('util'); 
var fs = require('fs-extra');
var qt = require('quickthumb');
app.use(qt.static(__dirname + '/'));  

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
	res.sendFile(path.join(__dirname+'/views/admin.html'));

});

app.listen(8080,function() {
	console.log('Listening on 8080');
});

app.post('/admin', function(req,res) {		
//	processAllFieldsOfTheForm(req,res);
	processFormFieldsIndividual(req,res);
	database.collection('blogs').save(req.body, function (err, result) {		if(err) return console.log(err);
//		res.redirect('/admin');
});
	});

function processAllFieldsOfTheForm(req,res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function (err,fields,files){
		console.log(util.inspect({fields: fields, files: files}));
});
}

function processFormFieldsIndividual(req,res) {
	var fields = [];
	var form = new formidable.IncomingForm();
	form.on('field', function (field,value) {
//		console.log(field);
//		console.log(value);
		fields[field] = value;
	});

	form.on('file', function (name,file) {
//		console.log(name);
		console.log(file);
		fields[name] = file;
	});

	form.on('progress',function(bytesRecieved,bytesExpected){
		var progress = {
			type: 'progress',
			bytesRecieved: bytesRecieved,
			bytesExpected: bytesExpected
		};
		console.log(progress);
	});

	form.on('end', function (field,files) {
		res.writeHead(200, {
			'content-type' : 'text/plain'
		});
		res.write('received the data:\n\n');
		res.end(util.inspect({
            fields: fields
        }));
		var temp_path = this.openedFiles[0].path;
		var file_name = this.openedFiles[0].name;
		var new_location = 'uploads/';

	fs.copy(temp_path, new_location + file_name, function(err) {  
	      if (err) {
        	console.error(err);
      			} else {
        	console.log("success!")
      		}
    	});
});
    form.parse(req);
}
