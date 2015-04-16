var oriento = require("oriento"),
    qs = require("qs");

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

    /* the following mandatory fields do not have defaults */
    if (incoming.server) {
        res.server = incoming.server instanceof String ? qs.parse(incoming.server) : incoming.server;
    } else {
        throw new Error("'server' configuration missing");
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
