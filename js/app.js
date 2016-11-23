// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', [
    'ionic',
    'app.controllers',
    'app.services',
    'LocalStorageModule',
    "restangular"
])

        .run(function ($rootScope, $ionicPlatform, $state) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });

//            $rootScope.$on("$stateChangeSuccess", function (e, toState, toParams, fromState, fromParams) {
//                console.info(2, toState, 3, toParams, 4, fromState, 5, fromParams)
//                if (fromState.name == '')
//                    return;
//
//                if (toState.name == 'app.browse' && toParams.cat_code == 'yeu-thich')
//                    if (fromState.name == 'app.browse' && fromState.cat_code == 'yeu-thich')
//                        return;
//
//                if (toState.name == 'app.browse' && toParams.cat_code == 'yeu-thich') {
//                    if (fromState.name != 'app.browse' || fromState.cat_code != 'yeu-thich')
//                        
//                        console.log('reload');
//                        $state.go($state.current, {}, {reload: true});
//                    if ( toParams.cat_code != 'yeu-thich')
//                        $state.go($state.current, {}, {reload: true});
//                }
//
//            });
        })

        .config(function ($stateProvider, $urlRouterProvider, RestangularProvider, localStorageServiceProvider) {
            var host = 'http://192.168.100.10/';
            RestangularProvider.setBaseUrl(host + "noilai/api/");

            localStorageServiceProvider.setStorageType('localStorage');

            $stateProvider
                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "templates/menu.html",
                        controller: 'AppCtrl'
                    })
                    .state('app.mainscreen', {
                        url: "/main",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/main_screen.html",
                                controller: 'MainScreenCtrl'
                            }
                        }
                    })
                    .state('app.browse', {
                        url: "/browse/:cat_code",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/browse.html",
                                controller: 'BrowseCtrl'
                            }
                        }
                    })
                    .state('app.liked', {
                        url: "/liked",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/liked.html",
                                controller: 'LikedCtrl'
                            }
                        }
                    })
                   
            // if none of the above states are matched, use this as the fallback

//            $routeProvider.when('/app/browse/yeu-thich', {})
            $urlRouterProvider.otherwise('/app/main');


        });
