angular.module('app.controller.browse', [])
        .controller('BrowseCtrl', function ($scope, $state, $stateParams, $ionicModal, DBWordService, AppDataService) {
            var cat_code = $stateParams.cat_code;

            var get_page_title = function () {
                switch (cat_code) {
                    case 'troll-ban':
                        return 'Troll bạn';
                    case 'dong-vat':
                        return 'Động vật quý hiếm';
                    case 'thuc-an':
                        return 'Sơn hào hải vị';
                    case 'all':
                    default:
                        return 'Tra từ điển';
                }
            }

            $scope.page_title = get_page_title();

            var LIKED_CAT = 'yeu-thich';

            $scope.like = function (item) {
                var word_id = item.id;
                if (!AppDataService.is_word_liked(word_id)) {
                    DBWordService.insert_cat_word(word_id, LIKED_CAT).then(function (res) {
                        AppDataService.like_word(item);
                        item.liked = true;
                    }, function (err) {
                        console.error(err)
                    })
                }
            }

            $scope.get_words = function (cat_code) {

                var promise = null;
                if (cat_code == 'all') {
                    promise = DBWordService.get_dictionary_words();
                } else {
                    promise = DBWordService.get_words_in_cat(cat_code);
                }

                promise.then(function (response) {
                    var list = response;
                    var last_group = null;


                    for (var i = 0; i < list.length; ++i) {
                        var word = list[i];
                        AppDataService.parse_word_content(word);

                        // INSERT GROUP TITLE
                        if (last_group === null || last_group != word.group) {
                            last_group = word.group;
                            list.splice(i, 0, {title: last_group});
                            ++i;
                        }
                        // end INSERT GROUP TITLE
                    }

                    $scope.words = list;
                    console.log(list)
                }, function (err) {
                    console.error(err);
                })
            }


            $scope.get_words(cat_code);

        })
