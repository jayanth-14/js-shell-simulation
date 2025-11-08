//==============================Display Utilities==============================
// colors
const bold = (text) => "\x1B[1m" + text + "\x1B[0m";
const red = (text) => "\x1B[31m" + text + "\x1B[0m";
const green = (text) => "\x1B[32m" + text + "\x1B[0m";
const yellow = (text) => "\x1B[33m" + text + "\x1B[0m";
const blue = (text) => "\x1B[34m" + text + "\x1B[0m";
const cyan = (text) => "\x1B[36m" + text + "\x1B[0m";
const custom = (text, code) => "\x1B[38;5;" + code + "m" + text + "\x1B[0m";
const customBg = (text, code) => "\x1B[48;5;" + code + "m" + text + "\x1B[0m";
const clear = () => console.clear();
const displayError = (message) => red(message);
//==============================Display Utilities==============================
//==============================File System==============================
const rootFileSystem = ["root/", []];
let currentDirectory = rootFileSystem;

const directorySkeleton = name => {
  const folder = [name, []];
  return folder;
}
const referenceSkeleton = (name, reference) => [name, reference];
const createSelfReference = directory => directory[1].push(referenceSkeleton(".", directory));
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
  addToContents(currentDirectory[1][1], createDirectory("assignments", currentDirectory[1][1]));
  addToContents(currentDirectory, createDirectory("Downloads", currentDirectory));
  addToContents(currentDirectory, createDirectory("Desktop", currentDirectory));
  addToContents(currentDirectory, createDirectory("Pictures", currentDirectory));
  touch(["index.js"]);
  append("hello world", "index.js");
};

const contents = directory => directory[1];

const directoryName = directory => directory[0];

const isFolder = (name, file) => name === directoryName(file);

const indexOf = (name, directory) => {
  const allFiles = contents(directory);
  for (let index = 0; index < allFiles.length; index++) {
    const file = allFiles[index];
    if (isFolder(name, file)) {
      return index;
    }
  }
  return -1;
}

const includes = (folderName, parent) => indexOf(folderName, parent) !== -1;
const isAFolder = folder => includes(".", folder);
const isReferenceType = folderName => folderName === "." || folderName === "..";
//==============================File System==============================
//==============================Utilities For Commands=========================
const isNotAHiden = folder => !folder[0].startsWith(".");
const removeHiden = folders => folders.filter(isNotAHiden);
const addSymbols = folder => "./" + folder[0] + (isAFolder(folder) ? "/" : "");
const convertFolders = folders => folders.map(addSymbols);
const colorizeFolder = folder => folder.endsWith("/") ? blue(folder) : cyan(folder);
const colorizeFolders = folders => folders.map(colorizeFolder);
const generatePath = (directory = currentDirectory) => {
  const parentReferenceIndex = indexOf("..", directory);
  if (parentReferenceIndex === -1) {
    return "root";
  }
  return generatePath(contents(directory)[parentReferenceIndex][1]) + "/" + directory[0];
}
const getReference = (name, index, directory) => 
  isReferenceType(name) ? directory[1][index][1] : directory[1][index];

const getDirectory = (destination) => {
  const destinations = destination[0].split("/");
  let directory  = currentDirectory;
  for (const folderName of destinations) {
    const folderIndex = indexOf(folderName, directory);
    if (folderIndex === -1) {
      return [];
    }
    directory = getReference(folderName, folderIndex, directory);
  }
  return directory;
}
const validateDestination = destination => destination.length !== 0;
const getDestination = destination => validateDestination(destination) ? destination : ["."];
const exists = destination => getDirectory([destination]).length !== 0;
const makeDir = dir => {
  if (exists(dir)) {
    return console.log(displayError(dir + " already exists"));
  }
  const path = dir.split("/");
  const name = path[path.length - 1];
  const parentDestination = path.slice(0, -1);
  const parentDirectory = getDirectory(getDestination(parentDestination));
  addToContents(parentDirectory, createDirectory(name, parentDirectory));
}
const generatePwd = () => generatePath(currentDirectory);
const createFile = fileDesination => {
  const path = fileDesination.split("/");
  const name = path[path.length - 1];
  const parentDestination = path.slice(0, -1);
  const parentDirectory = getDirectory(getDestination(parentDestination));
  const file = directorySkeleton(name);
  addToContents(parentDirectory, file);
}
const append = (content, fileLocation) => {
  const file = getDirectory([fileLocation]);
  file[1].push(content);
}
const write = (content, fileLocation) => {
  const file = getDirectory([fileLocation]);
  file[1].splice(0);
  file[1].push(content);
}
const writeToFile = (content, fileLocation, isWriteMode) => {
  if (!exists(fileLocation)) {
    touch([fileLocation]);
  }
  if (isWriteMode) {
    write(content, fileLocation);
    return;
  }
  append(content, fileLocation);
}
const fileEditor = () => {
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
}
//==============================Utilities For Commands=========================
//==============================Commandds==============================
const pwd = () => yellow(generatePwd());
const cd = (destination) => {
  const directory = getDirectory(getDestination(destination));
  if (directory.length === 0) {
    return displayError("jsh - cd : Couldn't find the folder : " + destination);
  }
  if (!includes(".", directory)) {
    return displayError("jsh - cd : " + destination + " is not a directory.");
  }
  currentDirectory = directory;
}

const ls = function (destination) {
  const directory = getDirectory(getDestination(destination));
  if (!includes(".", directory)) {
    return displayError("jsh - cd : " + destination + " is not a directory.");
  }
  const directoryContents = contents(directory);
  const filtered = removeHiden(directoryContents);
  const folders = convertFolders(filtered);
  const colored = colorizeFolders(folders);
  return colored.join("\t");
};
const mkdir =  folders => {
  folders.forEach(makeDir);
}
const exit = function () {
  shouldRun = false;
  return;
};

const showFs = () => currentDirectory;

const echo = args => args.join(" ");
const touch = args => args.forEach(createFile);
const cat = args => {
  const fileDesination = args[0];
  if (fileDesination === undefined) {
    return fileEditor();
  }
  const file = getDirectory([fileDesination]);
  if (file.length === 0) {
    return displayError("jsh - cat : " + fileDesination + " is not available");
  }
  const contents = file[1];
  return contents.join("\n");
}
//==============================Commandds==============================
let shouldRun = true;
let fontColorCode = 214;
let backgroundColorCode = undefined;


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
  cd,
  ls,
  mkdir,
  clear,
  clear,
  pwd,
  echo,
  touch,
  cat,
  exit,
  showFs,
  changePromptColor,
];
const functionsRegistery = [
  "cd",
  "ls",
  "mkdir",
  "clear",
  "cls",
  "pwd",
  "echo",
  "touch",
  "cat",
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
  return;
};

const executeCommand = function (commandInfo) {
  const commandName = commandInfo[0];
  if (commandName === "") {
    return;
  }
  const command = getCommandReference(commandName);
  if (command === undefined) {
    return displayError("jsh: command not found: " + commandName);
  }
  return command(commandInfo.slice(1));
};

const redirectToFile = function (output, destination, isWriteMode) {
  writeToFile(output, destination, isWriteMode);
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

const redirectSymbol = commandString =>
  commandString.includes(">>") ? ">>" : ">";

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
  while (shouldRun) {
    const pwdValue = generatePwd();
    const commandString = userInput(pwdValue);
    const redirectionSymbol = redirectSymbol(commandString);
    const commandData = commandString.split(redirectionSymbol);
    const output = executeCommand(commandData[0].trim().split(" "));
    const isWriteMode = redirectionSymbol === ">";
    redirect(output, commandData[1], isWriteMode);
  }
  // console.log(ls().join("\t"));
};

start();
