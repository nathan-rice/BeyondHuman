import estimators = require('./estimators')
import models = require('./models')

export function modelDiet(conf: models.DietConfiguration, bc: models.BodyComposition,
                          calories: models.ICalorieExpenditure) {
    var i, caloriesInOut: models.DietDay, dietModelResults = [];
    /* next lets calculate the estimated max lean mass as we need it to factor protein synthesis requirements in
     when calculating deficits */
    for (i = 0; i < conf.duration * 7; i++) {
        dietModelResults.push(modelDietDay(leanMass, fatMass, maxLeanMass, conf.massPreservationCoefficient || 1,
            adaptiveThermogenesis, conf.maintenanceCalories, conf.activityLevel || 1.2,
            conf.exerciseCalorieExpenditure || 0, conf.weeklyExerciseSessions || 0));
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

function modelDietDay(bc: models.BodyComposition, ) {
    var potentialMuscleGain, baseDeficit, maxDailyDeficit, basalMetabolicRate, calorieDeficit,
        deficitAboveMaximum, muscleGain, muscleGainCalorieRequirement, fatLoss, energyExpenditure,
        bodyFatPercentage, calorieIntake, activityExpenditure, fastedExerciseExpenditure;
    /* first, we need to figure out how much muscle could be gained, and how much is actually gained based on the
     potential losses resulting from the mass preservation coefficient */
    baseDeficit = Math.min(massPreservationCoefficient, 1) * maxDailyDeficit;
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