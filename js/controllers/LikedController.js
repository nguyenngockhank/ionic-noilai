angular.module('app.controller.liked', [])

.controller('LikedCtrl', function ($scope, $state, $stateParams, AppDataService, DBWordService) {
    $scope.words = AppDataService.liked_list;
    $scope.words.forEach(function (word) {
        AppDataService.parse_word_content(word);
    })


});