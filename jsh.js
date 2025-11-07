const findIndex = function (array, value, method) {
  for (let index = 0; index < array.length; index++) {
    if (method(array[index], value)) {
      return index;
    }
  }
  return -1;
};

// colors
const bold = (text) => "\x1B[1m" + text + "\x1B[0m";
const red = (text) => "\x1B[31m" + text + "\x1B[0m";
const green = (text) => "\x1B[32m" + text + "\x1B[0m";
const yellow = (text) => "\x1B[33m" + text + "\x1B[0m";
const blue = (text) => "\x1B[34m" + text + "\x1B[0m";
const cyan = (text) => "\x1B[36m" + text + "\x1B[0m";
const custom = (text, colorCode) =>
  "\x1B[38;5;" + colorCode + "m" + text + "\x1B[0m";
const customBg = (text, colorCode) =>
  "\x1B[48;5;" + colorCode + "m" + text + "\x1B[0m";
const clear = () => console.clear();
const displayError = (message) => red(message);

// shell logic starts here
// let pwdRegistry = [0, 1]; // the current location pointer
let shouldRun = true;
let fontColorCode = 214;
let backgroundColorCode = undefined;

let rootFileSystem = [["root/", []]];

let currentDirectory = rootFileSystem[0];

const directorySkeleton = name => {
  const folder = [name, []];
  return folder;
}
const referenceSkeleton = (name, reference) => [name, [reference]];
const createSelfReference = directory => directory.push(referenceSkeleton(".", directory));
const addToContents = (parentDirectory, childDirectory) => parentDirectory[1].push(childDirectory);
const createReferences = (directory, parent) => {
  const selfReference = referenceSkeleton(".", directory);
  const parentReference = referenceSkeleton("..", parent);
  addToContents(directory, selfReference);
  addToContents(directory, parentReference);
}
const addDirectory = (parentDirectory, childDirectory) => {
  const parentReference = referenceSkeleton("..", parentDirectory);
  addToContents(childDirectory, parentReference);
  addToContents(parentDirectory, childDirectory);
}
const createDirectory = (directoryName, parent) => {
  const directory = directorySkeleton(directoryName);
  createReferences(directory, parent);
  return directory;
}
const addInitialDirectories = () => {
  createSelfReference(currentDirectory);
  addToContents(currentDirectory, createDirectory("js", currentDirectory));
  addToContents(currentDirectory, createDirectory("Downloads", currentDirectory));
  addToContents(currentDirectory, createDirectory("Desktop", currentDirectory));
  addToContents(currentDirectory, createDirectory("Pictures", currentDirectory));
};
const contents = directory => directory[1];
const directoryIncludes = (fileSystem, directoryName) => {
  console.log(directoryName, fileSystem);
  return contents(fileSystem)?.some((d) => d[0] === directoryName)};
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

const generatePwd = (currentFileSystem = currentDirectory) =>{
  // let currentFileSystem = currentDirectory;
  // for (let index = 0; index < pwdRegistry.length; index++) {
  //   const currentFolderIndex = pwdRegistry[index];
  //   const directory = currentFileSystem[currentFolderIndex];
  //   folders.push(directory[0]);
  //   currentFileSystem = directory[1];
  // }
  return currentFileSystem[0] + "/" + directoryIncludes(currentFileSystem, "..") ? generatePwd(currentFileSystem[1]) : "";
};

const getCurrentFileSystem = function () {
  let currentFileSystem = rootFileSystem;
  for (let index = 0; index < pwdRegistry.length; index++) {
    const location = pwdRegistry[index];
    currentFileSystem = currentFileSystem[location][1];
  }
  return currentFileSystem;
};

const getFolderName = (folder) => folder[0];
const colorFolder = (folder) => blue("./" + folder);
const colorFile = (file) => cyan("./" + file);
const isFolder = (folderCandidate) => folderCandidate.endsWith("/");
const categoriseFolders = (folder) =>
  isFolder(folder) ? colorFolder(folder) : colorFile(folder);
const isHiddenFile = (fileName) => fileName.startsWith(".");
const isVisibleFile = (fileName) => !isHiddenFile(fileName);

const getFileSystemContents = () => {
  // const currentDirectory = getCurrentFileSystem();
  const folders = currentDirectory.map(getFolderName);
  const available = folders.filter(isVisibleFile);
  const contents = available.map(categoriseFolders);
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

// const isFolder = function (folderIndex) {
//   const currentDirectory = getCurrentFileSystem();
//   const folderName = currentDirectory[folderIndex];
//   return folderName[0].endsWith("/");
// };

const moveFileLocationBackward = function () {
  if (pwdRegistry.length === 1) {
    return displayError("Couldn't go backward from root");
  }
  pwdRegistry.pop();
  return;
};

// const cd = function (args) {
//   const folderName = args[0];
//   if (folderName === undefined) {
//     // pwdRegistry.splice(1);
//     currentDirectory = rootFileSystem[0];
//     return;
//   }
//   if (folderName === "..") {
//     currentDirectory = c
//     return moveFileLocationBackward();
//   }
//   if (folderName === ".") return;
//   const folderIndex = findFolderIndex(folderName);
//   if (folderIndex === -1) {
//     return displayError("jsh : cd: no such file or directory: " + folderName);
//   }
//   // if (!isFolder(folderIndex)) {
//   //   return displayError("jsh: cd: not a directory: " + folderName);
//   // }
//   pwdRegistry.push(folderIndex);
// };

const ls = function () {
  const contents = getFileSystemContents();
  // const files =
  return contents;
};

const create = function (folderName, isFolder) {
  const name = folderName + (isFolder ? "/" : "");
  return [name, []];
};

const mkdir = function (args) {
  const currentDirectory = getCurrentFileSystem();
  for (let index = 0; index < args.length; index++) {
    const folderName = args[index];
    currentDirectory.push(create(folderName, true));
  }
  return;
};

const rm = function (args) {
  for (let index = 0; index < args.length; index++) {
    const currentDirectory = getCurrentFileSystem();
    const element = args[index];
    const elementIndex = findFolderIndex(element);
    currentDirectory.splice(elementIndex, 1);
  }
  return;
};

const pwd = function () {
  return yellow(generatePwd());
};

const echo = function (args) {
  return args.join(" ");
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
        bold(":wq") + yellow(" to save and exit.")
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
  return;
};

const append = function (contents, fileIndex) {
  const currentDirectory = getCurrentFileSystem();
  currentDirectory[fileIndex][1].push(contents);
  return;
};

const writeToFile = function (contents, fileName, isAppendMode = false) {
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

  const fileIndex = findFolderIndex(fileName);
  const fileNotFound = fileIndex === -1;
  if (fileNotFound) {
    const contents = textEditor();
    return contents;
  }

  if (isFolder(fileIndex)) {
    const errorMessage = "jsh: cat: " + fileName + " : Is a directory";
    return displayError(errorMessage);
  }

  const contents = currentDirectory[fileIndex][1].join("\n");
  return contents;
};

const exit = function () {
  shouldRun = false;
  return;
};

const showFs = function () {
  const currentDirectory = getCurrentFileSystem();
  return currentDirectory;
};

const changePromptColor = function (args) {
  if (args[0] !== undefined) {
    fontColorCode = args[0] === "no-color" ? 7 : parseInt(args[0]);
  }
  if (args[1] !== undefined) {
    backgroundColorCode = args[1] === "no-color"
      ? undefined
      : parseInt(args[1]);
  }
  return;
};

const functions = [
  // cd,
  ls,
  clear,
  clear,
  mkdir,
  rm,
  pwd,
  echo,
  touch,
  cat,
  help,
  exit,
  showFs,
  changePromptColor,
];
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
  "exit",
  "showFs",
  "change",
];

const changeBackground = function (message) {
  return backgroundColorCode === undefined
    ? message
    : customBg(message, backgroundColorCode);
};

const userInput = function (path) {
  const message = bold(custom("~ \u{E0A0} " + path, fontColorCode));
  const customizedMessage = changeBackground(message);
  return prompt(customizedMessage).trim();
};

const getCommandReference = function (commandName) {
  for (let index = 0; index < functionsRegistery.length; index++) {
    if (functionsRegistery[index] === commandName) {
      return functions[index];
    }
  }
  return displayError("jsh: command not found: " + commandName);
};

const executeCommand = function (commandInfo) {
  const commandName = commandInfo[0];
  if (commandName === "") {
    return;
  }
  const command = getCommandReference(commandName);
  return command(commandInfo.slice(1));
};

const redirectToFile = function (output, destination, isWriteMode) {
  if (isWriteMode) {
    writeToFile(output, destination, false);
    return;
  }
  writeToFile(output, destination, true);
};

const redirect = function (output, destination, isWriteMode) {
  if (output === undefined) {
    return;
  }
  if (destination === undefined) {
    console.log(output);
    return;
  }
  redirectToFile(output, destination.trim(), isWriteMode);
};

const redirectSymbol = function (commandString) {
  return commandString.includes(">>") ? ">>" : ">";
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
  addInitialDirectories();
  clear();
  printBanner();
  // while (shouldRun) {
  //   const pwd = generatePwd();
  //   const commandString = userInput(pwd);
  //   const redirectionSymbol = redirectSymbol(commandString);
  //   const commandData = commandString.split(redirectionSymbol);
  //   const output = executeCommand(commandData[0].split(" "));
  //   const isWriteMode = redirectionSymbol === ">>";
  //   redirect(output, commandData[1], isWriteMode);
  // }
  console.log(generatePwd());
  currentDirectory = currentDirectory[1][0];
  console.log(generatePwd());
};

start();
