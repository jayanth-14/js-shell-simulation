export const bold = (text) => "\x1B[1m" + text + "\x1B[0m";
export const red = (text) => "\x1B[31m" + text + "\x1B[0m";
export const green = (text) => "\x1B[32m" + text + "\x1B[0m";
export const yellow = (text) => "\x1B[33m" + text + "\x1B[0m";
export const blue = (text) => "\x1B[34m" + text + "\x1B[0m";
export const cyan = (text) => "\x1B[36m" + text + "\x1B[0m";
export const custom = (text, code) =>
  "\x1B[38;5;" + code + "m" + text + "\x1B[0m";
export const customBg = (text, code) =>
  "\x1B[48;5;" + code + "m" + text + "\x1B[0m";
export const clear = () => console.clear();
export const displayError = (message) => red(message);
export const jshError = (cmd, msg) => red(`jsh : ${cmd} : ${msg}`);
