'use strict';

/**
 * @ngDoc directive
 * @name itemEdit
 * @param {expression} itemEdit
 */
app.directive('itemEdit', function () {
    return {
        templateUrl: 'components/item-edit/item-edit.html',
        restrict: 'E',
        scope: {
            item: '=item'
        }
    };
});