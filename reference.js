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
};

const contents = directory => directory[1];
const directoryName = directory => directory[0];
const indexOf = (name, directory) => {
  const allFiles = contents(directory);
  for (let index = 0; index < allFiles.length; index++) {
    const file = allFiles[index];
    if (name === directoryName(file)) {
      return index;
    }
  }
  return -1;
}

const pwd = (directory = currentDirectory) => {
  const parentReferenceIndex = indexOf("..", directory);
  if (parentReferenceIndex === -1) {
    return "root";
  }
  return pwd(contents(directory)[parentReferenceIndex][1]) + "/" + directory[0];
}

const isReferenceType = folderName => folderName === "." || folderName === "..";

const cd = (destination) => {
  const folderIndex = indexOf(destination,currentDirectory);
    if (isReferenceType(destination)) {
      currentDirectory = currentDirectory[1][folderIndex][1];
      return;
    }
    currentDirectory = currentDirectory[1][folderIndex];
}
let shouldRun = true;
const start = () => {
  addInitialDirectories();
  while (shouldRun) {
    cd("js");
    console.log(pwd());
    cd("..");
    console.log(pwd());
    shouldRun = false;
  }
}

start();