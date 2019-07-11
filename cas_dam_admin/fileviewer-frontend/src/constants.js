
/*
This file removes clutter from the rest of the app
and allows access to all of the constants in one place.
 */

const gRootFile = {
  name: "root",
  id: "root",
  is_folder: true,
  children: [],
}

const localRootFile = {
  name: "root",
  is_folder: true,
  children: [],
  filepath: '/',
}

export { gRootFile, localRootFile };
