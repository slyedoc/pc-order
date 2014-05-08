'use strict';

var app = angular.module('app', [ 'ui.router', 'ui.bootstrap', 'restangular', 'textAngular' ]);

app.constant("apiUrl", "http://localhost:39839/api/");

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, apiUrl ) {
    $locationProvider.html5Mode(false);

    // For any unmatched url, redirect to home state
    $urlRouterProvider.otherwise("/");

    // setup the states
    $stateProvider
        .state('admin', {
            url: '/admin',
            templateUrl: 'admin/admin.html',
            controller: 'AdminCtrl'
        })
        .state('admin.model', {
            url: '/model',
            templateUrl: 'admin-model/admin-model.html',
            controller: 'AdminModelCtrl'
        })
        .state('admin.model.edit', {
            url: '/{id:[0-9]*}',
            templateUrl: 'admin-model-edit/admin-model-edit.html',
            controller: 'AdminModelEditCtrl',
            resolve: {
                model: function(Restangular, $stateParams){
                    return Restangular.one('models', $stateParams.id).get();
                }
            }
        })
        .state('admin.model.list', {
            url: '/list',
            templateUrl: 'admin-model-list/admin-model-list.html',
            controller: 'AdminModelListCtrl',
            resolve: {
                models: function(Restangular, $stateParams){
                    return Restangular.all('models').getList();
                }
            }
        })
        .state('home', {
            url: "/",
            templateUrl: "/home/home.html",
            controller: 'HomeCtrl'
        });

    RestangularProvider.setBaseUrl(apiUrl);
    RestangularProvider.setRestangularFields({
        id: 'Id'
    });

});



app.run(function ($rootScope) {



});

app.filter('unsafe', function($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    }
});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('customAutofocus', function() {
    return{
        restrict: 'A',

        link: function(scope, element, attrs){
            scope.$watch(function(){
                return scope.$eval(attrs.customAutofocus);
            },function (newValue){
                if (newValue == true){
                    element[0].focus();//use focus function instead of autofocus attribute to avoid cross browser problem. And autofocus should only be used to mark an element to be focused when page loads.
                }
            });
        }
    };
})