'use strict';

app.controller('NavCtrl', function ($scope, Auth) {
    Auth.getUser();
    $scope.user = Auth.user;
});
