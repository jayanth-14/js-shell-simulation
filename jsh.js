// utilitities implemented by me
// map - takes an array and function references and gives back a new array based on the function references
const map = function (array, method) {
  const modifiedArray = [];
  for (let index = 0; index < array.length; index++) {
    modifiedArray.push(method(array[index]));
  }
  return modifiedArray;
};

const filter = function (method, array, value) {
  const modifiedArray = [];
  for (let index = 0; index < array.length; index++) {
    if (method(array[index], index, value)) {
      modifiedArray.push(array[index]);
    }
  }
  return modifiedArray;
};

const findIndex = function (array, value, method) {
  for (let index = 0; index < array.length; index++) {
    if (method(array[index], value)) {
      return index;
    }
  }
  return -1;
};

// colors
const bold = function (text) {
  return "\x1B[1m" + text + "\x1B[0m";
};
const red = function (text) {
  return "\x1B[31m" + text + "\x1B[0m";
};

const green = function (text) {
  return "\x1B[32m" + text + "\x1B[0m";
};

const yellow = function (text) {
  return "\x1B[33m" + text + "\x1B[0m";
};

const blue = function (text) {
  return "\x1B[34m" + text + "\x1B[0m";
};

const cyan = function (text) {
  return "\x1B[36m" + text + "\x1B[0m";
};

const clear = function () {
  console.clear();
};

const displayError = function (message) {
  console.log(red(message));
};

let pwdRegistery = [0, 0, 0];

const rootFileSystem = [["root/", [
  ["js/", [["assignments/", [["functions/", []], ["recursion/", []]]], [
    "hello.js",
    ["hello world, this is the data written in hello.js"],
  ]]],
  ["downloads/", []],
  ["documents/", []],
  ["pictures/", []],
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
  return folders.join("");
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
  return (content[0].endsWith("/")
    ? blue("./" + content[0])
    : cyan("./" + content[0]));
};

const getFileSystemContents = function () {
  const currentDirectory = getCurrentFileSystem();
  const contents = map(currentDirectory, stripContents);
  return contents.join("\t");
};

const findFolderIndex = function (folderName) {
  const currentDirectory = getCurrentFileSystem();
  const mathed = findIndex(
    currentDirectory,
    folderName,
    function (value, folder) {
      return value[0] === folder || value[0] === folder + "/";
    },
  );
  return mathed;
};

const isFolder = function (folderIndex) {
  const currentDirectory = getCurrentFileSystem();
  const folderName = currentDirectory[folderIndex];
  return folderName[0].endsWith("/");
};

const cd = function (args) {
  const folderName = args[0];
  if (folderName === "..") {
    if (pwdRegistery.length === 1) {
      console.log("Couldn't go backward from root");
      return;
    }
    return pwdRegistery.pop();
  }
  if (folderName === ".") return;
  const folderIndex = findFolderIndex(folderName);
  if (!isFolder(folderIndex)) {
    displayError("jsh: cd: not a directory: " + folderName);
    return;
  }
  if (folderIndex === -1) {
    displayError("jsh : cd: no such file or directory: " + folderName);
    return;
  }
  pwdRegistery.push(folderIndex);
};

const ls = function () {
  const contents = getFileSystemContents();
  console.log(contents);
};

const create = function (folderName, isFolder) {
  const name = folderName + (isFolder ? "/" : "");
  return [name, []];
};

const mkdir = function (args) {
  const currentDirectory = getCurrentFileSystem();
  for (let index = 0; index < args.length; index++) {
    const folderName = args[index];
    currentDirectory.push(createFolder(folderName, true));
  }
};

const rm = function (args) {
  for (let index = 0; index < args.length; index++) {
    const currentDirectory = getCurrentFileSystem();
    const element = args[index];
    const elementIndex = findFolderIndex(element);
    currentDirectory.splice(elementIndex, 1);
  }
};

const pwd = function () {
  console.log(yellow(generatePwd()));
};

const echo = function (args) {
  console.log(args.join(" "));
};

const touch = function (args) {
  const currentDirectory = getCurrentFileSystem();
  for (let index = 0; index < args.length; index++) {
    const fileName = args[index];
    currentDirectory.push(create(fileName, false));
  }
};

const textEditor = function () {
  const text = [];
  console.log(
    yellow(`Enter your text below. Type ${bold(":wq")} to save and exit.`),
  );
  while (true) {
    const line = prompt("");
    if (line.endsWith(":wq")) {
      text.push(line.slice(0,line.length - 3));
      return text.join("\n");
    }
    text.push(line);
  }
};

const cat = function (args) {
  const currentDirectory = getCurrentFileSystem();
  let fileName = args[0];
  if (fileName === ">") {
    fileName = args[1];
    const contents = textEditor();
    const fileIndex = findFolderIndex(fileName);
    currentDirectory[fileIndex][1].splice(0);
    currentDirectory[fileIndex][1][0] = contents;
    return;
  }
  if (fileName === ">>") {
    fileName = args[1];
    const contents = textEditor();
    const fileIndex = findFolderIndex(fileName);
    currentDirectory[fileIndex][1].push(contents);
    return;
  }
  const fileIndex = findFolderIndex(fileName);
  if (isFolder(fileIndex)) {
    displayError("jsh: cat: " + fileName + " : Is a directory");
    return;
  }
  if (fileIndex === -1) {
    displayError("jsh: cat: " + fileName + " : No such file or directory");
    return;
  }
  const contents = currentDirectory[fileIndex][1].join("\n");
  console.log(contents);
};

const functions = [cd, ls, clear, clear, mkdir, rm, pwd, echo, touch, cat];
const functionsRegistery = [
  "cd",
  "ls",
  "clear",
  "cls",
  "mkdir",
  "rm",
  "pwd",
  "echo",
  "touch",
  "cat",
];

const userInput = function (path) {
  const message = bold(green(path + " ~"));
  return prompt(message).trim().split(" ");
};

const getCommandReference = function (commandName) {
  for (let index = 0; index < functionsRegistery.length; index++) {
    if (functionsRegistery[index] === commandName) {
      return functions[index];
    }
  }
  displayError("jsh: command not found: " + commandName);
  return function () {};
};

const executeCommand = function (commandInfo) {
  const commandName = commandInfo[0];
  const command = getCommandReference(commandName);
  command(commandInfo.splice(1));
};

const start = function () {
  clear();
  while (true) {
    const pwd = generatePwd();
    const commandInfo = userInput(pwd);
    executeCommand(commandInfo);
  }
};

start();
