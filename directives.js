/**
 * Created by nathan on 11/23/15.
 */

angular.module("BeyondHuman").directive("linePlot", function () {
    function link(scope, element, attrs) {
        var canvas = document.createElement("canvas"), chart;

        element[0].appendChild(canvas);
        chart = new Chart(canvas.getContext('2d'));
        // for some reason scope.data is a function???
        chart.Line(scope.data());

        //scope.$watchCollection("data", function (scopeData) {
        //    if (scopeData) {
        //        chart.Line(scopeData);
        //    }
        //});


    }

    return {
        restrict: 'E',
        link: link,
        scope: {
            data: "&plotData"
        }
    };

});