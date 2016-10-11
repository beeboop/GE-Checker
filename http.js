var express = require('express');
var async = require('async');
var db = require('./db');
var top = require('./checkTop');
var core = require('./checkCore');
var app = express();

//collections: departments, coursesGE

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.send('Hello World =]');
});

app.get('/department', function (req, res) {
	var q = req.query.q;
	//var callback = req.query.callback;
	if(q) {
		//return course numbers for this specific dept
		var collection = "coursesGE";
		var selection = {"dept":q};
		var projection = {};
		var option = { "sort": "_id" };
		db.query(collection,selection,projection,option, function(data) {
			res.send(data);
			//callback(data);
		});
	}
	else {
	//return array all dept
		var collection = "departments";
		var selection = {};
		var projection = {"_id":1};
		var option = { "sort": "_id" };
		db.query(collection,selection,projection,option, function(data) {
			res.send(data);
			//callback(data);
		});
	}
});

app.get('/run', function (req, res) {
	//take in array of courses taken, run query to get objArray then do check
	//return....
	var q = req.query.q;
	if(q.slice(0,2) == "[\"" && q.slice(q.length-2,q.length) == "\"]") {
		q = JSON.parse(q);
		var collection = "coursesGE";
		var CqueryOpts = { "sort": "coreCount" };
		var TqueryOpts = { "sort": "coreCount" };
		async.parallel([
			function(callback) {
				db.queryAllCourse(collection,q,TqueryOpts,function (obj) {
					callback(null,top.checkTop(obj));
				});
			},
			function(callback) {
				db.queryAllCourse(collection,q,CqueryOpts,function (obj) {
					callback(null,core.checkCore(obj));
				});
			}
		], function(err,results) {
			res.send(results);
		});
	}
	else {
		res.send('null');
	}
	//var callback = req.query.callback;
	//res.send('Hello World =]'+q);
});

var server = app.listen(8081, function () {
	console.log("Begin listening at",server.address().address,server.address().port);
});
