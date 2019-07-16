/*
This file removes clutter from the rest of the app
and allows access to all of the constants in one place.
 */

const gRootFile = {
    name: "root",
    id: "root",
    is_folder: true,
    children: [],
};

const localRootFile = {
    name: "root",
    is_folder: true,
    children: [],
    filepath: '/',
};

function reverse_str(str){
  let list = str.split("");
  let reverseList = list.reverse();
  return reverseList.join("");
}

function abbreviate_path(path){

  if(path){
    let new_path = path.slice(1, path.length);
    let frontSection = '';
    let backSection = '';
    let pathLength = new_path.length;
    let char, i, j;

    for(i = 0; i < pathLength; i++){
      char = new_path.charAt(i);
      frontSection = frontSection.concat(char);

      if(char ==='/'){
        break
      }
    }

    for(j = pathLength; j > 0; j--){
      char = new_path.charAt(j);
      backSection = backSection.concat(char);

      if(char === '/'){
        break
      }

    }

    let reverseBack = reverse_str(backSection);
    if(reverseBack.charAt(0) !== '/'){
      return '/'+frontSection
    }
    const compoundPath = frontSection+reverseBack.slice(1, reverseBack.length)

    if(compoundPath === new_path) {
      return '/'+compoundPath
    }

    return '/'+frontSection + '...' + reverse_str(backSection)
  } else {
    return path
  }
}

export {gRootFile, localRootFile, abbreviate_path};
