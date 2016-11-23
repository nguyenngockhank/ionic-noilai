app_controllers.controller('AppCtrl', function ($scope, $state,
        $ionicLoading, $ionicScrollDelegate, $ionicModal, $timeout,
        DBService, APIService, APIWordService, DBWordService, DBCategoryService, AppDataService) {
    /*
     * FIRST INIT DB 
     * SECOND GET WORD FROM SERVER
     * THIRT 
     */
    $ionicLoading.show({
        template: 'Loading...'
    });
    DBService.initDB().then(function (response) {
        console.log(response)
//                alert(JSON.stringify(response))
        if (response.created) { // thẹ first time open app
            DBCategoryService.init_data_db().then(function (rows) {
                console.log(rows)
            }, function (err) {
                console.error(err)
            })
        }
        if (!APIService.isGetUpdateToday()) {
            // GET NEW WORD FROM SERVER

            if (response.created) { // FIRST OPEN APP 
                $ionicLoading.show({
                    template: 'Tải dữ liệu từ server...'
                });
            } else {
                $ionicLoading.hide();
            }
            APIWordService.getNewWords().then(function (response) {
//                        alert('GET ALL WORD FROM SERVER')
                console.log('GET ALL WORD FROM SERVER', response);
                if (response.data.length > 0) {
                    DBWordService.insert_batch_from_json(response.data).then(function (res) {
                        APIService.doneUpdateToday();
                        $ionicLoading.hide();
                    }, function (err) {
                        alert('Lỗi 3 : ' + JSON.stringify(err))
                    })
                } else {
                    APIService.doneUpdateToday();
                    $ionicLoading.hide();
                }
            }, function (err) {
                console.error(err);
                alert('Lỗi 1 : ' + JSON.stringify(err))
                $ionicLoading.hide();
            })
        } else {
            $ionicLoading.hide();
        }
    }, function (err) {
        console.log(err)
        alert('Lỗi 2 : ' + JSON.stringify(err))
        $ionicLoading.hide();
    })
    // end init

    $scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop(true);
    };



    AppDataService.get_liked_list_id().then(function (list) {
        $scope.liked_list_id = list;
    }, function (error) {
        console.log(error)
    })


//     $scope.reload = function () {
//        console.log('emit event')
//        $scope.$broadcast('someEvent', {abc: 1232});
//    };
//    $scope.global = {};
//    $scope.liked_list = AppDataService.liked_list;
//    
//    $scope.$watch('liked_list', function() {
//        alert('new')
//    })

    /*
     * ABOUT AREA
     */

    $scope.about = {
        open: function () {
            $scope.aboutModal.show();
        },
        close: function () {
            $scope.aboutModal.hide();
        }
    };
    $ionicModal.fromTemplateUrl('templates/about.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.aboutModal = modal;
    });
    /*
     * END ABOUT AREA
     */
})