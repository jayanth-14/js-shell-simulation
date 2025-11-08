# Basic shell simulation

# thoughts
files will be in string format
  Each directory should be in a format of array - ["directory-name", ["file1", "file2", ["sub-directory-name", ["subfile1"]]]];
  - where in array : first element be directory name
  - second element : all the files in array format

# Current bugs
- [x] Cat display raising an error if file is not available.

# future modifictions
- a custom command `showFs` to show the array format of the current directory for the user for better understanding of how my file system works.
- piping can be implemented.
- redirections can be implemented.
- variables can be implemented.
- arrange the files by name.
- change color and bg color for background
this is jayanth