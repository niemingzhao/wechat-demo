module.exports.data = {}
module.exports.methods = {}
module.exports.uuid = function () {
  var date = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    var res = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (char === 'x' ? res : (res & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}