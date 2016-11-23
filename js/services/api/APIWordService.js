angular.module('app.services.api.word', [
]).factory('APIWordService', function ($q, localStorageService, Restangular, APIService, ConfigService) {
    var wordApi = Restangular.all("word");

    var APIWordService = {};

    APIWordService.getNewWords = function () {
        var updateInfo = APIService.getUpdateToday();
        console.log(updateInfo)
        var offset = 0, last_update = null;
        var limit = ConfigService.api_limit_word();
        if (updateInfo) {
            last_update = ConfigService.getDBDatetime(updateInfo.last_update);
        }
        var result = {num_words: 0, data: []};

        var q = $q.defer();
        (function getWords() {
            APIWordService.getNewWord(offset, last_update)
                    .then(function (response) {
                        console.log('get new')
                        if (response.status == 'success') {
                            var len = response.data.length ? response.data.length : 0;
                            result.num_words += len;
                            result.data = result.data.concat(response.data);
                            if (len == limit) { // left
                                offset += limit;
                                getWords();
                            } else { // done
                                q.resolve(result);
                            }
                        }

                    }, function (err) {
                        q.reject({error: err, result: result});
                    })
        })()
        return $q = q.promise;
    }

    APIWordService.getNewWord = function (offset, last_update) {
        if (!last_update) {
            return wordApi.one("get_new/" + offset).get();
        }
        return wordApi.one("get_new/" + offset + '/' + last_update).get();
    }

    return APIWordService;
});