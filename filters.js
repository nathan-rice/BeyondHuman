/**
 * Created by nathan on 11/23/15.
 */

angular.module("BeyondHuman").filter("bodyWeightPlotPreprocessor", function () {
    return function(input) {
        var i, data = [["Day", "Weight", "Lean Body Mass"]];
        if (!input) return null;
        for (i = 0; i < input.length; i++) {
            data.push([i+1, input[i].leanMass + input[i].fatMass, input[i].leanMass]);
        }
        return data;
    }
});

angular.module("BeyondHuman").filter("bodyFatPercentPlotPreprocessor", function () {
    return function(input) {
        var i, data = [["Day", "Body Fat %"]];
        if (!input) return null;
        for (i = 0; i < input.length; i++) {
            data.push([i+1, input[i].fatMass / (input[i].leanMass + input[i].fatMass)]);
        }
        return data;
    }
});

angular.module("BeyondHuman").filter("caloriesInOutPlotPreprocessor", function () {
    return function(input) {
        var i, data = [["Day", "Calorie Intake", "Energy Expenditure"]];
        if (!input) return null;
        for (i = 0; i < input.length; i++) {
            data.push([i+1, input[i].calorieIntake, input[i].energyExpenditure]);
        }
        return data;
    }
});