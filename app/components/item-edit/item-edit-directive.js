'use strict';

/**
 * @ngDoc directive
 * @name itemEdit
 * @param {expression} itemEdit
 * @param {expression} itemEditGroup
 * @param {expression} itemEditDelete
 */
app.directive('itemEdit', function () {
    return {

        templateUrl: 'components/item-edit/item-edit.html',
        restrict: 'A',
        scope: {
            item: '=itemEdit',
            group: '=itemEditGroup',
            delete: '=itemEditDelete' //function to pass for delete
        },
        link: function(scope, element) {

            scope.swapDown = function () {
                var obj = _.where(scope.group.Items, { 'Sort': scope.item.Sort + 1 })[0];
                obj.Sort--;
                scope.item.Sort++;

                obj.put();
                scope.item.put();
            };
            scope.swapUp = function () {
                var obj = _.where(scope.group.Items, { 'Sort': scope.item.Sort - 1 })[0];
                obj.Sort++;
                scope.item.Sort--;

                obj.put();
                scope.item.put();
            };
        }

    };
});
