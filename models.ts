import estimators = require("./estimators");

export enum Weekday {Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}

export interface IRefeedSchedule {
    Monday?: number;
    Tuesday?: number;
    Wednesday?: number;
    Thursday?: number;
    Friday?: number;
    Saturday?: number;
    Sunday?: number;
}

export class DietConfiguration {
    constructor(public duration: number, public refeedSchedule: IRefeedSchedule, public massPreservationCoefficient: number,
                public fastedExerciseCalorieExpenditure: number) {}
}

export interface ISkinFoldMeasurements {
    chest: number;
    abdomen: number;
    thigh: number;
}

export interface IAnthrometrics {
    height: number;
    weight: number;
    wrist: number;
    ankle: number;
    fatPercent?: number;
    abdomen?: number;
    neck?: number;
    age?: number;
    skinfolds?: ISkinFoldMeasurements;
}

export class BodyComposition {
    private anthrometrics: IAnthrometrics;
    weight: number;
    fatPercent: number;
    fatMass: number;
    leanMass: number;
    maxLeanMass: number;

    constructor(am: IAnthrometrics) {
        this.anthrometrics = am;
        this.weight = am.weight;
        // first we need to figure out the fat mass, which we will use to get lean mass and a variety of other things
        if (am.fatPercent) {
            this.fatPercent = am.fatPercent;
        } else if (am.skinfolds && am.age) {
            this.fatPercent = estimators.skinfoldBodyFat(
                am.skinfolds.chest,
                am.skinfolds.abdomen,
                am.skinfolds.thigh,
                am.age)
        } else if (am.abdomen && am.neck) {
            this.fatPercent = estimators.navyBodyFat(am.height, am.abdomen, am.neck) / 100;
        }
        this.fatMass = am.weight * am.fatPercent / 100;
        this.leanMass = am.weight - this.fatMass;
        this.maxLeanMass = estimators.maximumLeanBodyMass(am.height, am.wrist, am.ankle);
    }

    copy(): BodyComposition {
        let am = Object.assign({}, this.anthrometrics);
        am.fatPercent = this.fatPercent;
        return new BodyComposition(am);
    }

    maxDeficit(): number {
        return estimators.dailyMaximumDietaryDeficit(this.fatMass);
    }

    dailyMuscleGain(deficit: number = 0): number {
        let deficitAboveMaximum = Math.max(0, deficit - this.maxDeficit()),
            potentialMuscleGain = estimators.dailyMuscleGain(this.leanMass, this.maxLeanMass);
        return potentialMuscleGain - estimators.muscleGainForCalories(deficitAboveMaximum);
    }

}

export interface ICalorieExpenditure {
    maintenanceCalories?: number;
    activityLevel?: number;
    fastedExerciseCalorieExpenditure?: number;
}

export class DietDay {
    energyExpenditure: number;
    calorieIntake: number;
    bodyComposition: BodyComposition;
    bmr: number;
    constructor (bc: BodyComposition, private ce: ICalorieExpenditure, public calorieDeficit: number,
                 private priorCalorieIntake?: number, private adaptiveThermogenesis?: number) {
        let fastedExerciseCalorieExpenditure = ce.fastedExerciseCalorieExpenditure || 0, baseEnergyExpenditure,
            muscleGain = estimators.muscleGainCalorieRequirement(bc.dailyMuscleGain(calorieDeficit)),
            bmr = estimators.basalMetabolicRate(bc.leanMass);
        this.bodyComposition = bc;
        this.adaptiveThermogenesis = adaptiveThermogenesis || 0.14 * bmr;
        if (ce.maintenanceCalories) {
            baseEnergyExpenditure
            // assuming moderate activity
            this.bmr = ce.maintenanceCalories / (ce.activityLevel || 1.4) * 0.86 + 0.14 * this.adaptiveThermogenesis;
        } else {
            let activityLevel = ce.activityLevel || 1.2,
                activityExpenditure = estimators.activityExpenditure(bc.leanMass, bc.fatMass, activityLevel);
            this.bmr = estimators.lowBodyFatCalorieExpenditureCorrection(bc.fatPercent, bmr * 0.86 + this.adaptiveThermogenesis * 0.14);
            baseEnergyExpenditure = this.bmr + estimators.lowBodyFatCalorieExpenditureCorrection(bc.fatPercent, activityExpenditure) + muscleGain;
        }
        this.energyExpenditure = baseEnergyExpenditure + estimators.lowBodyFatCalorieExpenditureCorrection(bc.fatPercent, fastedExerciseCalorieExpenditure);
        this.calorieIntake = baseEnergyExpenditure - calorieDeficit;
    }

    model(): BodyComposition {
        let bc = this.bodyComposition.copy();

        return bc;
    }
}
