'use strict';

app.service('Auth', function Auth($rootScope, $http, apiUrl) {


    var url = apiUrl + "authentication";
    var auth = {
        user: '',
        getUser: function() {
             $http.get(url, {}).then(function(data) {
                 auth.user = data;
             });
        }
    };
    return auth;
});
