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
  return (Array.isArray(content)
    ? blue("./" + content[0] + "/")
    : cyan("./" + content));
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
      return Array.isArray(value) ? value[0] === folder : value === folder;
    },
  );
  return mathed;
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
  if (folderIndex === -1) {
    console.log(red("jsh : cd: no such file or directory: " + folderName));
    return;
  }
  pwdRegistery.push(folderIndex);
};

const ls = function () {
  const contents = getFileSystemContents();
  console.log(contents);
};

const createFolder = function(folderName) {
  return [folderName, []];
}

const mkdir = function (args) {
  const currentDirectory = getCurrentFileSystem();
  for (let index = 0; index < args.length; index++) {
    const element = args[index];
    currentDirectory.push(createFolder(element));
  }
}

const rm = function (args) {
  for (let index = 0; index < args.length; index++) {
    const currentDirectory = getCurrentFileSystem();
    const element = args[index];
    const elementIndex = findFolderIndex(element);
    currentDirectory.splice(elementIndex, 1);
  }
}

const pwd = function() {
  console.log(yellow(generatePwd()));
}

const functions = [cd, ls, clear, clear, mkdir, rm, pwd];
const functionsRegistery = ["cd", "ls", "clear", "cls", "mkdir", "rm", "pwd"];

const userInput = function (path) {
  const message = green(path + " ~");
  return prompt(message).trim().split(" ");
};

const getCommandReference = function (commandName) {
  for (let index = 0; index < functionsRegistery.length; index++) {
    if (functionsRegistery[index] === commandName) {
      return functions[index];
    }
  }
  console.log(red("jsh: command not found: " + commandName));
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
