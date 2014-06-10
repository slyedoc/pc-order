'use strict';

var app = angular.module('app', [ 'ui.router', 'ui.bootstrap', 'restangular', 'textAngular' ]);

app.constant("apiUrl", "http://localhost:39839/api/");

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, apiUrl) {
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
                model: function (Restangular, $stateParams) {
                    return Restangular.one('models', $stateParams.id).get();
                }
            }
        })
        .state('admin.model.list', {
            url: '/list',
            templateUrl: 'admin-model-list/admin-model-list.html',
            controller: 'AdminModelListCtrl',
            resolve: {
                models: function (Restangular, $stateParams) {
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

app.run(function ($rootScope, Restangular) {

    // extend model collection
    Restangular.extendCollection('models', function (collection) {
        //add new model, call redirect with new id
        collection.add = function (redirect) {

            var model = { Name: '(new model)' };
            collection.post(model).then(function(newModel){
                newModel.restangularize();
                collection.push( newModel );
                redirect(newModel.Id);
            });
        };

        collection.delete = function (model) {
            model.remove().then( function(){
                var index = collection.indexOf(model);
                if (index > -1) {
                    collection.splice(index, 1);
                }
            });
        };
        return collection;
    });

    // extend group collection
    Restangular.extendCollection('groups', function (collection) {
        //add new group
        collection.add = function () {
        };
        return collection;
    });

    //extend our model
    Restangular.extendModel('models', function (model) {
        model.groupUp = function (group) {
            //swap location with group
            var obj = _.where(model.Groups, { 'Sort': group.Sort - 1  })[0];
            obj.Sort++;
            group.Sort--;

            //save changes
            obj.put();
            group.put();
        };
        model.groupDown = function (group) {
            var obj = _.where(model.Groups, { 'Sort': group.Sort + 1 })[0];
            obj.Sort--;
            group.Sort++;

            obj.put();
            group.put();
        };
        model.groupDelete = function (group) {
            group.remove().then(function () {

                //update Sort on all items greater than the group to be deleted
                _.forEach(model.Groups, function (g) {
                    if (g.Sort > group.Sort) {
                        g.Sort--;
                        g.put();
                    }
                });

//              don't use _.without, it strips restangular properties
//              $scope.model.Groups = _.without($scope.model.Groups, group);
                var index = model.Groups.indexOf(group);
                if (index > -1) {
                    model.Groups.splice(index, 1);
                }
            });
        };

        model.groupAdd = function () {
            var group = { Name: '(empty)', Sort: model.Groups.length };
            model.Groups.post(group).then(function (newGroup) {
                //add our new item after we restangularize it
                var obj = Restangular.restangularizeElement(model, newGroup, 'groups');
                model.Groups.push(obj);
            });

        };
        model.restangularize = function() {
            //setup each child group as its own rest object
            model.Groups =  Restangular.restangularizeCollection( model, model.Groups, 'groups');

            _.forEach( model.Groups, function (group) {
                //setup each child item as its own rest object
                group.restangularize();
            });
        };

        return model;
    });

    //extend our group model
    Restangular.extendModel('groups', function (group) {
        group.itemDown = function (item) {
            var obj = _.where(group.Items, { 'Sort': item.Sort + 1 })[0];
            obj.Sort--;
            item.Sort++;

            obj.put();
            item.put();
        };
        group.itemUp = function (item) {
            var obj = _.where(group.Items, { 'Sort': item.Sort - 1 })[0];
            obj.Sort++;
            item.Sort--;

            obj.put();
            item.put();
        };
        group.itemDelete = function (item) {
            item.remove().then(function () {

                //dont use _.without, it strips restangular properties
                //group.Items = _.without(group.Items, item);
                var index = group.Items.indexOf(item);
                if (index > -1) group.Items.splice(index, 1);

                //reset sort to keep everything clean
                _.forEach(group.Items, function (i) {
                    if (i.Sort > item.Sort) {
                        i.Sort--;
                        i.put();
                    }
                });
            });
        };
        group.itemAdd = function () {
            var item = { Name: '(empty)', Sort: group.Items.length };
            group.Items.post(item).then(function (newItem) {
                //add our new item after we restangularize it
                var obj = Restangular.restangularizeElement(group, newItem, 'items');
                group.Items.push(obj);
            });
        };
        group.restangularize = function() {
           group.Items =  Restangular.restangularizeCollection( group, group.Items, 'items');
        };
        return group;
    });

});

app.filter('unsafe', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    }
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('customAutofocus', function () {
    return{
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.customAutofocus);
            }, function (newValue) {
                if (newValue == true) {
                    element[0].focus();//use focus function instead of autofocus attribute to avoid cross browser problem. And autofocus should only be used to mark an element to be focused when page loads.
                }
            });
        }
    };
});