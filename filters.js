/**
 * Created by nathan on 11/23/15.
 */

angular.module("BeyondHuman").filter("bodyMassPlotPreprocessor", function () {
    return function(input) {
        var i, X = [], weight = {label: 'Weight'}, weightY = [], leanMass = {label: 'Lean Body Mass'}, leanMassY = [],
            fatMass = {label: 'Fat Mass'}, fatMassY = [];
        if (!input) return null;
        for (i = 0; i < input.length; i++) {
            X.push(i+1);
            weightY.push(input[i].leanMass + input[i].fatMass);
            leanMassY.push(input[i].leanMass);
            fatMassY.push(input[i].fatMass);
        }
        weight.data = weightY;
        leanMass.data = leanMassY;
        fatMass.data = fatMassY;
        return {labels: X, datasets: [weight, leanMass, fatMass]};
    }
});