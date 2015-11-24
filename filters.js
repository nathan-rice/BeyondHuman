/**
 * Created by nathan on 11/23/15.
 */

angular.module("BeyondHuman").filter("bodyWeightPlotPreprocessor", function () {
    return function(input) {
        var i, X = [], weight = {label: 'Weight'}, weightY = [], leanMass = {label: 'Lean Body Mass'}, leanMassY = [];
        if (!input) return null;
        for (i = 0; i < input.length; i++) {
            X.push(i+1);
            weightY.push(input[i].leanMass + input[i].fatMass);
            leanMassY.push(input[i].leanMass);
        }
        weight.data = weightY;
        leanMass.data = leanMassY;
        return {labels: X, datasets: [weight, leanMass]};
    }
});

angular.module("BeyondHuman").filter("bodyFatPercentPlotPreprocessor", function () {
    return function(input) {
        var i, bodyFatPercent, X = [], bodyFatPercentData = [];
        if (!input) return null;
        for (i = 0; i < input.length; i++) {
            bodyFatPercent = input[i].fatMass / (input[i].leanMass + input[i].fatMass);
            X.push(i+1);
            bodyFatPercentData.push(bodyFatPercent);
        }
        return {labels: X, datasets: [{label: 'Body Fat Percent', data: bodyFatPercentData}]};
    }
});

angular.module("BeyondHuman").filter("caloriesInOutPlotPreprocessor", function () {
    return function(input) {
        var i, X = [], caloriesIn = {label: "Calorie Intake"}, caloriesInData = [],
            caloriesOut = {label: "Calorie Expenditure"}, caloriesOutData = [];
        if (!input) return null;
        for (i = 0; i < input.length; i++) {
            X.push(i+1);
            caloriesInData.push(input[i].dailyCalorieIntake);
            caloriesOutData.push(input[i].dailyEnergyExpenditure);
        }
        return {labels: X, datasets: [caloriesIn, caloriesOut]};
    }
});