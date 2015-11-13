/**
 * Created by nathan on 11/13/15.
 */

var app = angular.module("BeyondHuman");

app.factory("CalculatorService", function () {
    var navyBodyFatEstimator, maximumLeanBodyMassEstimator;

    navyBodyFatEstimator = function (config) {
        if (config.gender == "female") {
            return 163.205 * Math.log10(config.abdomen + config.hips - config.neck) - 97.684 * Math.log10(config.height) - 78.387;
        } else {
            return 86.010 * Math.log10(config.abdomen - config.neck) - 70.041 * Math.log10(config.height) + 36.76;
        }
    };

    maximumLeanBodyMassEstimator = function (config) {
        return Math.pow(config.height, 1.5) * (Math.sqrt(config.wrist)/22.6670 + Math.sqrt(config.ankle/17.0104)) *
            (config.bodyfat/224 + 1);
    };

    return {
        navyBodyFatEstimator: navyBodyFatEstimator,
        maximumLeanBodyMassEstimator: maximumLeanBodyMassEstimator
    }
});