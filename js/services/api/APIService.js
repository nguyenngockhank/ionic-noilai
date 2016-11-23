angular.module('app.services.api', [
    'app.services.api.word'
]).factory('APIService', function (localStorageService, ConfigService, KEY_API_UPDATE) {
    var APIService = {};

    var date = ConfigService.getNowDBDate();
    
    APIService.getUpdateToday = function () {
        return  localStorageService.get(KEY_API_UPDATE);
    }

    APIService.doneUpdateToday = function () {
        var info = APIService.getUpdateToday();
        if (!info) {
            var info = {
                created_time: new Date()
            };
        }
        info.last_update = new Date();
        localStorageService.set(KEY_API_UPDATE, info);
    }

    APIService.isGetUpdateToday = function () {
        var info = APIService.getUpdateToday();
        if (!info) {
            return false;
        }
        var cur_date = new Date();
        var last_date = new Date(info.last_update);


        if (cur_date.getFullYear() > last_date.getFullYear()) {
            return false;
        }

        if (cur_date.getMonth() > last_date.getMonth()) {
            return false;
        }

        if (cur_date.getDate() > last_date.getDate()) {
            return false;
        }

        return true;
    }

    return APIService;
});