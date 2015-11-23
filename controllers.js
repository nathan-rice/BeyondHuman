/**
 * Created by nathan on 11/14/15.
 */

angular.module("BeyondHuman").controller("MainController", function ($scope, DietModelingService) {

    $scope.config = {
        bodyWeight: 205,
        abdomen: 35,
        neck: 17,
        wrist: 8,
        ankle: 11,
        activityLevel: 1.2,
        height: 72,
        duration: 12
    };

    $scope.computeModel = function () {
        $scope.dietPlan = DietModelingService.modelDiet($scope.config);
    }
});