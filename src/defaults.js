var oriento = require("oriento"),
    qs = require("qs");

exports.ensureGenericStoreOptions = function(options) {
    return options || {};
};

exports.ensureOrientoStoreOptions = function(options) {
    var defaults = {
        pingInterval: 60000,
        hash: false
    };

    var incoming = options || {},
        res = {};
    for (var key in defaults) {
        res[key] = incoming[key] || defaults[key];
    }

    /* the following mandatory fields do not have defaults */
    if (incoming.server) {
        res.server = typeof incoming.server == "string" ? qs.parse(incoming.server) : incoming.server;
    } else {
        throw new Error("'server' configuration missing");
    }

    if (res.hash && !(res.hash.algorithm && res.hash.salt)) {
        throw new Error("supply 'algorithm' and 'code' to enable SID hashing");
    }

    /* test connection */
    oriento(res.server).use(res.server.db);

    return res;
};

exports.returnOneCallback = function(err, data) {
    if (err) {
        throw err;
    }
    return data;
};
