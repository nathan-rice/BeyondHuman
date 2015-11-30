import estimators = require('./estimators')
import models = require('./models')

export function modelDiet(anthrometrics : models.UserAnthrometrics) {
    var i, fatMass, leanMass, maxLeanMass, calorieIntake, adaptiveThermogenesis, dietModelResults = [];
    // first we need to figure out the fat mass, which we will use to get lean mass and a variety of other things
    if (anthrometrics.bodyFat) {
        fatMass = anthrometrics.weight * anthrometrics.bodyFat / 100;
    } else {
        fatMass = anthrometrics.weight * estimators.navyBodyFat(anthrometrics.height, anthrometrics.abdomen, anthrometrics.neck) / 100;
    }
    leanMass = config.bodyWeight - fatMass;
    if (!config.maintenanceCalories) {
        calorieIntake = estimators.basalMetabolicRate(leanMass);
    } else {
        calorieIntake = config.maintenanceCalories;
    }
    adaptiveThermogenesis = 0.14 * calorieIntake;
    /* next lets calculate the estimated max lean mass as we need it to factor protein synthesis requirements in
     when calculating deficits */
    maxLeanMass = estimators.maximumLeanBodyMass(config.height, config.wrist, config.ankle);
    for (i = 0; i < config.duration * 7; i++) {
        dietModelResults.push(modelDietDay(leanMass, fatMass, maxLeanMass, config.massPreservationCoefficient || 1,
            adaptiveThermogenesis, config.maintenanceCalories, config.activityLevel || 1.2,
            config.exerciseCalorieExpenditure || 0, config.weeklyExerciseSessions || 0));
        adaptiveThermogenesis = estimators.adaptiveThermogenesis(
            calorieIntake,
            dietModelResults[i].calorieIntake,
            adaptiveThermogenesis
        );
        calorieIntake = dietModelResults[i].calorieIntake;
        leanMass = dietModelResults[i].leanMass;
        fatMass = dietModelResults[i].fatMass;
    }
    return dietModelResults;
}

function modelDietDay(leanMass, fatMass, maxLeanMass, massPreservationCoefficient, adaptiveThermogenesis,
                          maintenanceCalories, activityLevel, exerciseCalorieExpenditure, weeklyExerciseSessions) {
    var potentialMuscleGain, baseDeficit, maxDailyDeficit, basalMetabolicRate, calorieDeficit,
        deficitAboveMaximum, muscleGain, muscleGainCalorieRequirement, fatLoss, energyExpenditure,
        bodyFatPercentage, calorieIntake, activityExpenditure, fastedExerciseExpenditure;
    /* first, we need to figure out how much muscle could be gained, and how much is actually gained based on the
     potential losses resulting from the mass preservation coefficient */
    potentialMuscleGain = estimators.dailyMuscleGain(leanMass, maxLeanMass);
    maxDailyDeficit = estimators.dailyMaximumDietaryDeficit(fatMass);
    baseDeficit = Math.min(massPreservationCoefficient, 1) * maxDailyDeficit;
    if (massPreservationCoefficient > 1) {
        deficitAboveMaximum = maxDailyDeficit * massPreservationCoefficient - maxDailyDeficit;
        muscleGain = potentialMuscleGain - estimators.muscleGainForCalories(deficitAboveMaximum);
    } else {
        muscleGain = potentialMuscleGain;
    }
    muscleGainCalorieRequirement = estimators.muscleGainCalorieRequirement(muscleGain);
    bodyFatPercentage = fatMass / (leanMass + fatMass);
    activityExpenditure = estimators.activityExpenditure(leanMass, fatMass, activityLevel);
    if (!maintenanceCalories) {
        basalMetabolicRate = estimators.basalMetabolicRate(leanMass) * 0.86 + adaptiveThermogenesis;
    } else {
        basalMetabolicRate = maintenanceCalories * 0.86 + adaptiveThermogenesis;
    }
    energyExpenditure = estimators.lowBodyFatCalorieExpenditureCorrection(bodyFatPercentage, basalMetabolicRate + activityExpenditure) + muscleGainCalorieRequirement;
    fastedExerciseExpenditure = estimators.lowBodyFatCalorieExpenditureCorrection(bodyFatPercentage, exerciseCalorieExpenditure * weeklyExerciseSessions / 7);
    calorieIntake = energyExpenditure - baseDeficit;
    calorieDeficit = fastedExerciseExpenditure + energyExpenditure - calorieIntake;
    fatLoss = calorieDeficit / 3500;
    return {
        leanMass: leanMass + muscleGain,
        fatMass: fatMass - fatLoss,
        energyExpenditure: energyExpenditure,
        calorieIntake: calorieIntake
    }
}