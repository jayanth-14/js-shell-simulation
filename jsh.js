let userName = "root";
let pwdRegistery = [0, 0, 0];

const rootFileSystem = [["root", [
  ["js", [["assignments", [["functions", []], ["recursion", []]]]]],
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

const ls = function () {};

const functions = [cd, ls];
const functionsRegistery = ["cd", "ls"];

const userInput = function (userName, path) {
  const leading = userName + "@" + path + ">";
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
