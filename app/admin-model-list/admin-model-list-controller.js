'use strict';

app.controller('AdminModelListCtrl', function ($scope, Restangular, $state, models) {
    $scope.models = models;

    $scope.add = function() {
        models.add( function(id) {
            $state.go('^.edit', {id: id} )
        });
    };
});
