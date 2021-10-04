const path = require("path");
// console.log(__dirname);

//const filePath = path.join(__dirname,"../txt", "test.txt"); // join wajib pake dirname

const filePath = path.join("../txt", "test.txt"); // join wajib pake dirname
// console.log(filePath);

const fileResolvePath = path.resolve("../text/test.txt");
module.exports = fileResolvePath;
