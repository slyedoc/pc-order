'use strict';

describe('Controller: AdminModelCtrl', function () {

    // load the controller's module
    beforeEach(module('app'));

    var AdminModelCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AdminModelsCtrl = $controller('AdminModelCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
