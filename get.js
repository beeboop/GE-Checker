var request = require('request');
var cheerio = require('cheerio');
var util = require('util');

//var BASEurl = "https://registrar.ucdavis.edu/courses/search/course_search_results.cfm?termCode=%s&course_number=%s";
//var term = "201610"

function retrieveCourseAll(term, course, callback) {
	var url = buildURL(term, course);
	request(url, function (error,response,html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html, {normalizeWhitespace: true, decodeEntities: true});
			var tbody = $('table').first();
			var wantTR = $('table').children().first().next().next().next().next();
			
			var objArr = [];
			while(wantTR.text()) {
				var courseTD = wantTR.children().first().next();
				var titleTD = courseTD.next().next();
				var unitTD = titleTD.next();
				var COURSE_ID = extractCourse(courseTD.text());
				var COURSE_NAME = extractCourseName(titleTD.text());
				var UNITS = extractUnit(unitTD.text());
				var GE = extractGE($,titleTD);
				var objID = formatID(COURSE_ID);
				var DEPT = extractDept(COURSE_ID);
			
				if(!checkObjExist(objArr,COURSE_ID)) {
					var obj = {
						_id: objID,
						courseID: COURSE_ID,
						course: COURSE_NAME,
						dept: DEPT,
						units: UNITS,
						used: false
					};
					for (var attrname in GE) { 
						obj[attrname] = GE[attrname]; 
					} //obj = obj + GE
			
					if(isObjGood(obj)) {
						objArr.push(obj);
					}
				}
				
				wantTR = wantTR.next();
			}//end while
			
			return callback(objArr);
		}
		else {
			console.log("Problem requesting data from server");
			console.log("Response code",error);
		}
	});
}

function retrieveCourse(term, course, callback) {
	var url = buildURL(term, course);
	request(url, function (error,response,html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html, {normalizeWhitespace: true, decodeEntities: true});
			var tbody = $('table').first();
			var wantTR = $('table').children().first().next().next().next().next();
			var courseTD = wantTR.children().first().next();
			var titleTD = courseTD.next().next();
			var unitTD = titleTD.next();
			//console.log(courseTD.text()); //" ECS 030 CHEM 176"
			//console.log(titleTD.text());
			//console.log(unitTD.text());

			var COURSE_ID = extractCourse(courseTD.text());
			var COURSE_NAME = extractCourseName(titleTD.text());
			var UNITS = extractUnit(unitTD.text());
			var GE = extractGE($,titleTD);
			var objID = formatID(COURSE_ID);
			var DEPT = extractDept(COURSE_ID);
			
			var obj = {
				_id: objID,
				courseID: COURSE_ID,
				course: COURSE_NAME,
				dept: DEPT,
				units: UNITS,
				used: false
			};
			
			//numGE: GE Length, how many total
			
			for (var attrname in GE) { 
				obj[attrname] = GE[attrname]; 
			} //obj = obj + GE
			
			if(isObjGood(obj)) {
				return callback(obj);
			}
			else {
				return null;
			}
			
			return null;
		}
		else {
			console.log("Problem requesting data from server");
			console.log("Response code",error);
		}
	});
}

function checkObjExist(arr, cID) {
	//only need to check the last obj?
	var len = arr.length;
	while(len--) {
		if(arr[len].courseID == cID)
			return true;
	}
	return false;
}

function isObjGood(obj) {
	if(obj._id == '' || obj.units == (-1)) {
		return false;
	}
	
	//check ID: 3 lowercase char followed by 3 numbers and maybe 2 chars a-z
	var idCheck = /^[a-z]{3}\d{3}[a-z]{0,2}$/;
	if(!idCheck.test(obj._id)) {
		console.log("ID check failed, got",obj._id);
		return false;
	}
	
	//check course: 3 uppercase char followed by 1 space then 3 numbers and maybe 2 chars A-Z
	var courseCheck = /^[A-Z]{3}\s\d{3}[A-Z]{0,2}$/;
	if(!courseCheck.test(obj.courseID)) {
		console.log("Course check failed, got",obj.courseID);
		return false;
	}
	//check units: At least 0 and no greater than 7.0, divisable by 0.5
	if(obj.units < 0 || obj.units >= 7.0 || obj.units%0.5 != 0) {
		console.log("Units check failed, got",obj.units);
		return false;
	}
	
	return true;
}

function buildURL(term,course){
	return util.format("https://registrar.ucdavis.edu/courses/search/course_search_results.cfm?termCode=%s&course_number=%s",term,course);
}

function formatID(cID) {
	//convert from course ID to _id
	//ECS 030 -> ecs030
	var ID = cID.toLowerCase();
	ID = ID.replace(/\s/g, '');
	
	return ID;
}

function extractCourse(str) {
	//takes the string within <td> " ECS 030 ROCK"
	//returns the course ID [ECS 030]
	var firstSpace = str.indexOf(' ');
	var secondSpace = str.indexOf(' ',firstSpace+1);
	var thirdSpace = str.indexOf(' ',secondSpace+1);
	return str.substr(firstSpace+1,thirdSpace-1);
}	

function extractDept(str) {
	//takes the course ID "ECS 10"
	//returns only the first three chars "ECS"
	return str.slice(0,3); 
}

function extractCourseName(str) {
	//takes the string within <td> " Programming&Prob Solving  SE  • QL SE"
	//No GE case: " China Since 1800 No GE Credit • WE "
	//returns only the name/title of the course
	var firstSpace = str.indexOf(' ');
	var doubleSpace = str.indexOf('  ');
	var cName = str.substr(firstSpace+1,doubleSpace-1);
	if(cName != "") {
		return str.substr(firstSpace+1,doubleSpace-1);
	}
	else {
		doubleSpace = str.indexOf(' No GE');
		return str.substr(firstSpace+1,doubleSpace-1);
	}
}	

function extractGE($,obj) {
	//takes titleTD DOM object 
	//returns the new GE
	var ge = {};
	var top_count = 0;
	var core_count = 0;
	var topGE = ['AH','SE','SS'];
	var coreGE = ['WE','OL','VL','ACGH','DD','WC','QL','SL','']; //'' == WC
	var hasTop = [];
	var hasCore = [];

	$("acronym",obj).each( function(index, element) {
		if($(this).attr('title').indexOf("New GE:") != (-1)) {
			//console.log($(this).text());
			var text = $(this).text();
			if(topGE.indexOf(text) != (-1)) {
				top_count++;
				hasTop.push(text);
				ge[text] = true;
			}
			else if(coreGE.indexOf(text) != (-1)) { //else if a core GE
				core_count++;
				if(text == "") {//WC case
					hasCore.push('WC');
					ge['WC'] = true;
				}
				else {
					hasCore.push(text);
					ge[text] = true;
				}
			}
		}
	});
	ge['topCount'] = top_count;
	ge['coreCount'] = core_count
	ge['topGE'] = hasTop;
	ge['coreGE'] = hasCore;
	return ge;
}

function extractUnit(str) {
	//takes the string within <td> " Butner, M   4.0"
	//returns the units in floating point
	var dotAt = str.indexOf('.');
	if(dotAt == (-1)) {
		return (-1);
	}
	return parseFloat(str.substr(dotAt-1,dotAt+1));
}

exports.retrieveCourse = retrieveCourse;
exports.retrieveCourseAll = retrieveCourseAll;
