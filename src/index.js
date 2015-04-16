var util = require('util'),
    oriento = require("oriento");

var defaults = require("./defaults"),
    DISCONNECTED = -1,
    // CONNECTING = 0,
    CONNECTED = 1;


var initForSession = function(connect) {
    var Store = connect.Store || connect.session.Store;

    function OrientoStore(options, callback) {
        var self = this;
        try {
            /* "super" constructor */
            Store.call(this, defaults.ensureGenericStoreOptions(options));
            self._options = defaults.ensureOrientoStoreOptions(options);
        } catch(err) {
            if (callback) {
                return callback(err);
            } else {
                throw err;
            }
        }

        self._state = DISCONNECTED;
        self._ensureConnection(callback);
    }

    OrientoStore.prototype.get = function(sid, callback) {
    };

    OrientoStore.prototype.set = function(sid, session, callback) {
    };

    OrientoStore.prototype.touch = function(sid, session, callback) {
    };

    OrientoStore.prototype.destroy = function(sid, callback) {
    };

    OrientoStore.prototype.length = function(callback) {
    };

    OrientoStore.prototype.clear = function(callback) {
    };

    OrientoStore.prototype._ensureConnection = function(callback) {
        var self = this;
        if (!callback) {
            callback = defaults.returnOneCallback;
        }
        if (self._state == CONNECTED && self._db) {
            return callback(null, self._db);
        }
        var err, db;
        try {
            self._db = oriento(self._options.server).use(self._options.db);
            self._state = CONNECTED;
            self._scheduleDbPing();
        } catch(ex) {
            err = ex;
            self._state = DISCONNECTED;
        }
        return callback(err, self._db);
    };

    OrientoStore.prototype._scheduleDbPing = function() {
        var interval = this._options.pingInterval;
        /* init DB ping to now */
        this._db.ping = new Date();
        setInterval(pingDb, interval, this._db, interval);
    };

    util.inherits(OrientoStore, Store);
    return OrientoStore;
};


module.exports = initForSession;


/**
 * @deprecated Oriento drops the binary connection, so keep this one until the issue is resolved
 */
var pingDb = function(db, interval) {
    var now = new Date();
    // do not ping the same DB multiple times
    if (now - db.ping >= interval) {
        db.ping = now;
        db.query("SELECT FROM OUser").then(function() {
        }).catch(function(err) {
            console.error(err);
        });
    }
};
