'use strict';

/**
 * @ngDoc directive
 * @name modelEdit
 * @param {expression} modelEdit
 */
app.directive('modelEdit', function () {
    return {
        templateUrl: 'components/model-edit/model-edit.html',
        restrict: 'E',
        scope: {
            model: '=model'
        },
        link: function(scope) {
        }
    };
});
