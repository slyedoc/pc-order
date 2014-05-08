'use strict';

app.controller('AdminModelEditCtrl', function ($scope, Restangular, $state, model) {

    $scope.model = model;
    $scope.restangularizeModel = function() {
        $scope.model.Groups =  Restangular.restangularizeCollection( $scope.model, $scope.model.Groups, 'groups');
        _.forEach( $scope.model.Groups, function (group) {
            group.Items =  Restangular.restangularizeCollection( group, group.Items, 'items');
        });
    };
    $scope.restangularizeModel();

    $scope.edit = {
        focusGroupIndex: -1,
        deleteModel: function () {
            $scope.model.remove().then(function () {
                $state.go("^.list");
            });
        },
        addGroup: function () {
            var group = { Name: '(empty)', Sort: $scope.model.Groups.length };
            $scope.model.Groups.post(group).then(function (newGroup) {
                $scope.model.Groups.push( newGroup );
                $scope.edit.focusGroupIndex = $scope.model.Groups.length - 1;
            });
        },
        deleteGroup: function (group) {
            group.remove().then(function () {

                //update Sort on all items greater than the group to be deleted
                _.forEach($scope.model.Groups, function (g) {
                    if (g.Sort > group.Sort) {
                        g.Sort--;
                        g.put();
                    }
                });

//              don't use _.without, it strips restangular properties
//              $scope.model.Groups = _.without($scope.model.Groups, group);
                var index = $scope.model.Groups.indexOf(group);
                if (index > -1) $scope.model.Groups.splice(index, 1);
            });
        },
        groupMove: {
            down: function (group) {
                //swap location with group
                var obj = _.where($scope.model.Groups, { 'Sort': group.Sort + 1 })[0];
                obj.Sort--;
                group.Sort++;

                //save changes
                obj.put();
                group.put();
            },
            up: function (group) {
                var obj = _.where($scope.model.Groups, { 'Sort': group.Sort - 1 })[0];
                obj.Sort++;
                group.Sort--;

                obj.put();
                group.put();
            }
        },
        deleteItem: function (group, item) {
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
        },
        addItem: function (group) {
            var item = { Name: '(empty)', Sort: group.Items.length };
            console.log(group.Items);
            group.Items.post(item).then(function (newItem) {
                //add our new item after we restangularize it
                var obj = Restangular.restangularizeElement(group, newItem, 'items')
                group.Items.push(obj);
            });
        }
    };
});
