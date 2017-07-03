//Dina Safreno
var fs = require('fs');

if (process.argv.length <= 2) {
  console.log("Please enter a parameter");
  process.exit(-1);
}

var data = JSON.parse(fs.readFileSync(process.argv[2]));
var outputs = {};
var root = Object.keys(data)[0];

data[root].forEach(function (k){
  objToOutput(root, k, null, null);
});

Object.keys(outputs).forEach(function(file) {
  fs.writeFile(file + ".json", JSON.stringify(outputs[file]));
});

function objToOutput(fileName, obj, id, index) {
  var outputObj = {};
  if (id !== null) outputObj["id"] = id;
  if (index !== null) outputObj["__index"] = index;
  if (obj["id"]) id = obj["id"];
  Object.keys(obj).forEach(function (key) {
    var val = obj[key];
    var type = typeof val;
    if (Array.isArray(val)){ //if the element is an array
      val.forEach(function (elem, i){
        objToOutput(fileName + "_" + key, elem, id, i);
      });
    } else if (type === "object" && val !== null) { //if it is another object
      objToOutput(fileName + "_" + key, val, id, null);
    } else { //if it is anything else
      outputObj[key] = val;
    }
  });
  if (!outputs[fileName]) outputs[fileName] = [];
  outputs[fileName].push(outputObj);
}
