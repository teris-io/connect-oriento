var oriento = require("oriento");

exports.ensureGenericStoreOptions = function(options) {
    return options || {};
};

exports.ensureOrientoStoreOptions = function(options) {
    var defaults = {
        pingInterval: 60000
    };

    var incoming = options || {},
        res = {};
    for (var key in defaults) {
        res[key] = incoming[key] || defaults[key];
    }

    if (incoming.server && incoming.db) {
        res.server = incoming.server;
        res.db = incoming.db;
    } else {
        throw new Error("'server' or 'db' configuration missing");
    }

    /* test connection */
    oriento(res.server).use(res.db);

    return res;
};

exports.returnOneCallback = function(err, data) {
    if (err) {
        throw err;
    }
    return data;
};
