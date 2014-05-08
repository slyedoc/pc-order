'use strict';

describe('Controller: AdminModelListCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var AdminModelListCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AdminModelListCtrl = $controller('AdminModelListCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
