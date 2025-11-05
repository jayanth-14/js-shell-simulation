// utilitities implemented by me
// map - takes an array and function references and gives back a new array based on the function references
const map = function (array, method) {
  const modifiedArray = [];
  for (let index = 0; index < array.length; index++) {
    modifiedArray.push(method(array[index]));
  }
  return modifiedArray;
};

const filter = function (array, method) {
  const modifiedArray = [];
  for (let index = 0; index < array.length; index++) {
    if (method(array[index])) {
      modifiedArray.push(array[index]);
    }
  }
  return modifiedArray;
};

let userName = "root";
let pwdRegistery = [0, 0, 0];

const rootFileSystem = [["root", [
  ["js", [["assignments", [["functions", []], ["recursion", []]]], "hello.js"]],
  ["downloads", []],
  ["documents", []],
  ["pictures", []],
]]];

const generatePwd = function () {
  const location = pwdRegistery;
  const folders = [];
  let currentFileSystem = rootFileSystem;
  for (let index = 0; index < location.length; index++) {
    const currentFolderIndex = location[index];
    const currentDirectory = currentFileSystem[currentFolderIndex];
    folders.push(currentDirectory[0]);
    currentFileSystem = currentDirectory[1];
  }
  return folders.join("/");
};

const getCurrentFileSystem = function () {
  let currentFileSystem = rootFileSystem;
  for (let index = 0; index < pwdRegistery.length; index++) {
    const location = pwdRegistery[index];
    currentFileSystem = currentFileSystem[location][1];
  }
  return currentFileSystem;
};

const stripContents = function (content) {
  return "./" + (Array.isArray(content) ? content[0] + "/" : content);
};

const getFileSystemContents = function () {
  const currentDirectory = getCurrentFileSystem();
  const contents = map(currentDirectory, stripContents);
  return contents.join("\t");
};

const findFolderIndex = function (folderName) {
  const currentDirectory = getCurrentFileSystem();
};

const cd = function (folderName) {
  if (folderName === "..") {
    if (pwdRegistery.length === 1) {
      console.log("Couldn't go backward from root");
      return;
    }
    return pwdRegistery.pop();
  }
  pwdRegistery.push(0);
};

const ls = function () {
  const contents = getFileSystemContents();
  console.log(contents);
};

const functions = [cd, ls];
const functionsRegistery = ["cd", "ls"];

const userInput = function (userName, path) {
  const leading = "\n" + userName + "@" + path + ">";
  return prompt(leading).trim().split(" ");
};

const getCommandReference = function (commandName) {
  for (let index = 0; index < functionsRegistery.length; index++) {
    if (functionsRegistery[index] === commandName) {
      return functions[index];
    }
  }
};

const executeCommand = function (commandInfo) {
  const commandName = commandInfo[0];
  const command = getCommandReference(commandName);
  command(commandInfo[1]);
};

const start = function () {
  while (true) {
    const pwd = generatePwd();
    const commandInfo = userInput(userName, pwd);
    executeCommand(commandInfo);
  }
};

start();
