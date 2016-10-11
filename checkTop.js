//Algorithm 
//idea: sort by topGE or coreGE, then do Topicial first, then Core, in two big steps.
//probably recursive...
//draw table


//INDEX: AH=0, SE=1, SS=2
var AH = 0;
var SE = 1;
var SS = 2;
var minUnits = 12;
var maxUnits = 20;
var required = 52;

function checkTop(objArray) {
	var GEstack = {
		AH: [],
		SE: [],
		SS: [],
		fulfilled: [0,0,0]
	};
	var GEindex;
	
	for(var i=0; i<objArray.length; i++) {
		//console.log("Fulfilled:",GEstack.fulfilled);
		if(objArray[i].topCount == 0) {
			continue;
		}
		else if(objArray[i].topCount == 1) {
			var GEcovered = hasWhichGE(objArray[i]);
			GEindex = convertToIndex(GEcovered[0]); //in this case, has to be 0
			
			if(maxUnits > GEstack.fulfilled[GEindex]) {
				//check to make sure hasn't meet max units
				GEstack[GEcovered[0]].push(objArray[i]);
				GEstack.fulfilled[GEindex] += objArray[i].units;
				if(maxUnits <= GEstack.fulfilled[GEindex])
					GEstack.fulfilled[GEindex] = maxUnits;
			}
			else {
				//disregard because would exceed max units
				continue;
			}
		}
		else {
			//covers more than 1 GE
			var GEcovered = hasWhichGE(objArray[i]);
			var minIndex = findMin(GEcovered,GEstack.fulfilled);//index for GEcovrd
			GEindex = convertToIndex(GEcovered[minIndex]);
			
			if(maxUnits > GEstack.fulfilled[GEindex]) {
				//check to make sure hasn't meet max units
				GEstack[GEcovered[minIndex]].push(objArray[i]);
				GEstack.fulfilled[GEindex] += objArray[i].units;
				if(maxUnits <= GEstack.fulfilled[GEindex])
					GEstack.fulfilled[GEindex] = maxUnits;
			}
			else {
				//disregard because would exceed max units
				continue;
			}
		}
	}
	
	return GEstack;
}

function checkTopHelp(GEstack, obj) {
	//MAYBE NEED THIS?
	//for obj that can fulfill more than one GE
}

function findMin(GEcovered, fulfilled) {
	//figure out which GE has the least
	//returns the index that has the least
	//if two has same units then go with the higher number (good? bad?)
	var min = Infinity;
	var at = (-1);

  for(var i=0; i<fulfilled.length; i++) {
  	//make sure its covered first
  	var GEcoveredIndex = GEcovered.indexOf(indexToGE(i));
  	if(GEcoveredIndex != (-1)) {
		  if (fulfilled[i] < min) {
		    min = fulfilled[i];
		    at = GEcoveredIndex;
		  }
    }
  }
  
  return at;
}

function hasWhichGE(obj) {
	//figures out which GEs this course/obj covers
	//returns an array
	var hasGE = [];
	if(obj.hasOwnProperty('AH'))
		hasGE.push('AH');
	if(obj.hasOwnProperty('SE'))
		hasGE.push('SE');
	if(obj.hasOwnProperty('SS'))
		hasGE.push('SS');
		
	return hasGE;
}

function convertToIndex(str) {
	switch(str) {
		case 'AH': {
			return AH;
		}
		case 'SE': {
			return SE; 
		}
		case 'SS': {
			return SS; 
		}
		default: {
			console.log("Invalid conversion of",str);
			return null;
		}
	}
}

function indexToGE(int) {
	if(int == AH) {
		return 'AH';
	}
	if(int == SE) {
		return 'SE';
	}
	if(int == SS) {
		return 'SS';
	}
	
	console.log("Invalid convert from index to GE (got",int,")");
	return null;
}
exports.checkTop = checkTop;
