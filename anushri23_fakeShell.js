let currentDir = "~";
const promptMsg = "anushriphadatare@Anushris-AnuBook-Pro ";
const location = ["~"];
const directory = [];
const file = [];

const echo = function (arg) {
  return arg.join("");
};

const cd = function (command, arg) {
  if (directory.includes(arg.join(""))) {
    location.length === 0 ? location.push("~") : location.push(arg.join(" "));
    currentDir = location.at(-1);
    return;
  }

  if (arg.join(" ") === "..") {
    location.pop();
    currentDir = location.length === 0 ? "/" : location.at(-1);
    return;
  }

  console.log("cd: no such file or directory: ", arg.join(""));
};

const mkdir = function (arg) {
  directory.push(arg.join(""));
};

const touch = function (arg) {
  file.push(arg.join(""));
};

const executeCommand = function (commandAndArgs) {
  const [command, ...arg] = commandAndArgs.split(" ");
  switch (command) {
    case "echo": return echo(arg);
    case "cd": return cd(command, arg);
    case "mkdir": return mkdir(arg);
    case "touch": return touch(arg);
    default: return "zsh: command not found :" + command;
  }

};

while (true) {
  const command = prompt(promptMsg + currentDir + " 👉 ");
  const output = executeCommand(command);
  if (output !== undefined) {
    console.log(output);
  }

}