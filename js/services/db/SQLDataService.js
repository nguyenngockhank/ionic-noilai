db_services.factory('SQLDataService', function () {
    var SQLDataService = {};
    /*
     *  CREATE TABLE
     */

    SQLDataService.create_word_table = function () {
        var sql = 'CREATE TABLE IF NOT EXISTS words ('
                + 'id INTEGER PRIMARY KEY,'
                + 'word NVARCHAR(100),'
                + 'content TEXT,'
                + '`group` NVARCHAR(10),'
                + 'created_time CHARACTER(19),'
                + 'meta TEXT NULL)';
        return sql;
    }

    SQLDataService.create_cat_table = function () {
        var sql = 'CREATE TABLE IF NOT EXISTS categories ('
                + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
                + 'code VARCHAR(20) UNIQUE,'
                + 'title NVARCHAR(100),'
                + 'meta TEXT NULL)';
        return sql;
    }

    SQLDataService.create_cat_word_table = function () {
        var sql = 'CREATE TABLE IF NOT EXISTS cat_words ('
                + 'word_id INTEGER,'
                + 'cat_code VARCHAR(20),'
                + 'PRIMARY KEY (word_id, cat_code))';
        return sql;
    }
    /*
     *  CATEGORY QUERY
     */

    SQLDataService.insert_category = function () {
        var query = "INSERT INTO categories(code, title, meta) VALUES(? , ? , ?)";
        return query;
    }

    SQLDataService.get_all_categories = function () {
        var query = "SELECT * FROM categories";
        return query;
    }



    /*
     *  WORD QUERY
     */
    SQLDataService.insert_word = function () {
        var query = "INSERT INTO words(id, word, content, created_time , `group`) VALUES(? , ? , ?, ?, ?)";
        return query;
    }

    SQLDataService.update_word = function(id) {
        var query = "UPDATE words SET word = ?, content = ?, `group` = ?  WHERE id =  " + id;
        return query;
    }


    SQLDataService.get_all_words = function () {
        var query = "SELECT * FROM words";
        return query;
    }

   

    SQLDataService.insert_word_cat = function () {
        var query = "INSERT INTO cat_words(word_id, cat_code) VALUES(? , ?)";
        return query;
    }

    SQLDataService.get_word_id_in_cat = function () {
        var query = "SELECT word_id FROM cat_words WHERE cat_code = ?";
        return query;
    }

    SQLDataService.get_word_id_in_list = function (list_id) {
        var query = "SELECT word_id FROM cat_words WHERE id IN (" + list_id.join(',') + ")";
        return query;
    }

    SQLDataService.get_words_in_cat = function () {
        var query = 'SELECT * FROM words WHERE id IN ( SELECT word_id FROM cat_words WHERE cat_code = ?) ORDER BY `group` ASC';
        return query;
    }

    SQLDataService.get_words_not_in_cat = function (list_cat) {
        var query = 'SELECT * FROM words WHERE id NOT IN ( SELECT word_id FROM cat_words WHERE cat_code IN ("' + list_cat.join('","') + '")) ORDER BY `group` ASC';
        return query;
    }

    return SQLDataService;
})