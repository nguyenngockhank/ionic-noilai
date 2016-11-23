angular.module('app.services.db.category', [])
        .factory('DBCategoryService', function (SQLDataService, DBService) {
            var DBCategoryService = {};

            DBCategoryService.insert = function (code, title, meta) {
                var query = SQLDataService.insert_category();

                var values = null;
                if (code instanceof Array) { // array or object
                    values = code;
                } else {
                    if (!meta)
                        meta = '';
                    values = [code, title, meta];
                }
                return DBService.execUpdate(query, values);
            }

            DBCategoryService.insert_batch = function (instances) {
                var query = SQLDataService.insert_category();
                return DBService.execInsertBatch(query, instances);
            }

            DBCategoryService.get_all = function () {
                var query = SQLDataService.get_all_categories();
                return DBService.execQuery(query, [])
            }

            DBCategoryService.init_data_db = function () {
                return DBCategoryService.insert_batch([
                    ['yeu-thich', 'Yêu thích', ''],
                    ['dong-vat', 'Động vật quý hiếm', ''],
                    ['thuc-an', 'Sơn hào hải vị', ''],
                    ['troll-ban', 'Troll bạn bè', ''],
                ]);
            }



//            DBCategoryService.insert('thuc-an', 'Thức ăn').then(function (res) {
//                console.log(res)
//            }, function (err) {
//                console.log(err)
//            })
//
//            DBCategoryService.get_all().then(function (rows) {
//                console.log(rows)
//            }, function (err) {
//                console.log(err)
//            })

            return DBCategoryService;
        });