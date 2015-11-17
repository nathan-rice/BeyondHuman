/**
 * Created by nathan on 11/14/15.
 */

angular.module("BeyondHuman").controller("MainController", function ($scope, DietModelingService) {

    $scope.computeModel = function () {
        $scope.dietPlan = DietModelingService.modelDiet($scope.config);
    }
});