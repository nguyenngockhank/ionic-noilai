angular.module('app.services.db.word', [])
        .factory('DBWordService', function ($q, SQLDataService, DBService) {
            var DBWordService = {};

            DBWordService.insert = function (code, title, content, created_time, group) {
                var query = SQLDataService.insert_word();

                var values = null;
                if (code instanceof Array) { // array or object
                    values = code;
                } else {
                    values = [code, title, content, created_time, group];
                }
                return DBService.execUpdate(query, values);
            }

            DBWordService.get_word_group = function (title) {
                var fchar = title.charAt(0);
                fchar = fchar.toUpperCase();

                if (['A', 'Á', 'À', 'Ả', 'Ã', 'Ạ'].indexOf(fchar) != -1)
                    return 'A';

                if (['Â', 'Ấ'].indexOf(fchar) != -1)
                    return 'Â';

//                    'Â', 'Ă'
//                if (['D', 'Đ'].indexOf(fchar) != -1)
//                    return 'D';
//
                if (['E', 'È', 'É', 'Ẻ', 'Ẽ', 'Ẹ'].indexOf(fchar) != -1)
                    return 'E';
                if (['Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ'].indexOf(fchar) != -1)
                    return 'Ê';
//                    
                if (['I', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị'].indexOf(fchar) != -1)
                    return 'I';

                if (['O', 'Ó', 'Ò', 'Ọ', 'Ỏ', 'Õ'].indexOf(fchar) != -1)
                    return 'O';
                if (['Ô', 'Ổ', 'Ồ', 'Ố', 'Ộ', 'Ỗ'].indexOf(fchar) != -1)
                    return 'Ô';
                if (['Ơ', 'Ở', 'Ỡ', 'Ợ', 'Ớ', 'Ờ'].indexOf(fchar) != -1)
                    return 'Ơ';

                if (['Y', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ'].indexOf(fchar) != -1)
                    return 'Y';

                return fchar;
            }

            DBWordService.insert_batch_from_json = function (instances) {
                var q = $q.defer();
                var data = [];
                // INIT DATA
                angular.forEach(instances, function (instance) {
                    var row = [];
                    row.push(instance.id);
                    row.push(instance.title);
                    row.push(instance.content);
                    row.push(instance.created_time);
                    row.push(DBWordService.get_word_group(instance.title));
                    data.push(row);
                });
                // END DATA
                

                var query = SQLDataService.insert_word();
                var cat_word_query = SQLDataService.insert_word_cat();

                DBService.db.transaction(function (tx) {
                    (function insertOne() {
                        var record = data.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
                        var instance = instances.splice(0, 1)[0];
                        var cats = [];
                        if (instance.cats) {
                            var cats = instance.cats.split(',');
                        }
                        try {
                            console.info('INSERT WORD TABLE ', query);
                            tx.executeSql(query, record, function (tx, result) {

                                var wordId = result.insertId;
                                // INSERT TO CAT
                                if (cats.length > 0) {
                                    angular.forEach(cats, function (catCode) {
                                        console.info('INSERT CAT WORD TABLE ', cat_word_query);
                                        tx.executeSql(cat_word_query, [wordId, catCode]);
                                    });
                                }
                                // END INSERT TO CAT
                                if (data.length === 0) {
                                    q.resolve(result);
                                } else {
                                    insertOne();
                                }
                            }, function (transaction, error) {
                                if (error.code == 6) { // contrain 
                                    var update_query = SQLDataService.update_word(record[0]); // id
                                    console.info('UPDATE WORD TABLE ', update_query);
                                    tx.executeSql(update_query, [record[1], record[2], record[4]]);
                                    
                                    if (data.length === 0) {
                                        q.resolve(record[0]);
                                    } else {
                                        insertOne();
                                    }
                                } else {
                                    q.reject(error);
                                }
                            });
                        } catch (exception) {
                            q.reject(exception);
                        }
                    })();
                });
                return q.promise;
            }

            DBWordService.insert_cat_word = function (wordId, catCode) {
                var cat_word_query = SQLDataService.insert_word_cat();
                return DBService.execUpdate(cat_word_query, [wordId, catCode]);
            }

            DBWordService.insert_batch = function (instances) {
                var query = SQLDataService.insert_word();
                return DBService.execInsertBatch(query, instances);
            }

            DBWordService.get_all = function () {
                var query = SQLDataService.get_all_words();
                return DBService.execQuery(query, [])
            }

            DBWordService.get_word_id_in_list = function (list) {
                var query = SQLDataService.get_word_id_in_list();
                return DBService.execQuery(query, [list]);
            }


            DBWordService.get_word_id_in_cat = function (cat_code) {
                var query = SQLDataService.get_word_id_in_cat();
                return DBService.execQuery(query, [cat_code]);
            }

            DBWordService.get_words_in_cat = function (cat_code) {
                var sql = SQLDataService.get_words_in_cat();
                return DBService.execQuery(sql, [cat_code])
            }

            DBWordService.get_dictionary_words = function () {
                var sql = SQLDataService.get_words_not_in_cat(['troll-ban', 'thuc-an', 'dong-vat']);
                return DBService.execQuery(sql, [])
            }

            return DBWordService;
        });