
var util = require("odm-util"),
    DBClass = util.DBClass,
    clazz = util.clazz;
    
function Session(data) {
    DBClass.apply(this, arguments);
}

clazz.inherit(Session, DBClass);

module.exports = Session;