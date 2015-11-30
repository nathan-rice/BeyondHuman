/**
 * Created by nathan on 11/23/15.
 */

angular.module("BeyondHuman").directive("linePlot", function () {
    function link(scope, element, attrs) {
        var div = document.createElement("div"), chart, chartOptions;

        chartOptions = {
            title: "test",
            chartArea: {width: "65%", height: "85%"}
        };

        element[0].appendChild(div);
        chart = new google.visualization.LineChart(div);
        chart.draw(google.visualization.arrayToDataTable(scope.data()), chartOptions);
    }

    return {
        restrict: 'E',
        link: link,
        scope: {
            data: "&plotData"
        }
    };

});