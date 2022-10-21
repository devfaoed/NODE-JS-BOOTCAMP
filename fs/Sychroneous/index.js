const fs = require("fs");

//using fs to read the content of a file
const readFile = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(readFile);

//using ES6 to concatinate or join two string together and using ES6 "\n" to create a new line
const joinText = `Using ES6 to join things together: ${readFile}. \n Created ${Date.now()}`;
console.log(joinText);

// using fs to create a new file and write contents into the file
const createFile = `write this into a new file: ${joinText}`;
fs.writeFileSync('./txt/output.txt', createFile);
console.log('file created successfully and content wriiten inside successfully');
