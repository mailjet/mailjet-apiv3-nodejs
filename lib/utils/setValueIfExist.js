function setValueIfExist(targetObject, path, value) {
    if(value) {
      targetObject[path] = value;
    }
  }

  module.exports = setValueIfExist;