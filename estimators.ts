/**
 * Created by nathan on 11/14/15.
 */


var a = 0.22775197106766698, b = -0.024346985716006797;

export function navyBodyFat(height, abdomen, neck) {
    return 86.010 * Math.log10(abdomen - neck) - 70.041 * Math.log10(height) + 36.76;
}

export function skinfoldBodyFat(chest, abdomen, thigh, age) {
    let m = chest + abdomen + thigh,
        n = Math.pow(m, 2),
        bd = 1.1093800 - (0.0008267*m) + (0.0000016*n) - (0.0002574*age);
    return 495/bd - 450;
}

export function maximumLeanBodyMass(height, wrist, ankle) {
    // uses the maximum lean body mass formula by Casey Butt
    var maxBodyWeight = Math.pow(height, 1.5) * (Math.sqrt(wrist) / 22.6670 + Math.sqrt(ankle) / 17.0104) * (10 / 224 + 1);
    return maxBodyWeight * 0.9;
}

export function activityExpenditure(leanMass, fatMass, activityLevel) {
    /* Note that rather than multiplying the BMR by the activity factor as is commonly practiced, because we are
     using the Katch-McArdle BMR forumula which does not take total body weight into account, we need to factor
     in the additional caloric cost of activity considering total body weight.

     The value used (22) is arbitrary, and has no research data to support it.  It was chosen because it is close
     to the lean mass coefficient in the Katch-McArdle BMR formula, operating under the assumption that the
     base caloric expenditure should not change significantly in response to physical activity.  I am open to
     modification of this value (or the entire formula) based on rigorous scientific data.
     */

    return (activityLevel - 1) * 22 * (leanMass + fatMass)
}

export function basalMetabolicRate(leanMass) {
    /* uses Katch-McArdle BRM estimator as our target user is not well modeled by BMR estimators that do not take
     LBM into account */
    return 370 + (21.6 * leanMass / 2.2)
}

export function adaptiveThermogenesis(oldCalorieIntake, newCalorieIntake, adaptiveThermogenesis) {
    /* Models the change in metabolic rate over a week period.
     *
     * This function uses the model for change in adaptive thermogenesis postulated in:
     *   Quantification of the effect of energy imbalance on bodyweight.
     *   http://www.ncbi.nlm.nih.gov/pubmed/21872751
     */
    var dailyCalorieIntakeChange = oldCalorieIntake - newCalorieIntake;
    return adaptiveThermogenesis + (0.14 * dailyCalorieIntakeChange - adaptiveThermogenesis) / 14;
}

export function lowBodyFatCalorieExpenditureCorrection(bodyFatPercentage, metabolicRate) {
    /*   Rough guess figure based on anecdotal reports and eyeballing graphs in:
     *
     *   Adaptive reduction in basal metabolic rate in response to food deprivation in humans: a role for feedback
     *   signals from fat stores.
     *   http://www.ncbi.nlm.nih.gov/pubmed/9734736
     */
    return (100 + Math.min(bodyFatPercentage - 20, 0)) / 100 * metabolicRate;
}

export function monthlyMuscleGain(leanMass, maxLeanMass) {
    var trainingAge, endingLeanMass;
    trainingAge = trainingAgeEstimator(leanMass, maxLeanMass);
    endingLeanMass = maxLeanMass * (a * Math.log(trainingAge + 1) + b);
    return endingLeanMass - leanMass;
}

export function weeklyMuscleGain(leanMass, maxLeanMass) {
    return monthlyMuscleGain(leanMass, maxLeanMass) * 0.230769;
}

export function dailyMuscleGain(leanMass, maxLeanMass) {
    return monthlyMuscleGain(leanMass, maxLeanMass) / 30;
}

function trainingAgeEstimator(leanMass, maxLeanMass) {
    var leanMassPercentage = leanMass / maxLeanMass;
    return Math.exp((leanMassPercentage - b) / a);
}

// assumes light activity, additional daily activity must be calculated separately
export function dailyMaximumDietaryDeficit(fatMass) {
    return 22 * fatMass;
}

export function muscleGainCalorieRequirement(muscleGain) {
    return 1900 * muscleGain;
}

export function muscleGainForCalories(calories) {
    return calories / 1900;
}
