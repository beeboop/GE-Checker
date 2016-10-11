//2008-2016
//only check 2015, 2016 for now
//10:Fall Quarter
//03:Spring Quarter
//01:Winter Quarter
var async = require("async");
var fs = require('fs')
var cheerio = require('cheerio');
var get = require('./get');
var db = require('./db');

var collection = "coursesGE";
var year = ['2016'];
var quarter = ['01','03','10']

/*
function getAllCourses(depArray) {
	var len = 6;//depArray.length;
	var obj = {};
	//try async
	while(len--) {
		for(var y=0; y<year.length; y++) {
			for(var q=0; q<quarter.length; q++) {
				get.retrieveCourseAll(year[y].concat(quarter[q]),depArray[len].department,function(arr) { 
					if(arr != null && arr.length > 0)
						db.insertMany(collection,arr);
				});
			} //end q for
		} //end y for
	} //end while
}
*/

function getAllCourses(depArray) {
	var queue = async.queue(function(task, callback) {
    task();
    callback();
	}, 1);
	queue.drain = function() {
    console.log('getAll: Drained');
	};

	async.eachLimit(depArray,1,function(dep, callback) {
		async.eachLimit(year,1,function(y,callback) {
			async.eachLimit(quarter,1,function(q,callback) {
				queue.push(function() {
					get.retrieveCourseAll(y.concat(q),dep._id,function(arr) { 
						if(arr != null && arr.length > 0)
							db.insertMany(collection,arr);
					});
				},function(err) {}
				);
				setTimeout(function(){callback();},1500);
			}); //end q for
			setTimeout(function(){callback();},1500);
		}); //end y for
		setTimeout(function(){callback();},1500);
	}, function(err) {
		if( err ) {
			// One of the iterations produced an error.
			// All processing will now stop.
			console.log('Failed');
		} else {
			console.log('getAll: DepArray All inserted.');
		}
	});
}

function insertZeros(int) {
	if(int > 0 && int < 10) {
		return "00";
	}
	else if(int >= 10 && int < 100) {
		return "0";
	}
	else if(int >= 100 && int < 200) {
		return "";
	}
	else {
		console.log("insertZeros error, got",int);
		return null;
	}
}

function getDepartments(selectHTML) {
	//get deprtmnts at https://registrar.ucdavis.edu/courses/search/index.cfm
	//request didn't work because "possible EventEmitter memory leak detected"
	// probably because the site doesn't like me and redirects me
	//then copy paste to departments.txt
	var $ = cheerio.load(selectHTML, 
		{normalizeWhitespace: true, decodeEntities: true});
	var option = $('select').children().first();
	
	var depArray = [];
	option = option.next();
	while(option.html()) {
		//var regExp = /\(([^)]+)\)/;
		//var matches = regExp.exec(option.text());
		var str = option.text().split(" (");
		if(str[1].length == 4) {
			//console.log(str[0],"&&&",str[1].slice(0,3));
			depArray.push({
				_id: str[1].slice(0,3),
				name: str[0]
			});
		}
		option = option.next();
	}
	
	//console.log(depArray);
	return depArray;
}

function main() {
	fs.readFile('departments.txt', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		var depArray = getDepartments(data);
		db.insertMany("departments",depArray);
		getAllCourses(depArray);
	});
}

main();
