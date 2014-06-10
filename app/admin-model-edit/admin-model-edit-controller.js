'use strict';

app.controller('AdminModelEditCtrl', function ($scope, Restangular, $state, model) {

    $scope.model = model;

    model.restangularize();
});
