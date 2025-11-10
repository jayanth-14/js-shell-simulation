const NOT_FOUND = "esh: command not found: ";
const promptMesssage = "akshaykumar@Akshays-MacBook-Pro shell ";
const current_directory = ["~"];
let runRepl = true;

const echo = function (args) {
  console.log(args.join(" "));
};

const cd = function (args) {
  if (args.length > 1) {
    return "Too many arguments";
  }

  if (args[0] === "..") {
    if (current_directory.length === 1) {
      return "There is no parent directory";
    }

    current_directory.pop();
    return;
  }

  current_directory.push(args);
};

const exit = function () {
  runRepl = false;
  prompt(`
  Saving session...
...copying shared history...
...saving history...truncating history files...
...completed.
`);

  return '[Process completed]';
};

function runCommand([command, ...args]) {
  switch (command) {
    case "echo":
      return echo(args);
    case "cd":
      return cd(args);
    case "exit":
      return exit();
    default:
      return NOT_FOUND + command;
  }
}


function eggshell() {
  while (runRepl) {
    const commandString = prompt(promptMesssage + current_directory.at(-1) + " %");
    const resultAfterRunning = runCommand(commandString.split(" "));

    if (resultAfterRunning !== undefined) {
      console.log(resultAfterRunning);
    }
  }
}
eggshell();

[].sort