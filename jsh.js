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
const jshError = (cmd, msg) => red(`jsh : ${cmd} : ${msg}`);
const maxLength = (previousLength, element) => Math.max(previousLength, element.length);
const getMaxLengths = data => data.reduce((max, row) => row.map((element, i) => maxLength(max[i], element)), [0,0,0,0]);
const padColumn = (data, padLength) => data.padEnd(padLength);
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
const removeFromContents = (parentDirectory, childDirectoryIndex) => parentDirectory[1].splice(childDirectoryIndex, 1);
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

const folderFound = (name, file) => name === directoryName(file);

const indexOf = (name, directory) => {
  const allFiles = contents(directory);
  for (let index = 0; index < allFiles.length; index++) {
    const file = allFiles[index];
    if (folderFound(name, file)) {
      return index;
    }
  }
  return -1;
}


const includes = (folderName, parent) => indexOf(folderName, parent) !== -1;
const isAFolder = folder => includes(".", folder);
const isReferenceType = folderName => folderName === "." || folderName === "..";
const add = (x, y) => x + y;
//==============================File System==============================
//==============================Utilities For Commands=========================
const isNotAHidden = folder => !folder[0].startsWith(".");
const removeHidden = folders => folders.filter(isNotAHidden);
const format = folder => isAFolder(folder) ? "/" : "";
const addSymbols = folder => "./" + folder[0] + format(folder);
const convertFolders = folders => folders.map(addSymbols);
const colorizeFolder = folder => isAFolder(folder) ? blue("./" + folder[0] + "/" ): cyan("./" + folder[0]);
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
  const path = ("./" + dir).split("/");
  const name = path[path.length - 1];
  const parentDestination = [(path.slice(0, -1)).join("/")];
  const parentDirectory = getDirectory(getDestination(parentDestination));
  addToContents(parentDirectory, createDirectory(name, parentDirectory));
}
const removeDir = dir => {
  if (!exists(dir)) {
    return console.log(jshError("rmdir", dir + " doesn't exists"));
  }
  if (!isAFolder(getDirectory([dir]))) {
    return console.log(jshError("rmdir", dir + " is not a folder"));
  }
  const path = ("./" + dir).split("/");
  const name = path[path.length - 1];
  const parentDestination = path.slice(0, -1);
  const parentDirectory = getDirectory(parentDestination);
  removeFromContents(parentDirectory, indexOf(name, parentDirectory));
}
const generatePwd = () => generatePath(currentDirectory);
const createFile = fileDestination => {
  const path = fileDestination.split("/");
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
const DOCS = [
  ["cd", "1", "Change current directory.", "cd <folderName>"],
  ["ls", "0 | 1", "List contents of a directory.", "ls [folderName]"],
  ["pwd", "0", "Display the current working directory path.", "pwd"],
  ["mkdir", "1+", "Create one or more new directories.", "mkdir <folder1> [folder2] ..."],
  ["rmdir", "1+", "Remove one or more directories.", "rmdir <folder1> [folder2] ..."],
  ["touch", "1+", "Create one or more empty files.", "touch <file1> [file2] ..."],
  ["cat", "1 | 2", "View, write, or append file contents.", "cat <file> | cat > <file> | cat >> <file>"],
  ["echo", "1+", "Print text or variables to the terminal.", "echo <text> [text] ..."],
  ["clear", "0", "Clear the terminal display.", "clear"],
  ["cls", "0", "Clear the terminal display (alias of clear).", "cls"],
  ["help", "0", "Show all available commands.", "help"],
  ["exit", "0", "Exit the JSH shell session.", "exit"],
];
const removeHyphen = string => string.split().splice(string.indexOf("-"), 1);
const separateFlags = commandData => commandData.reduce((filtered, currentData) => {
  if (currentData.includes("-")) {
    filtered[0].push(removeHyphen(currentData));
    return filtered;
  }
  filtered[1].push(currentData);
  return filtered;
}, [[],[]]);

// Better readability but, more complexity - iterates over the array twice
// const separateFlags = commandData => {
//   const flags = commandData.filter(a => a.startsWith("-"));
//   const values = commandData.filter(a => !a.startsWith("-"));
//   return [flags, values];
// }
const increment = count => add(count, 1);
const sizeOfFile = file => file[1].reduce((count, line) => count + line.length, 0);
const sizeOfDirectory = directory => directory[1].reduce(increment, 0);
//==============================Utilities For Commands=========================
//==============================Sub Commands==============================
const listInLongFormat = data => {
  const result = [];

  for (const item of data) {
    const type = isAFolder(item) ? blue("directory") : cyan("file")
    const owner = "root";
    const size = isAFolder(item)
      ? sizeOfDirectory(item) + " items"
      : item[1].join("").length + " chars";
    result.push(`${padColumn(type, 20)} ${padColumn(owner, 6)} ${padColumn(size, 10)} ${colorizeFolder(item)}`);
  }

  return result.join("\n");
}
//==============================Sub Commands==============================
//==============================Commands==============================
const pwd = () => yellow(generatePwd());
const cd = (destination) => {
  const directory = getDirectory(getDestination(destination));
  if (directory.length === 0) {
    return jshError("cd", "Couldn't find the folder : " + destination);
  }
  if (!includes(".", directory)) {
    return jshError("cd", destination + " is not a directory.");
  }
  currentDirectory = directory;
}

const implementFlags = (data, flags) => {
  let directoryContents = data.slice()
  if (!flags.includes("a")) {
    directoryContents = removeHidden(directoryContents);
  }
  if (flags.includes("r")) {
    directoryContents = directoryContents.reverse();
  }
  return directoryContents;
}
const ls = function (commandData) {
  const filteredData = separateFlags(commandData);
  const destination = filteredData[1];
  const flags = filteredData[0].join("");
  const directory = getDirectory(getDestination(destination));
  if (!includes(".", directory)) {
    return jshError("cd", destination + " is not a directory.");
  }
  let directoryContents = contents(directory);
  directoryContents = implementFlags(directoryContents, flags);
  if (flags.includes("l")) {
    return listInLongFormat(directoryContents);
  }
  directoryContents = colorizeFolders(directoryContents);
  return directoryContents.join("\t");
};
const mkdir =  folders => folders.forEach(makeDir);
const rmdir = folders => folders.forEach(removeDir);
const exit = function () {
  shouldRun = false;
  return;
};

const showFs = () => currentDirectory;

const echo = args => args.join(" ");
const touch = args => args.forEach(createFile);
const cat = args => {
  const fileDestination = args[0];
  if (fileDestination === undefined) {
    return fileEditor();
  }
  const file = getDirectory([fileDestination]);
  if (file.length === 0) {
    return jshError("cat", fileDestination + " is not available");
  }
  const contents = file[1];
  return contents.join("\n");
}
const HEADERS = ["COMMAND", "ARGS", "DESCRIPTION", "USAGE"];

const ARGS_NOTATION = `
  0   → No arguments
  1   → Single argument
  1+  → One or more arguments
  0|1 → Optional argument
  1|2 → One or two arguments`

const help = () => {
  const lengths = getMaxLengths(DOCS);
  const headerColumns = HEADERS.map((header, index) =>
    bold(custom(padColumn(header, lengths[index]), 214))
  );
  const columns = DOCS.map(data =>
    data
      .map((col, i) => (i === 0 ? cyan(padColumn(col, lengths[i] + 3)) : padColumn(col, lengths[i])))
      .join(" ")
  );

  const table = headerColumns.join(" ") + "\n" + columns.join("\n");

  const notations = `${yellow("Arguments Notation:")} ${ARGS_NOTATION}`;

  return `${table}\n\n${notations}`;
};

//==============================Commands==============================
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

const commandRegistry = [
  ["cd", cd],
  ["ls", ls],
  ["mkdir", mkdir],
  ["rmdir", rmdir],
  ["clear", clear],
  ["cls", clear],
  ["pwd", pwd],
  ["echo", echo],
  ["touch", touch],
  ["cat", cat],
  ["exit", exit],
  ["showFs", showFs],
  ["change", changePromptColor],
  ["help", help]
]

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
  for (let index = 0; index < commandRegistry.length; index++) {
    if (commandRegistry[index][0] === commandName) {
      return commandRegistry[index][1];
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
    return jshError("command not found",  commandName);
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
