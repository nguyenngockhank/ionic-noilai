var db_services = angular.module('app.services.db', [
    'app.services.db.word',
    'app.services.db.category',
])
db_services.factory('DBService', function (SQLDataService, localStorageService, $q) {
    var db = window.openDatabase("Db", "1.0", "Database", 500000);
    var DBService = {db: db};

    DBService.isHasDB = function () {
//                return false;
        return !!localStorageService.get('db.setup');
    }

    DBService.initDB = function () {
        var q = $q.defer();
        if (!DBService.isHasDB()) {
            DBService.execUpdate(SQLDataService.create_word_table(), []).then(function (result) {
//                        console.log('SETUP WORDS TABLE OK ', result)
                return DBService.execUpdate(SQLDataService.create_cat_table(), [])

            }).then(function (result) {
//                        console.log('SETUP CATEGORIES TABLE OK ', result)
                return  DBService.execUpdate(SQLDataService.create_cat_word_table(), [])
            }).then(function (result) {
//                        console.log('SETUP CAT WORD TABLE OK ', result)
//                localStorage['db.setup'] = '1';
                localStorageService.set('db.setup', true);
                q.resolve({created: true});
            }, function (err) {
                console.log(err);
                q.reject(err);
            })
        } else {
            q.resolve({created: false});
        }
        return  q.promise;
    };

    // SELECT
    DBService.execQuery = function (query, params) {
        var q = $q.defer();
        console.log('Execute Query :', query)
        db.transaction(function (tx) {
            tx.executeSql(query, params, function (tx, results) {
                var items = [];
                for (var i = 0; i < results.rows.length; ++i) {
                    items.push(results.rows.item(i));
                }
                q.resolve(items);
            }, function (trans, error) {
                q.reject(error);
            })
        })
        return  q.promise;
    }

    // DELTE , UPDATE, INSERT
    DBService.execUpdate = function (query, params) {
        var q = $q.defer();
        console.log('Execute Update :', query)
        db.transaction(function (tx) {
            tx.executeSql(query, params, function (tx, results) {
                q.resolve(results);
            }, function (trans, error) {
                q.reject(error);
            })
        })
        return  q.promise;
    }

    // INSERT BATCH
    DBService.execInsertBatch = function (query, instances) {
        var q = $q.defer();
        var coll = instances.slice(0); // clone collection
        console.log('Execute Insert Batch :', query , 'data' , instances)
        db.transaction(function (tx) {
            (function insertOne() {
                var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
                try {
                    tx.executeSql(query, record, function (tx, result) {
                        if (coll.length === 0) {
                            q.resolve(result);
                        } else {
                            insertOne();
                        }
                    }, function (transaction, error) {
                        q.reject(error);
                        return;
                    });
                } catch (exception) {
                    q.reject(exception);
                }
            })();
        });
        return  q.promise;
    }


    return DBService;
});
