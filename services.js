/**
 * Created by nathan on 11/14/15.
 */

angular.module("BeyondHuman").factory("EstimatorService", function () {
    var navyBodyFatEstimator, maximumLeanBodyMassEstimator, basalMetabolicRateEstimator, monthlyMuscleGainEstimator,
        weeklyMuscleGainEstimator, dailyMuscleGainEstimator, trainingAgeEstimator, dailyMaximumDietaryDeficitEstimator,
        muscleGainCalorieRequirementEstimator, muscleGainForCaloriesEstimator, activityExpenditureEstimator,
        adaptiveThermogenesisEstimator, lowBodyFatMetabolicRateCorrectionEstimator;

    var a = 0.22775197106766698, b = -0.024346985716006797;

    navyBodyFatEstimator = function (height, abdomen, neck, hips) {
        if (hips) {
            return 163.205 * Math.log10(abdomen + hips - neck) - 97.684 * Math.log10(height) - 78.387;
        } else {
            return 86.010 * Math.log10(abdomen - neck) - 70.041 * Math.log10(height) + 36.76;
        }
    };

    maximumLeanBodyMassEstimator = function (height, wrist, ankle) {
        // uses the maximum lean body mass formula by Casey Butt
        var maxBodyWeight = Math.pow(height, 1.5) * (Math.sqrt(wrist)/22.6670 + Math.sqrt(ankle)/17.0104) * (10/224 + 1);
        return maxBodyWeight * 0.9;
    };

    activityExpenditureEstimator = function (leanMass, fatMass, activityLevel) {
        /* Note that rather than multiplying the BMR by the activity factor as is commonly practiced, because we are
           using the Katch-McArdle BMR forumula which does not take total body weight into account, we need to factor
           in the additional caloric cost of activity considering total body weight.

           The value used (22) is arbitrary, and has no research data to support it.  It was chosen because it is close
           to the lean mass coefficient in the Katch-McArdle BMR formula, operating under the assumption that the
           base caloric expenditure should not change significantly in response to physical activity.  I am open to
           modification of this value (or the entire formula) based on rigorous scientific data.
         */

        return (activityLevel - 1) * 22 * (leanMass + fatMass)
    };

    basalMetabolicRateEstimator = function (leanMass) {
        /* uses Katch-McArdle BRM estimator as our target user is not well modeled by BMR estimators that do not take
           LBM into account */
        return 370 + (21.6 * leanMass / 2.2)
    };

    adaptiveThermogenesisEstimator = function (oldCalorieIntake, newCalorieIntake, adaptiveThermogenesis) {
        /* Models the change in metabolic rate over a week period.
         *
         * This function uses the model for change in adaptive thermogenesis postulated in:
         *   Quantification of the effect of energy imbalance on bodyweight.
         *   http://www.ncbi.nlm.nih.gov/pubmed/21872751
         */
        var dailyCalorieIntakeChange = oldCalorieIntake - newCalorieIntake;
        return adaptiveThermogenesis + (0.14 * dailyCalorieIntakeChange - adaptiveThermogenesis) / 2;
    };

    lowBodyFatMetabolicRateCorrectionEstimator = function (bodyFatPercentage, metabolicRate) {
        /*   Rough guess figure based on anecdotal reports and eyeballing graphs in:
         *
         *   Adaptive reduction in basal metabolic rate in response to food deprivation in humans: a role for feedback
         *   signals from fat stores.
         *   http://www.ncbi.nlm.nih.gov/pubmed/9734736
         */
        return (100 + Math.min(bodyFatPercentage - 20, 0))/100 * metabolicRate;
    };

    monthlyMuscleGainEstimator = function (leanMass, maxLeanMass) {
        var trainingAge, endingLeanMass;
        trainingAge = trainingAgeEstimator(leanMass, maxLeanMass);
        endingLeanMass = maxLeanMass * a * Math.log(trainingAge + 1);
        return endingLeanMass - leanMass;
    };

    weeklyMuscleGainEstimator = function (leanMass, maxLeanMass) {
        return monthlyMuscleGainEstimator(leanMass, maxLeanMass) * 0.230769;
    };

    dailyMuscleGainEstimator = function (leanMass, maxLeanMass) {
        return monthlyMuscleGainEstimator(leanMass, maxLeanMass) / 30;
    };

    trainingAgeEstimator = function (leanMass, maxLeanMass) {
        var leanMassPercentage = leanMass / maxLeanMass;
        return Math.exp((leanMassPercentage - b)/a);
    };

    // assumes light activity, additional daily activity must be calculated separately
    dailyMaximumDietaryDeficitEstimator = function (fatMass) {
        return 22 * fatMass;
    };

    muscleGainCalorieRequirementEstimator = function (muscleGain) {
        return 1900 * muscleGain;
    };

    muscleGainForCaloriesEstimator = function (calories) {
        return calories / 1900;
    };

    return {
        bodyFat: navyBodyFatEstimator,
        maximumLeanBodyMass: maximumLeanBodyMassEstimator,
        activityExpenditure: activityExpenditureEstimator,
        basalMetabolicRate: basalMetabolicRateEstimator,
        adaptiveThermogensis: adaptiveThermogenesisEstimator,
        lowBodyFatMetabolicRateCorrection: lowBodyFatMetabolicRateCorrectionEstimator,
        weeklyMuscleGain: weeklyMuscleGainEstimator,
        dailyMuscleGain: dailyMuscleGainEstimator,
        dailyMaximumDietaryDeficit: dailyMaximumDietaryDeficitEstimator,
        muscleGainCalorieRequirement: muscleGainCalorieRequirementEstimator,
        muscleGainForCalories: muscleGainForCaloriesEstimator
    }
});

angular.module("BeyondHuman").factory("DietModelingService", function (EstimatorService) {
    var modelDiet, modelDietWeek;

    /*
     * This is the main diet planner function.
     *
     * Config may have the following properties:
     * - duration: diet plan duration, in weeks
     * - bodyWeight: current body weight in pounds
     * - bodyFatPercentage: percentage of body weight that is fat (optional)
     * - height: height, in inches
     * - abdomen: abdomen circumference, in inches (optional, not used if bodyFatPercentage is supplied)
     * - neck: neck circumference, in inches (optional, not used if bodyFatPercentage is supplied)
     * - hips: hips circumference, in inches (optional, for females only, not used if bodyFatPercentage is supplied)
     * - wrist: wrist circumference, in inches
     * - ankle: ankle circumference, in inches
     * - massPreservationCoefficient: a multiplier used to scale the dietary deficit towards or away LBM preservation
     * - activityLevel: a general activity level (excluding specific exercise) used to adjust total calorie expenditure
     * - exerciseCalorieExpenditure: a specific daily calorie utilization estimated from exercise performed (optional)
     * - weeklyExerciseSessions: the number of fasted low intensity cardio sessions performed per week
     */
    modelDiet = function (config) {
        var i, fatMass, leanMass, maxLeanMass, calorieIntake, adaptiveThermogenesis,
            adaptiveThermogenesisDelta, dietModelResults = [];
        // first we need to figure out the fat mass, which we will use to get lean mass and a variety of other things
        if (config.bodyFatPercentage) {
            fatMass = config.bodyWeight * config.bodyFatPercentage / 100;
        } else {
            fatMass = config.bodyWeight * EstimatorService.bodyFat(config.height, config.abdomen,config.neck, config.hips) / 100;
        }
        leanMass = config.bodyWeight - fatMass;
        calorieIntake = EstimatorService.basalMetabolicRate(leanMass);
        adaptiveThermogenesis = 0.14 * calorieIntake;
        /* next lets calculate the estimated max lean mass as we need it to factor protein synthesis requirements in
           when calculating deficits */
        maxLeanMass = EstimatorService.maximumLeanBodyMass(config.height, config.wrist, config.ankle);
        for (i = 0; i < config.duration; i++) {
            dietModelResults.push(modelDietWeek(leanMass, fatMass, maxLeanMass, config.massPreservationCoefficient || 1,
                                                adaptiveThermogenesis, config.activityLevel || 1.2,
                                                config.exerciseCalorieExpenditure || 0, config.weeklyExerciseSessions || 0));
            adaptiveThermogenesis = EstimatorService.adaptiveThermogensis(
                    calorieIntake,
                    dietModelResults[i].dailyCalorieIntake,
                    adaptiveThermogenesis
            );
            calorieIntake = dietModelResults[i].dailyCalorieIntake;
            leanMass = dietModelResults[i].leanMass;
            fatMass = dietModelResults[i].fatMass;
        }
        return dietModelResults;
    };

    modelDietWeek = function (leanMass, fatMass, maxLeanMass, massPreservationCoefficient, adaptiveThermogenesis,
                              activityLevel, exerciseCalorieExpenditure, weeklyExerciseSessions) {
        var potentialMuscleGain, dailyDeficit, maxDailyDeficit, basalMetabolicRate, weeklyDeficit,
            deficitAboveMaximum, muscleGain, muscleGainCalorieRequirement, fatLoss, dailyEnergyExpenditure,
            bodyFatPercentage, dailyCalorieIntake, activityExpenditure;
        /* first, we need to figure out how much muscle could be gained, and how much is actually gained based on the
           potential losses resulting from the mass preservation coefficient */
        potentialMuscleGain = EstimatorService.dailyMuscleGain(leanMass, maxLeanMass);
        maxDailyDeficit = EstimatorService.dailyMaximumDietaryDeficit(fatMass);
        dailyDeficit = Math.min(massPreservationCoefficient, 1) * maxDailyDeficit;
        if (massPreservationCoefficient > 1) {
            deficitAboveMaximum = maxDailyDeficit * massPreservationCoefficient - maxDailyDeficit;
            muscleGain = potentialMuscleGain - EstimatorService.muscleGainForCalories(deficitAboveMaximum);
        } else {
            muscleGain = potentialMuscleGain;
        }
        muscleGainCalorieRequirement = EstimatorService.muscleGainCalorieRequirement(muscleGain);
        bodyFatPercentage = fatMass / (leanMass + fatMass);
        activityExpenditure = EstimatorService.activityExpenditure(leanMass, fatMass, activityLevel);
        basalMetabolicRate = EstimatorService.basalMetabolicRate(leanMass) * 0.86 + adaptiveThermogenesis;
        dailyEnergyExpenditure = EstimatorService.lowBodyFatMetabolicRateCorrection(bodyFatPercentage, basalMetabolicRate + activityExpenditure) + muscleGainCalorieRequirement;
        dailyCalorieIntake = dailyEnergyExpenditure - dailyDeficit;
        weeklyDeficit = exerciseCalorieExpenditure * weeklyExerciseSessions + (dailyEnergyExpenditure - dailyCalorieIntake) * 7;
        fatLoss = weeklyDeficit / 3500;
        return {
            leanMass: leanMass + muscleGain,
            fatMass: fatMass - fatLoss,
            dailyEnergyExpenditure: dailyEnergyExpenditure,
            dailyCalorieIntake: dailyCalorieIntake
        }
    };

    return {
        modelDiet: modelDiet
    }
});