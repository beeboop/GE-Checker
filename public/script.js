//pretty much like ninja courses
//-Need AJAX for ninjacourse style course selection
//-build GE chart, like the one in PDF

var GEChart = {
	"topName": "Topical Breadth",
	"topCats": ["Arts & Humanities (AH)","Science & Engineering (SE)","Social Science (SS)"],
	"topCatsShort": ["AH","SE","SS"],
	"topUnits": ["12-20","12-20","12-20"],
	"topMin": 12,
	"topMax": 20,
	"topReq": 52,
	
	"coreName": "Core Literacies",
	"coreCats": ["Literacy with Words & Images","Civic & Cultural Literacy","Quantitative Literacy","Scientific Literacy"],
	"coreUnits": ["20","9","3","3"],
	"coreSubcats": [
		["College English Composition Requirement","Writing Experience","Oral Skills or Additional Writing Experience","Visual Literacy"],
		["American Cultures, Governance & History","Domestic Diversity","World Cultures"], 
		[""],
		[""]
	],
	"coreSubcatsShort": [
		["UWP","WE","OL","VL"],
		["ACGH","DD","WC"],
		["QL"],
		["SL"]
	],
	"coreSubUnits": [
		["8","6","3","3"],
		["6","3","3"],
		["3"],
		["3"]
	],
	
	"buildTop": function(parent) {
		
		//make table first
		var TopTable = document.createElement("table");
		TopTable.id = "top_table";
		//create heading
		var TopHeading = document.createElement("th");
		TopHeading.className = "heading";
		TopHeading.setAttribute("colspan",GEChart.topCats.length);
		TopHeading.appendChild(document.createTextNode(GEChart.topName));
		//GEChart.buildCheckBox("top_satisfied",TopHeading); //create Satisfied checkbox/span
		//attach heading to table
		var headertr = document.createElement("tr");
		headertr.appendChild(TopHeading);
		var headerthead = document.createElement("thead");
		headerthead.appendChild(headertr);
		TopTable.appendChild(headerthead);
		
		//create categories subheaders
		var tbody = document.createElement("tbody");
		tbody.className = "tbody";
		var SubTopHeadingTR = document.createElement("tr");
		var SubTopCoursesTR = document.createElement("tr");
		var lettering = 'A';
		for(var i=0; i<GEChart.topCats.length; i++) {
			var SubTopHeading = document.createElement("th");
			SubTopHeading.className = "subheading";
			SubTopHeading.appendChild(document.createTextNode(lettering+". "+GEChart.topCats[i]+": "));
			GEChart.buildCheckBox(GEChart.topCatsShort[i] + "_satisfied",SubTopHeading); //create Satisfied checkbox/span
			//append everything in <th> to <tr> (heading)
			SubTopHeadingTR.appendChild(SubTopHeading);
			lettering = nextChar(lettering);
			
			var SubTopCourses = document.createElement("td");
			$(SubTopCourses).append("<div class=\"" + GEChart.topCatsShort[i] + "_courses top_courses\"></div>");
			SubTopCoursesTR.appendChild(SubTopCourses);
		}
		tbody.appendChild(SubTopHeadingTR);
		tbody.appendChild(SubTopCoursesTR);
		TopTable.appendChild(tbody);
		
		//footer: 
		var TopFooter = document.createElement("td");
		TopFooter.className = "footer";
		TopFooter.setAttribute("colspan",GEChart.topCats.length);
		var footerStr = "";
		for(var i=0; i<GEChart.topCats.length; i++) {
			footerStr += "(" + GEChart.topCatsShort[i] + ") " + "<p class=\"" + GEChart.topCatsShort[i] + "_total top_subtotal\">" + "0" + "</p>" + " units";
			if(i < (GEChart.topCats.length-1)) 
				footerStr += "\t+\t"; 
			else
				footerStr += "\t=\t <p class=\"top_total\">0</p> / "+GEChart.topReq+" units";
		}
		TopFooter.innerHTML = footerStr;
		//attach footer to table
		var footertr = document.createElement("tr");
		footertr.appendChild(TopFooter);
		var footertfoot = document.createElement("tfoot");
		footertfoot.appendChild(footertr);
		TopTable.appendChild(footertfoot);
		
		$(parent).append(TopTable);
	},
	
	"buildCore": function(parent) {
		//make table first
		var CoreTable = document.createElement("table");
		CoreTable.id = "core_table";
		//create heading
		var CoreHeading = document.createElement("th");
		CoreHeading.className = "heading";
		CoreHeading.setAttribute("colspan",GEChart.coreCats.length);
		CoreHeading.appendChild(document.createTextNode(GEChart.coreName));
		//GEChart.buildCheckBox("core_satisfied",CoreHeading); //create Satisfied checkbox/span
		//attach heading to table
		var cheadertr = document.createElement("tr");
		cheadertr.appendChild(CoreHeading);
		var cheaderthead = document.createElement("thead");
		cheaderthead.appendChild(cheadertr);
		CoreTable.appendChild(cheaderthead);

		//create categories subheaders
		var ctbody = document.createElement("tbody");
		ctbody.className = "tbody";
		var SubCoreHeadingTR = document.createElement("tr");
		for(var i=0; i<GEChart.coreCats.length; i++) {
			var SubCoreHeading = document.createElement("th");
			SubCoreHeading.className = "subheading";
			SubCoreHeading.appendChild(document.createTextNode(romanize(i+1)+". "+GEChart.coreCats[i]+" ("+GEChart.coreUnits[i]+" units) "));
			GEChart.buildCheckBox(i+"_core_satisfied",SubCoreHeading); //create Satisfied checkbox/span
			SubCoreHeadingTR.appendChild(SubCoreHeading);
		}
		ctbody.appendChild(SubCoreHeadingTR);
		
		var catLetter = 'a';
		//create sub-categories
		for(var i=0; i<GEChart.coreSubcats[0].length; i++) {
			var SubcategoryTR = document.createElement("tr");
			for(var j=0; j<GEChart.coreCats.length; j++) {
				if(GEChart.coreSubcats[j][i] != null) {
					var SubcategoryTD = document.createElement("td");
					var subdiv = document.createElement("div");
					$(subdiv).addClass("subcat_div");
					$(SubcategoryTD).addClass("subcat_td");
					/*//hard code DD case here
					if(GEChart.coreSubcatsShort[j][i] == "DD") {
						$(SubcategoryTD).addClass("subcat_td dd_td");
						$(SubcategoryTD).attr("rowspan","2");
					}
					if(GEChart.coreSubcatsShort[j][i-1] == "DD") {
						continue;
					}
					if(GEChart.coreSubcatsShort[j][i] == "WC") {
						catLetter = 'c';
					}
					//done hard code*/
					if(GEChart.coreSubcats[j][i] != "") {
						$(SubcategoryTD).append("<p class=\"subcat_header\">" + catLetter + ". " + GEChart.coreSubcats[j][i] + ": </p>");
						//$(subdiv).append(catLetter + ". " + GEChart.coreSubcats[j][i] + ": <p class=\"" + GEChart.coreSubcatsShort[j][i] + "_total core_subtotal\">" + "___ " + GEChart.coreSubUnits[j][i] + " units </p>");
					}
					/*
					else {
						$(subdiv).append("<p class=\"" + GEChart.coreSubcatsShort[j][i] + "_total core_subtotal\">" + "___ " + GEChart.coreSubUnits[j][i] + " units </p>");
						//SubcategoryTD.innerHTML = "<div class=\"" + GEChart.coreSubcatsShort[j][i] + "_total core_subtotal\">" + "___ " + GEChart.coreSubUnits[j][i] + " units </div>";
					}
					//if(GEChart.coreSubcatsShort[j][i] == "ACGH") {
					//	SubcategoryTD.setAttribute("rowspan","3");
					//}
					*/
					$(subdiv).append("<div class=\"" + GEChart.coreSubcatsShort[j][i] + "_courses subcat_courses\"></div>");
					$(subdiv).append("<div class=\"requirement\"><p class=\"core_subreq\">" + GEChart.coreSubUnits[j][i] + " units</p><p class=\"" + GEChart.coreSubcatsShort[j][i] + "_total core_subtotal\">" + "0</p></div>");
					$(SubcategoryTD).append(subdiv);
					SubcategoryTR.appendChild(SubcategoryTD);
				}
			}
			catLetter = nextChar(catLetter);
			ctbody.appendChild(SubcategoryTR);
		}
		
		CoreTable.appendChild(ctbody);
		
		$(parent).append(CoreTable);
	},
	
	"buildCheckBox": function(IDname,parent) {
		//create Satisfied checkbox/span
		var satisfied_span = document.createElement("span");
		satisfied_span.className = "satisfied";
		var satisfied_checkbox = document.createElement("input");
		satisfied_checkbox.type = "checkbox";
		satisfied_checkbox.id = IDname;
		satisfied_checkbox.className = "satisfied_checkbox";
		satisfied_checkbox.disabled = true;
		satisfied_span.appendChild(satisfied_checkbox);
		satisfied_span.appendChild(document.createTextNode("Satisfied"));
		parent.appendChild(satisfied_span);
	},
	
	"insertTopGE": function(obj) {
		//put into table from obj-array then update units
		//(".AH_courses").append / (".AH_total").text++ / (".top_total").text++
		//var top_arr = ["AH","SE","SS"];
		var top_arr = GEChart.topCatsShort.slice();
		var len = top_arr.length;
		var top_area;
		var array;
		var total_units = 0;
		
		while(len--) {
			top_area = top_arr[len];
			array = obj[top_area];
			$("."+top_area+"_courses").empty();
			for(var i=0; i<array.length; i++) {
				$("."+top_area+"_courses").append("<div class =\"courses_units " + array[i].courseID.replace(/\s+/g, '') + "\"><p class=\"courses\">"+ array[i].courseID +"</p><p class=\"units\"> " + array[i].units + "</p></div>");
			}
			$("."+top_area+"_total").text(obj.fulfilled[len]);
			total_units += obj.fulfilled[len];
			$(".top_total").text(total_units);
		}
		GEChart.checkTopSatisfied(obj.fulfilled);
	},
	
	"insertCoreGE": function(obj) {
		var core_arr = [].concat.apply([], GEChart.coreSubcatsShort);
		var len = core_arr.length;
		var core_area;
		var array;
		
		while(len--) {
			core_area = core_arr[len];
			array = obj[core_area];
			$("."+core_area+"_courses").empty();
			for(var i=0; i<array.length; i++) {
				$("."+core_area+"_courses").append("<div class =\"courses_units " + array[i].courseID.replace(/\s+/g, '') + "\"><p class=\"courses\">"+ array[i].courseID +"</p><p class=\"units\"> " + array[i].units + "</p></div>");
			}
			$("."+core_area+"_total").text(obj.fulfilled[len]);
		}
		GEChart.checkCoreSatisfied(obj.satisfied);
	},
	
	"calculateGE": function(array) {
		//http://localhost:8081/run?q=["","",""]
		//returned data: [{top stuff},{core stuff}]
		//top stuff: {AH:[obj],SE:[obj],SS:[obj],fulfilled:[total units in each]}
		if(array.length > 0) {
			$.get("http://localhost:8081/run?q="+JSON.stringify(array), function(data, status){
				//insert DATA into CHART
				console.log(data);
				if(data != null) {
					GEChart.insertTopGE(data[0]);
					GEChart.insertCoreGE(data[1]);
				}
				//$(".main_div").equalHeights();
			});
		}
		else {
			GEChart.resetCharts();
		}
	},
	
	"resetCharts": function() {
		$('.top_courses').empty();
		$(".top_total, .top_subtotal").text("0");
		
		$('.subcat_courses').empty();
		$('.core_subtotal').text("0");
	},
	
	"checkTopSatisfied": function(top_fulfilled) {
		//check Top and its subcategories first
		var top_total = 0;
		var len = top_fulfilled.length;
		while(len--) {
			var val = parseInt(top_fulfilled[len]);
			top_total += val;
			if(val >= GEChart.topMin) {
				document.getElementById(GEChart.topCatsShort[len]+"_satisfied").checked = true;
			}
			else {
				document.getElementById(GEChart.topCatsShort[len]+"_satisfied").checked = false;
			}
		}
		/*
		if(top_total >= GEChart.topReq) {
			document.getElementById("top_satisfied").checked = true;
		}
		else {
			document.getElementById("top_satisfied").checked = false;
		}
		*/
	},
	
	"checkCoreSatisfied": function(core_satisfied) {
		var offset = 0;
		var satisfied = true;
		for(var i=0; i<GEChart.coreSubcats.length; i++) {
			for(var j=offset; j<(GEChart.coreSubcats[i].length+offset); j++) {
				satisfied = true;
				satisfied &= core_satisfied[j];
				if(!satisfied) break;
			}
			if(satisfied) {
				document.getElementById(i+"_core_satisfied").checked = true;
			}
			else {
				document.getElementById(i+"_core_satisfied").checked = false;
			}
			offset += GEChart.coreSubcats[i].length;
		}
	}
};

var inputCourses = {
	"courseTaken": [],
	"deptList": [],
	"courseList": [],
	"courseListAll": {},
	"courseListObj": [],
	
	"getDepts": function(callback) {
		//get array of depts from node with ajax
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (req.readyState === XMLHttpRequest.DONE) {
				if (req.status === 200) {
					var resp = req.response;
					callback(resp);
					//console.log(resp);
				} 
				else {
					console.log("Problem requesting data from server:",req.status);
				}
			}
		}
		var reqURL = "http://localhost:8081/department";
		req.open('GET', reqURL, true);
		req.send();
	},
	
	"getCourseNums": function(dept,callback) {
		//get array of avaliable based on dept course from node
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if (req.readyState === XMLHttpRequest.DONE) {
				if (req.status === 200) {
					var resp = req.response;
					callback(dept,resp);
					//console.log(resp);
				} 
				else {
					console.log("Problem requesting data from server:",req.status);
				}
			}
		}
		var reqURL = "http://localhost:8081/department?q="+dept;
		req.open('GET', reqURL, true);
		req.send();
	},
	
	"buildInput": function(parent) {
  	var deptInput = document.createElement("input");
	  deptInput.type = "text";
  	deptInput.id = "dept_input";
	  deptInput.placeholder = "Department";
		
  	var courseInput = document.createElement("input");
	  courseInput.type = "text";
  	courseInput.id = "course_input";
	  courseInput.placeholder = "Course";
		
		$(parent).append(deptInput);
		$(parent).append(courseInput);
		
		//setup events and auto-complete
		//if nothing in deptList yet, populate it with getDepts
		inputCourses.getDepts(inputCourses.getDeptsCallback);
		
		/*$("#dept_input").mouseover(function(){
			if(inputCourses.deptList.length <= 0)
				inputCourses.getDepts(inputCourses.getDeptsCallback);
		});*/
		$("#dept_input").focus(function() {
			$(this).autocomplete("search", "");
		});
		$("#dept_input").on("click",function(){
			$(this).autocomplete("search", "");
		});

		
		//use Awesomecomplete?
		//courseNum can't only match first char cause of 2 digits coursenums
		
		$("#dept_input").autocomplete({
			//source: inputCourses.deptList,
			source: function( request, response ) {
				var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
				response( $.grep( inputCourses.deptList , function( item ){
					return matcher.test( item );
				}) );
			},
			minLength: 0,
			autoFocus: true
		});
		$("#course_input").autocomplete({
			//source: inputCourses.courseList,
			source: function( request, response ) {
				var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
				response( $.grep( inputCourses.courseList , function( item ){
					return matcher.test( item );
				}) );
			},
			minLength: 0,
			autoFocus: true
		});
		
		//on deptInput blur, mouseleave, courseinput focus -> update courseInput
		//$("#dept_input").blur(inputCourses.prepareCourseNum);
		//$("#course_input").focus(inputCourses.prepareCourseNum);
		$("#dept_input").on( "autocompleteselect", function(event,ui){ inputCourses.prepareCourseNum(ui.item.value); });
		//$("#dept_input").on( "autocompletechange", function(){ inputCourses.prepareCourseNum(); $("#course_input").focus(); });
		$("#course_input").focus(function() {
			$(this).autocomplete("search", "");
		});
		$("#course_input").on("click",function(){
			$(this).autocomplete("search", "");
		});
		
		//on course_input blur, enter, select -> put in courseList and clear the input
		//$("#course_input").blur(inputCourses.courseSelectedEvent);
		$("#course_input").on( "autocompleteselect", function(event,ui){inputCourses.courseSelectedEvent(ui.item.value); $(this).val(''); return false;});
		//$("#course_input").on( "autocompletechange", inputCourses.courseSelectedEvent);
	},
	
	"prepareCourseNum": function(dept) {
		//get value in dept input 
		//pass dept into getCourseNums then update courseList
		//var dept = $("#dept_input").val();
		//console.log("dept:",dept);
		dept = dept.toUpperCase();
		//$("#dept_input").val(dept);
		if(3 == dept.length && /^[a-zA-Z]{3}$/.test(dept)) {
			if(!inputCourses.courseListAll.hasOwnProperty(dept)) {
				inputCourses.getCourseNums(dept,inputCourses.getCourseNumCallback);
			}
			else {
				inputCourses.getCourseNumCallback(dept,JSON.stringify(inputCourses.courseListAll[dept]));
			}
		}
		else {
			console.log("Invalid Dept:",dept);
			inputCourses.courseList = [];
		}
	},
	
	"getCourseNumCallback": function(dept,data) {
		//insert into coursenum dropdown
		var arr = JSON.parse(data);
		var num;
		inputCourses.courseList.length = 0;
		inputCourses.courseListObj.length = 0;
		inputCourses.courseListObj = arr.slice(); //copy array
		if(!inputCourses.courseListAll.hasOwnProperty(dept)) {
			inputCourses.courseListAll[dept] = arr.slice();
		}
		//console.log(arr);
		for(var i=0; i<arr.length; i++) {
			num = arr[i]._id.slice(3,arr[i]._id.length);
			num = num.toUpperCase();
			inputCourses.courseList.push(num.replace(/^[0]+/g,"")); // need to fix when its leading zero
		}
		
		 $("#course_input").focus();
	},
	
	"getDeptsCallback": function(data) {
		//insert into dept dropdown
		var arr = JSON.parse(data);
		if(inputCourses.deptList.length <= 0) {
			for(var i=0; i<arr.length; i++) {
				inputCourses.deptList.push(arr[i]._id);
			}
		}
	},
	
	"insertCourse": function(obj,parent) {
		//once chosen, insert into div below input boxes, insert into ge chart
		//inputCourses.courseTakenObj.push(obj);
		if(inputCourses.courseTaken.indexOf(obj.courseID) == (-1)) {
			inputCourses.courseTaken.push(obj.courseID);
			var div = inputCourses.createCourseDiv(obj);
			var info_div = inputCourses.createCourseInfoDiv(obj);
			
			GEChart.calculateGE(inputCourses.courseTaken);
			
			$(div).click(function() {
				$("."+obj.courseID.replace(/\s+/g, '') + "_info").slideToggle("1000");
			})
			
			$(parent)
				.append(div)
				.append(info_div);
				
			$("."+obj.courseID.replace(/\s+/g, ''))
				.mouseover(function() {
					$("."+obj.courseID.replace(/\s+/g, '')).addClass("highlight_course");
				})
				.mouseleave(function() {
					$("."+obj.courseID.replace(/\s+/g, '')).removeClass("highlight_course");
			});
		}
	},
	
	"createCourseDiv": function(obj) {
		var div = document.createElement("div");
		$(div)
			.attr('id', obj.courseID.replace(/\s+/g, ''))
			.addClass("course_taken_selected " + inputCourses.hasTopCore(obj.topCount,obj.coreCount) + " " + obj.courseID.replace(/\s+/g, ''))
			.text(obj.courseID)
			.append("<a href=\"#\" class=\"remove_course\" onclick=\"inputCourses.removeCourse('"+obj.courseID+"');\"\">x</a>");
			
		return div;
	},
	
	"createCourseInfoDiv": function(obj) {
		var div = document.createElement("div");
		var ge_str = "<p class=\"course_info_ge\">GE Credit: ";
		
		if(obj.topGE.length > 0) {
			ge_str += obj.topGE.toString() + " | ";
		}
		else {
			ge_str += "No Topical GE | "
		}
		
		if(obj.coreGE.length > 0) {
			ge_str += obj.coreGE.toString() + "</p>";
		}
		else {
			ge_str += "No Core GE</p>";
		}
		
		$(div)
			.addClass("course_taken_info " + obj.courseID.replace(/\s+/g, '') + "_info")
			.append("<p class=\"course_info_title\">" + obj.course + "</p>")
			.append("<p class=\"course_info_units\">Units: " + obj.units + "</p>")
			.append(ge_str);
			
			
		return div;
	},
	
	"hasTopCore": function(topCount,coreCount) {
		if(topCount > 0 && coreCount > 0) {
			return "has_both";
		}
		else if(topCount <= 0 && coreCount <= 0) {
			return "has_neither";
		}
		else if(topCount > 0) {
			return "has_only_top";
		}
		else {// if(coreCount > 0) {
			return "has_only_core";
		}
	},
	
	"courseSelectedEvent": function(courseNum) {
		//var courseNum = $("#course_input").val();
		if(courseNum != "") {
			var cID = $("#dept_input").val() + " " + courseNum;
			var cIndex = inputCourses.courseList.indexOf(courseNum);
			var obj = inputCourses.courseListObj[cIndex];
			if(obj != null) {
				inputCourses.insertCourse(obj,$(".course_selected"));
				$("#course_input").blur();
				$("#dept_input").val('');
				$("#course_input").val('');
				//empty out dropdown 
				inputCourses.courseList = [];
			}
			else {
				//alert?
			}
		}
	},
	
	"removeCourse": function(unwant_courseID) {
		//remove from array
		if(inputCourses.courseTaken.length > 1) {
			var remove_index = inputCourses.courseTaken.findIndex(function(item,index) {
				if(item == unwant_courseID)
					return true;
			});
			if (remove_index > -1) {
				inputCourses.courseTaken.splice(remove_index, 1);
			}
		}
		else {
			inputCourses.courseTaken.length = 0;
		}
		//remove from div
		$('#'+unwant_courseID.replace(/\s+/g, '')).remove();
		$('.'+unwant_courseID.replace(/\s+/g, '')+'_info').remove();
		
		GEChart.calculateGE(inputCourses.courseTaken);
	},
	
	"saveCourses": function() {
		
	},
	
	"restoreCourses": function() {
		
	}
};

var header = {
	"logo": "logo.png",
	"build": function() {
		var img = document.createElement("img");
		$(img).attr("src",header.logo)
		$("#header")
			.append(img)
			.append("for UC Davis");
		header.buildnav();
	},
	
	"buildnav": function() {
		var choices = [
			{'name': "Home", 'link': "http://localhost:8081"},
			{'name': "About", 'link': "http://localhost:8081"},
			{'name': "Course Not Found?", 'link': "http://localhost:8081"}
		];
		
		var ul = document.createElement("ul");
		ul.className = "ul_nav";
		for(var i=0; i<choices.length; i++) {
			$(ul).append("<li><a href=\"" + choices[i].link + "\">" + choices[i].name + "</a></li>");
		}
		
		$('#navbar')
			.append(ul);
	}
}

var footer = {
	"build": function() {
		$("#footer")
			.append("this the footer, by bbbbs");
	}
}


function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

function romanize(num) {
  var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
  for ( i in lookup ) {
    while ( num >= lookup[i] ) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

function setHeight() {
	var bodyHeight = document.body.offsetHeight;
	var headerHeight = $("#header").outerHeight(true);
	var navHeight = $("#navbar").outerHeight(true);
	var footerHeight = $("#footer").outerHeight(true);
	
	console.log(bodyHeight,headerHeight,navHeight,footerHeight);
	$(".main_div")
		.height(bodyHeight-headerHeight-navHeight-footerHeight-20);
		//.css("min-height","400px");
	/*$(".ge_chart")
		.css("height","100%")
		.css("overflow-y","auto");*/
}

$(document).ready(function(){
	header.build();
	footer.build();
	GEChart.buildTop($(".top_chart"));
	GEChart.buildCore($(".core_chart"));
	inputCourses.buildInput($(".course_input"));
	//$(".main_div").equalHeights();
	setHeight();
}); 
