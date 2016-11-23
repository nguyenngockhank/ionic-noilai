angular.module('app.services.config', [])
        .constant('API_LIMIT_WORD', 50)
        .constant('KEY_API_UPDATE', 'api.update')
        .factory('ConfigService', function (API_LIMIT_WORD) {
            var configService = {};
            configService.getDBDate = function (dateTime) {
                if (!dateTime)
                    return '';

                if (typeof dateTime === 'string')
                    dateTime = new Date(dateTime);

                var year = dateTime.getFullYear();
                var month = dateTime.getMonth() + 1;
                var date = dateTime.getDate();

                if (month < 10) {
                    month = "0" + month;
                }

                if (date < 10) {
                    date = "0" + date;
                }

                return year + "-" + month + "-" + date;
            }

            configService.getNowDBDate = function () {
                return configService.getDBDate(new Date());
            }

            configService.getDBDatetime = function (dateTime) {
                if (!dateTime)
                    return '';

                if (typeof dateTime === 'string')
                    dateTime = new Date(dateTime);

                var seconds = dateTime.getSeconds();
                seconds = (seconds < 10) ? "0" + seconds : seconds;

                var minutes = dateTime.getMinutes();
                minutes = (minutes < 10) ? "0" + minutes : minutes;

                var hours = dateTime.getHours();
                hours = (hours < 10) ? "0" + hours : hours;

                var prefix = configService.getDBDate(dateTime);

                return prefix + " " + hours + ":" + minutes + ":" + seconds;
            }




            configService.api_limit_word = function () {
                return API_LIMIT_WORD;
            }


            return configService;
        })