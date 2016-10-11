var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var BASEDBurl = 'mongodb://localhost:27017/'
var projectName = "myproject";
var DBurl = BASEDBurl+projectName;

function open() {
	MongoClient.connect(DBurl, function(err, db) {
		if(err === null) {
			console.log("DB: Connected correctly to server");
			
			db.close();
		}
		else {
			console.log("Error:",err);
		}
	});
}

function queryCourse(collectionName, cID, callback) {
	MongoClient.connect(DBurl, function(err, db) {
		if(err === null) {
			var col = db.collection(collectionName);
			var cWanted = {'courseID': cID};
			
		  col.find(cWanted).limit(1).toArray(function(err, docs) {
		    assert.equal(null, err);
		    assert.equal(1, docs.length);
		    callback(docs[0]);
		    
				console.log("DB:",cID,"Queried.");
				db.close();
		  });
		}
		else {
			console.log("DB: Error:",err);
		}
	});
}

function queryAllCourse(collectionName, cArray, options, callback) {
	MongoClient.connect(DBurl, function(err, db) {
		if(err === null) {
			var col = db.collection(collectionName);
			var cWanted = buildObjArray(cArray);
			
			col.find({$or: cWanted}, options).limit(cArray.length).toArray(function(err, docs) {
			  assert.equal(null, err);
			  //assert.equal(cArray.length, docs.length);
			  callback(docs);
			  
			  console.log("DB: Queried.");
				db.close();
			});
		}
		else {
			console.log("DB: Error:",err);
		}
	});
}

function query(collectionName,selection,projection,option,callback) {
	MongoClient.connect(DBurl, function(err, db) {
		if(err === null) {
			var col = db.collection(collectionName);
			
		  col.find(selection, projection, option).toArray(function(err, docs) {
		    assert.equal(null, err);
		    callback(docs);
		    
				console.log("DB: Queried.");
				db.close();
		  });
		}
		else {
			console.log("DB: Error:",err);
		}
	});
}

function insert(collectionName, doc) {
	MongoClient.connect(DBurl, function(err, db) {
		if(err === null) {
			var col = db.collection(collectionName);
			//col.insertOne(doc, function(err, r) {
			col.save(doc, function(err, r) {
				assert.equal(null, err);
				//assert.equal(1, r.insertedCount);
				//assert.equal(doc.length, r.insertedCount);
				
				console.log("DB: Inserted.", doc._id);
				db.close();
			});
		}
		else {
			console.log("DB: Error:",err);
		}
	});
}

function insertMany(collectionName, arr) {
	MongoClient.connect(DBurl, function(err, db) {
		if(err === null) {
			var col = db.collection(collectionName);
			//col.insert(arr,{ ordered: false }, function(err, r) {
				//assert.equal(null, err);
				//assert.equal(1, r.insertedCount);
				//assert.equal(arr.length, r.insertedCount);
			for(var i=0; i<arr.length; i++) {
				col.save(arr[i], function(err, r) {
					assert.equal(null, err);
				});
			}
				console.log("DB: Many Inserted.", arr[0]._id);
				//db.close();
			//});
		}
		else {
			console.log("DB: Error:",err);
		}
	});
}

function update(collectionName, cID, newDoc) {
	MongoClient.connect(DBurl, function(err, db) {
		if(err === null) {			
			var col = db.collection(collectionName);
			var toBeUpdated = {'courseID': cID};
			var newVals = {$set: newDoc};
			col.updateOne(toBeUpdated, newVals, function(err, r) {
				assert.equal(null, err);
				assert.equal(1, r.matchedCount);
				assert.equal(1, r.modifiedCount);
				
				console.log("DB: Updated",cID);
				db.close();
			});
		}
		else {
			console.log("DB: Error:",err);
		}
	});
}

function remove(collectionName, cID) {
	MongoClient.connect(DBurl, function(err, db) {
		if(err === null) {
			var col = db.collection(collectionName);
			var toBeRemoved = {'courseID': cID};

		  // Remove a single document
		  col.deleteOne(toBeRemoved, function(err, r) {
		    assert.equal(null, err);
		    assert.equal(1, r.deletedCount);

				console.log("DB: Removed",cID);
				db.close();
			});
		}
		else {
			console.log("DB: Error:",err);
		}
	});
}

function buildObjArray(cArray) {
	//takes in array of courses in strings ["ECS 030", "HIS 017A"]
	//returns it in obj form [{courseID: ECS30}, {courseID: HIS 017A}]
	if(!Array.isArray(cArray)) {
		console.log("DB: buildObjArray: parameter needs to be an array");
		return null;
	}
	
	var cObj = [];
	for(var i=0; i<cArray.length; i++) {
		cObj.push({'courseID': cArray[i]});
	}
	
	return cObj;
}

exports.open = open;
exports.insert = insert;
exports.insertMany = insertMany;
exports.update = update;
exports.query = query;
exports.queryCourse = queryCourse;
exports.queryAllCourse = queryAllCourse;
exports.remove = remove;
