'use strict';

/**
 * @ngDoc directive
 * @name groupEdit
 * @param {expression} group
 */

app.directive('groupEdit', function () {
    return {
        templateUrl: 'components/group-edit/group-edit.html',
        restrict: 'E',
        scope: {
            group: '=group'
        }
    };
});
