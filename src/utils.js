function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function populate(obj, keyPath, value) {
    let lastKeyIndex = keyPath.length-1;
    for (var i = 0; i < lastKeyIndex; ++ i) {
      let key = keyPath[i];
      if (!(key in obj)){
        obj[key] = {}
      }
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

module.exports = { getRandomInt, populate }