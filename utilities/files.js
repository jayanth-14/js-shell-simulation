import { append, debg, touch } from "../jsh.js";
export const rootFileSystem = { name: "root", contents: {} };
export const currentDirectory = [rootFileSystem];

export const directorySkeleton = (name) => {
  return { name, contents: {} };
};

const createSelfReference = (dir) => dir["."] = dir;

export const createDirectory = (name, parent) =>
  parent.contents[name] = directorySkeleton(name);

export const addToContents = (child, parent) =>
  parent.contents[child.name] = child;

export const addInitialDirectories = () => {
  createSelfReference(currentDirectory[0]);
  addToContents(
    currentDirectory[0],
    createDirectory("js", currentDirectory[0]),
  );
  addToContents(
    currentDirectory[0].contents,
    createDirectory("assignments", currentDirectory[0].contents.js),
  );
  addToContents(
    currentDirectory[0].contents,
    createDirectory("Downloads", currentDirectory[0]),
  );
  addToContents(
    currentDirectory[0].contents,
    createDirectory("Desktop", currentDirectory[0]),
  );
  addToContents(
    currentDirectory[0].contents,
    createDirectory("Pictures", currentDirectory[0]),
  );
};
