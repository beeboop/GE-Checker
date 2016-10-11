//INDEX:
var UWP = 0;
var WE = 1;
var OL = 2; // or WE
var VL = 3;
var ACGH = 4; // += DD
var DD = 5;
var WC = 6;
var QL = 7;
var SL = 8;

var required = 35;

function checkCore(objArray) {
	var GEstack = {
		UWP: [],
		WE: [],
		OL: [],
		VL: [],
		ACGH: [],
		DD: [],
		WC: [],
		QL: [],
		SL: [],
		fulfilled: Array(9).fill(0),
		satisfied: Array(9).fill(false)
	};
	
	var GEindex;
	
	for(var i=0; i<objArray.length; i++) {
		console.log("Fulfilled:",GEstack.fulfilled,'\n',objArray[i].courseID);
		if(objArray[i].coreCount == 0) {
			continue;
		}
		else if(objArray[i].coreCount == 1) {
			var GEcovered = hasWhichGE(objArray[i]);
			GEindex = convertToIndex(GEcovered[0]); //in this case, has to be 0
			
			//only add to it if its not yet satisfied, else disregard
			if(GEstack.satisfied[GEindex] != true) {
				GEstack[GEcovered[0]].push(objArray[i]);
				GEstack.fulfilled[GEindex] += objArray[i].units;
				GEstack.satisfied[GEindex] = 
					checkSatisfied(GEcovered[0],GEstack.fulfilled);
			}
			else {
				console.log(objArray[i].courseID,"disregarded.");
			}
		}
		else {
			//covers more than 1 GE
			var GEcovered = hasWhichGE(objArray[i]);
			var minIndex = 
				findMin(GEstack.satisfied,GEcovered,GEstack.fulfilled);
				//index for GEcovered
			if(minIndex == (-1)) {
				//-1 retured, prob means this course is good for nothing
				//but let's see if we can fix this
				//newStack would equal null if no change is made
				// it would contain updated stack otherwise
				var newStack = checkPossibilities(objArray[i], GEcovered, GEstack);
				if(newStack) {
					GEstack = newStack;
				}
				continue;
			}
			
			GEindex = convertToIndex(GEcovered[minIndex]);
			//only add to it if its not yet satisfied, else disregard
			if(GEstack.satisfied[GEindex] != true) {
				GEstack[GEcovered[minIndex]].push(objArray[i]);
				GEstack.fulfilled[GEindex] += objArray[i].units;
				GEstack.satisfied[GEindex] = 
					checkSatisfied(GEcovered[minIndex],GEstack.fulfilled);
			}
			else {
				console.log(objArray[i].courseID,"disregarded.");
			}
		}
	}
	
	return GEstack;
	
}

function checkPossibilities(course, GEcovered, GEstack) {
	//this GE couldn't fit into any category
	//so check to see if we can move any from ones this GE covers into ones currently unsatisfied
	var unsatisfied = findUnsatisfied(GEstack.satisfied);
	
	for(var i=0; i<unsatisfied.length; i++) {
		//check each unsatisfied GE
		var unsatGEidx = unsatisfied[i];
		var unsatGEstr = indexToGE(unsatGEidx);
		
		for(var j=0; j<GEcovered.length; j++) {
			//check each GE that's covered by the current unfitting course
			var currGEstr = GEcovered[j];
			var currGEidx = convertToIndex(currGEstr);
			
			var found = findGEFromGEArr(unsatGEstr,GEstack[currGEstr]);
			//found=index in the GEstack.currGE arr
			
			/****************
			
			NEED to take care of case where WE satisfies OL
			
			****************/
			console.log("unsatGEstr:",unsatGEstr,"currGEstr:",currGEstr,"found:",found);
			if(found != (-1)) {
				//replace the found with current GE
				//place found into unsatisfied[i]
				//update .fulfill and .satisfied
				var temp = GEstack[currGEstr][found];
				GEstack[currGEstr][found] = course;
				GEstack.fulfilled[currGEidx] -= temp.units;
				GEstack.fulfilled[currGEidx] += course.units;
				GEstack.satisfied[currGEidx] = 
					checkSatisfied(currGEstr,GEstack.fulfilled);
					
				GEstack[unsatGEstr].push(temp);
				GEstack.fulfilled[unsatGEidx] += temp.units;
				GEstack.satisfied[unsatGEidx] = 
					checkSatisfied(unsatGEstr,GEstack.fulfilled);
				
				return GEstack;
			}
		}
	}
	
	return null;
}


function findUnsatisfied(satisfied) {
	var unsatisfied = [];
	for(var i=0; i<satisfied.length; i++) {
		if(!satisfied[i]) {
			unsatisfied.push(i);
		}
	}
	
	return unsatisfied
}

function findGEFromGEArr(GE, arr) {
	var index = (-1);
	for(var i=0; i<arr.length; i++) {
		if(arr[i].hasOwnProperty(GE)) {
			index = i;
			break;
		}
	}
	
	return index;
}

function findMin(GEsatisfied, GEcovered, fulfilled) {
	//figure out which GE has the least
	//returns the index that has the least
	//if two has same units then go with the higher number (good? bad?)
	var min = Infinity;
	var at = (-1);

  for(var i=0; i<fulfilled.length; i++) {
  	var GEcoveredIndex = GEcovered.indexOf(indexToGE(i));
  	//make sure its covered first
  	if(GEcoveredIndex != (-1)) {
  		//make sure its not yet satisfied otherwise use on another GE
  		var theGE = GEcovered[GEcoveredIndex];
  		if(GEsatisfied[convertToIndex(theGE)] != true) {
				if (fulfilled[i] < min) {
				  min = fulfilled[i];
				  at = GEcoveredIndex;
				}
		  }
    }
  }
  
  return at;
}

function checkSatisfied(GE, fulfilled) {
	switch(GE) {
		case 'UWP': {
			if(fulfilled[UWP] >= 8)
				return true;
			else return false;
		}
		case 'WE': {
			if(fulfilled[WE] >= 6)
				return true;
			else return false;
		}
		case 'OL': {
			if(fulfilled[OL] >= 3)
				return true;
			else return false;
		}
		case 'VL': {
			if(fulfilled[VL] >= 3)
				return true;
			else return false;
		}
		case 'ACGH': {
			if((fulfilled[ACGH] >= 6) || 
				((fulfilled[ACGH]+fulfilled[DD]) >= 6))
				return true;
			else return false;
		}
		case 'DD': {
			if(fulfilled[DD] >= 3)
				return true;
			else return false;
		}
		case 'WC': {
			if(fulfilled[WC] >= 3)
				return true;
			else return false;
		}
		case 'QL': {
			if(fulfilled[QL] >= 3)
				return true;
			else return false;
		}
		case 'SL': {
			if(fulfilled[SL] >= 3)
				return true;
			else return false;
		}
		default: {
			console.log("Invalid check for satisfied, got",GE);
			return null;
		}
	}
}

function hasWhichGE(obj) {
	//figures out which GEs this course/obj covers
	//returns an array
	var hasGE = [];
	if(obj.courseID.indexOf('UWP') != (-1))
	 	//check for Writing, UWP, NAS, etc
		hasGE.push('UWP');
	if(obj.hasOwnProperty('WE'))
		hasGE.push('WE');
	if(obj.hasOwnProperty('OL'))
		hasGE.push('OL');
	if(obj.hasOwnProperty('VL'))
		hasGE.push('VL');
	if(obj.hasOwnProperty('ACGH'))
		hasGE.push('ACGH');
	if(obj.hasOwnProperty('DD'))
		hasGE.push('DD');
	if(obj.hasOwnProperty('WC') || obj.hasOwnProperty(''))
		hasGE.push('WC');
	if(obj.hasOwnProperty('QL'))
		hasGE.push('QL');
	if(obj.hasOwnProperty('SL'))
		hasGE.push('SL');

			
	return hasGE;
}

function convertToIndex(str) {
	switch(str) {
		case 'UWP': {
			return UWP;
		}
		case 'WE': {
			return WE; 
		}
		case 'OL': {
			return OL; 
		}
		case 'VL': {
			return VL;
		}
		case 'ACGH': {
			return ACGH; 
		}
		case 'DD': {
			return DD; 
		}
		case 'WC': {
			return WC;
		}
		case 'QL': {
			return QL; 
		}
		case 'SL': {
			return SL; 
		}
		default: {
			console.log("Invalid conversion of",str);
			return null;
		}
	}
}

function indexToGE(int) {
	if(int == UWP) {
		return 'UWP';
	}
	if(int == WE) {
		return 'WE';
	}
	if(int == OL) {
		return 'OL';
	}
	if(int == VL) {
		return 'VL';
	}
	if(int == ACGH) {
		return 'ACGH';
	}
	if(int == DD) {
		return 'DD';
	}
	if(int == WC) {
		return 'WC';
	}
	if(int == QL) {
		return 'QL';
	}
	if(int == SL) {
		return 'SL';
	}
	
	console.log("Invalid convert from index to GE (got",int,")");
	return null;
}

exports.checkCore = checkCore;
