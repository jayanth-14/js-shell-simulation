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

// shell logic starts here
let pwdRegistry = [0, 0, 0]; // the current location pointer

const rootFileSystem = [["root/", [
  ["js/", [["assignments/", [["functions/", []], ["recursion/", []]]], [
    "hello.js",
    ["hello world, this is the data written in hello.js"],
  ]]],
  ["downloads/", []],
  ["documents/", []],
  ["pictures/", []],
]]];

const DOCS = [
  ["cd", "1", "Change directory", "cd <folderName>"],
  ["ls", "1", "List files and folders in current directory", "ls <folderName>"],
  ["pwd", "0", "Show current working directory", "pwd"],
  [
    "mkdir",
    "n",
    "Create new directory",
    "mkdir <folderName1>  <folderName2> ...",
  ],
  [
    "rm",
    "n",
    "Remove file or directory",
    "rm <folderName1>  <folderName2> ...",
  ],
  ["touch", "n", "Create new file", "touch <fileName1>  <fileName2> ..."],
  [
    "cat",
    "1 - 2",
    "Read or write content to file - > = write and >> = append",
    "cat <fileName> or cat > <fileName> or cat >> <fileName>",
  ],
  ["echo", "n", "Print text to screen", "echo <string1> <string2> ..."],
  ["clear / cls", "0", "Clear the terminal screen", "clear / cls"],
  ["help", "0", "Display this help page", "help"],
  ["exit", "0", "Exit the JSH shell", "exit"],
];

const help = function () {
  const table = `
--------------------------------------------------------------------------------------------------------
  Command     Args-Count     Description                                          Usage
--------------------------------------------------------------------------------------------------------
  cd          1       Change directory                                    cd <folderName>
  ls          1       List files and folders in current directory         ls <folderName>
  pwd         0       Show current working directory                      pwd
  mkdir       n       Create new directory                                mkdir <folderName1>  <folderName2> ...
  rm          n       Remove file or directory                            rm <folderName1>  <folderName2> ...
  touch       n       Create new file                                     touch <fileName1>  <fileName2> ...
  cat         1 - 2   Read or write content to file(>/>>  write/append)   cat <fileName> or cat > / >> <fileName>
  echo        n       Print text to screen                                echo <string1> <string2> ...
  clear/cls   0       Clear the terminal screen                           clear / cls
  help        0       Display this help page                              help
  exit        0       Exit the JSH shell                                  exit
`;
console.log(table);
};

const generatePwd = function () {
  const folders = [];
  let currentFileSystem = rootFileSystem;
  for (let index = 0; index < pwdRegistry.length; index++) {
    const currentFolderIndex = pwdRegistry[index];
    const currentDirectory = currentFileSystem[currentFolderIndex];
    folders.push(currentDirectory[0]);
    currentFileSystem = currentDirectory[1];
  }
  return folders.join("");
};

const getCurrentFileSystem = function () {
  let currentFileSystem = rootFileSystem;
  for (let index = 0; index < pwdRegistry.length; index++) {
    const location = pwdRegistry[index];
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
  return folderIndex !== -1 && folderName[0].endsWith("/");
};

const moveFileLocationBackward = function () {
  if (pwdRegistry.length === 1) {
    displayError("Couldn't go backward from root");
    return;
  }
  return pwdRegistry.pop();
};

const cd = function (args) {
  const folderName = args[0];
  if (folderName === "..") {
    return moveFileLocationBackward();
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
  pwdRegistry.push(folderIndex);
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
    yellow(
      `Enter your text below. Type ${
        bold(":wq") + yellow("to save and exit.")
      }`,
    ),
  );
  while (true) {
    const line = prompt("");
    if (line.endsWith(":wq")) {
      text.push(line.slice(0, line.length - 3));
      return text.join("\n");
    }
    text.push(line);
  }
};

const write = function (contents, fileIndex) {
  const currentDirectory = getCurrentFileSystem();
  currentDirectory[fileIndex][1].splice(0);
  currentDirectory[fileIndex][1][0] = contents;
};

const append = function (contents, fileIndex) {
  const currentDirectory = getCurrentFileSystem();
  currentDirectory[fileIndex][1].push(contents);
};

const writeToFile = function (fileName, isAppendMode = false) {
  const contents = textEditor();
  let fileIndex = findFolderIndex(fileName);
  if (fileIndex === -1) {
    touch([fileName]);
    fileIndex = findFolderIndex(fileName);
  }

  const mode = isAppendMode ? append : write;
  mode(contents, fileIndex);
  return;
};

const cat = function (args) {
  const currentDirectory = getCurrentFileSystem();
  let fileName = args[0];

  if (fileName.includes(">")) {
    return writeToFile(args[1], fileName === ">>");
  }

  const fileIndex = findFolderIndex(fileName);
  if (isFolder(fileIndex)) {
    const errorMessage = fileIndex === -1
      ? "jsh: cat: " + fileName + " : No such file or directory"
      : "jsh: cat: " + fileName + " : Is a directory";
    return displayError(errorMessage);
  }

  const contents = currentDirectory[fileIndex][1].join("\n");
  console.log(contents);
};

const exit = function() {
  return "exit";
}

const functions = [cd, ls, clear, clear, mkdir, rm, pwd, echo, touch, cat, help, exit];
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
  "help",
  "exit"
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
  return command(commandInfo.slice(1));
};

const printBanner = function () {
  console.log(green(bold(`
  ───────────────────────────────────────────
   ⚡ Welcome to JSH (Jayanth Shell)
  ───────────────────────────────────────────
  `)));
  console.log(cyan(`Version: 1.0.0 | Mode: Noob Mode 🥸`));
  console.log(yellow(`Type 'help' to view available commands.`));
  console.log(" ");
};

const start = function () {
  clear();
  printBanner();
  let shouldRun = true;
  while (shouldRun) {
    const pwd = generatePwd();
    const commandInfo = userInput(pwd);
    shouldRun = executeCommand(commandInfo) !== "exit";
  }
};

start();
