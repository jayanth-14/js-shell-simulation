const address = "vanamalajayanth@Vanamalas-MacBook-Pro";
const directories = ['javaScript', 'shell', 'gitHub'];
const files = [['hi.js', 'hello.js', 'goodMorning.js'],
['shellPractice', 'shellSetUp', 'shellManual'], ['files', 'repsoitires']
];

let directory = [];

const getLastDirIndex = function () {
  return directories.indexOf(directory[directory.length - 1]);
};

const changePath = function (element) {
  if (directory.length === 0 && directories.includes(element)) {
    directory.push(element);
    return;
  }

  const dirIndex = getLastDirIndex();

  if (directory.length === 1 && files[dirIndex].includes(element)) {
    directory.push(element);
    return;
  }

  console.log(element, "no such file present");

};

const changeDir = function (args) {
  const array = args.split("/");

  for (const element of array) {
    element === ".." ? directory.pop() : changePath(element);
  }
};

const getList = function () {
  if (directory.length === 0) {
    return directories.join('\n');
  }
  if (directory.length === 1) {
    const dirIndex = getLastDirIndex();

    return files[dirIndex].join('\n');
  }

  return "no files present";
};

const removeElemet = function (details) {
  if (directory.length === 0) {
    const index = directories.indexOf(details);
    directories.splice(index, 1);
    return;
  }

  if (directory.length === 1) {
    const dirIndex = getLastDirIndex();
    const eleIndex = files[dirIndex].indexOf(details);

    files[dirIndex].splice(eleIndex, 1);
    return;
  }

  return "no such file or directory present";
};

const getNextDir = function (commandArray) {
  const command = commandArray[0];
  const details = commandArray[1];

  switch (command) {
    case 'cd':
      changeDir(details);
      return;
    case "pwd":
      console.log(directory.join("/"));
      return;
    case "ls":
      console.log(getList());
      return;
    case 'echo':
      console.log(details);
      return;
    case 'rm':
      removeElemet(details);
      return;
    default:
      console.log('command not present');
      return;
  }
};

while (true) {
  const command = prompt(address + "-" + directory.join("/") + " %");
  getNextDir(command.split(" "));
}