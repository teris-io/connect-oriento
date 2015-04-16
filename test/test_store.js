var storeLib = require("../src");

var session = require('express-session'),
    assert = require("assert"),
    async = require("async"),
    util = require("odm-util");

var Session = require("../src/session");


describe("Test OrientoStore", function() {

    if (!process.env.TEST_ORIENTDB) {
        it("needs TEST_ORIENTDB env var defined in order to test DBClass");
        
        return;
    }
    
    // Format: host=localhost&port=2424&username=root&password=root&db=test
    var OrientoStore = undefined,
        cleanupStore= undefined,
        options = {
            server: process.env.TEST_ORIENTDB
        };

    before(function(done) {
        OrientoStore = storeLib(session);
        cleanupStore = new OrientoStore(options, done);
    });

    after(function(done) {
        Session.drop(cleanupStore._db, done);
    });
    
    it("can set and get sessions unhashed", function(done) {
        var store = new OrientoStore(util.object.merge({}, options));
        var sid1 = "asfhq3nwbf", sid2 = "bfngq438owf";

        async.waterfall([
            function(done) {
                store.set(sid1, { val: 25 }, done);
            },
            function(session, done) {
                assert(25 == session.val);
                /* update with a new value */
                store.set(sid1, { val: 26 }, done);
            },
            function(session, done) {
                assert(26 == session.val);
                store.get(sid1, done);
            },
            function(session, done) {
                assert(26 == session.val);
                store.set(sid2, { val: 34 }, done);
            },
            function(session, done) {
                assert(34 == session.val);
                /* update with a new value */
                store.set(sid2, { val: 35 }, done);
            },
            function(session, done) {
                assert(35 == session.val);
                store.get(sid2, done);
            },
            function(session, done) {
                assert(35 == session.val);
                Session.find(store._db, "1=1 order by id", done);
            },
            function(items, done) {
                assert(2 == items.length);
                assert(sid1 == items[0].id);
                assert(new Date() >= items[0].touched);
                assert(sid2 == items[1].id);
                assert(new Date() >= items[1].touched);
                Session.delete(store._db, {}, done);
            }
        ], done);
    });

    it("can set and get sessions hashed", function(done) {
        var store = new OrientoStore(util.object.merge({ hash: { algorithm: "sha1", salt: "foo" } }, options));
        var sid1 = "asfhq3nwbf", sid2 = "bfngq438owf";
        var hSid1 = store._getHashedSid(sid1), hSid2 = store._getHashedSid(sid2);

        async.waterfall([
            function(done) {
                store.set(sid1, { val: 25 }, done);
            },
            function(session, done) {
                assert(25 == session.val);
                /* update with a new value */
                store.set(sid1, { val: 26 }, done);
            },
            function(session, done) {
                assert(26 == session.val);
                store.get(sid1, done);
            },
            function(session, done) {
                assert(26 == session.val);
                store.set(sid2, { val: 34 }, done);
            },
            function(session, done) {
                assert(34 == session.val);
                /* update with a new value */
                store.set(sid2, { val: 35 }, done);
            },
            function(session, done) {
                assert(35 == session.val);
                store.get(sid2, done);
            },
            function(session, done) {
                assert(35 == session.val);
                Session.find(store._db, "1=1 order by session.id", done);
            },
            function(items, done) {
                assert(2 == items.length);
                assert(hSid1 == items[0].id);
                assert(new Date() >= items[0].touched);
                assert(hSid2 == items[1].id);
                assert(new Date() >= items[1].touched);
                Session.delete(store._db, {}, done);
            }
        ], done);
    });

});
