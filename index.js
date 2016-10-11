var db = require('./db');
var top = require('./checkTop');
var core = require('./checkCore');
var get = require('./get');

var arr = ["ECS 010","ECN 001B","HIS 017A","POL 001","MAT 021A","ECS 050","CMN 001","CHE 002A","UWP 001"];//,"PHY 009A","SOC 004","ECN 101", "CHN 002","ECS 060", "CMN 003", "ECS 040", "HIS 017B"];
var queryoptions = {
    "sort": "coreCount" 
	};
var term = "201610"
var collection = "coursesGE";

function addCourse() {
	var len = arr.length;
	console.log(len);
	while(len--) {
		get.retrieveCourse(term, arr[len], retrieveCourseCallback);
	}
}

function retrieveCourseCallback(obj) {
	if(obj === null) 
		console.log("Can't insert null obj");
	else
		db.insert(collection,obj);
}

function queryCallback(obj) {
	console.log(obj);
	//console.log(top.checkTop(obj));
	//console.log((top.checkTop(obj)).fulfilled)
	//console.log((core.checkCore(obj)).fulfilled);
}

//addCourse();
//db.remove(collection,"ECS 030");
//db.queryAllCourse(collection,arr,queryoptions,queryCallback);

function testNoGE() {
	get.retrieveCourse("201610","CHE 2AH",queryCallback);
}
testNoGE();
