angular.module('app.services.data', [])
        .factory('AppDataService', function (DBWordService, $q) {

            var AppDataService = {liked_list_id: [], liked_list: []};

            var LIKED_CAT = 'yeu-thich';

            AppDataService.get_liked_list_id = function () {
                var q = $q.defer();
                DBWordService.get_words_in_cat(LIKED_CAT).then(function (response) {
                    AppDataService.liked_list = response;
                    var list = [];
                    angular.forEach(response, function (item) {
                        list.push(item.id);
                    })
                    AppDataService.liked_list_id = list;
                    q.resolve(AppDataService.liked_list_id);
                }, function (err) {
                    console.log(err)
                    q.reject(err);
                });
                return q.promise;
            }

            AppDataService.like_word = function (word) {
                AppDataService.liked_list.push(word);
                AppDataService.liked_list_id.push(word.id);
            }

            AppDataService.is_word_liked = function (word) {
                if (typeof word == 'object')
                    return AppDataService.liked_list_id.indexOf(word.id) !== -1;
                // number
                return  AppDataService.liked_list_id.indexOf(word) !== -1;
            }

            AppDataService.parse_word_content = function (word) {
                // PARSE CONTENT WORD
                var spices = word.content.split("\n");
                word.content_html = '<ul>';
                angular.forEach(spices, function (con) {
                    word.content_html += '<li><i class="fa fa-caret-right"></i> ' + con + '</li>';
                })
                word.content_html += '</ul>';
                // end PARSE CONTENT WORD

                // end INSERT GROUP TITLE
                word.liked = AppDataService.is_word_liked(word);
            }

            return AppDataService;
        })