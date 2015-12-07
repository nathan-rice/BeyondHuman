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

export interface ICalorieExpenditureSchedule {
    Monday: ICalorieExpenditure;
    Tuesday: ICalorieExpenditure;
    Wednesday: ICalorieExpenditure;
    Thursday: ICalorieExpenditure;
    Friday: ICalorieExpenditure;
    Saturday: ICalorieExpenditure;
    Sunday: ICalorieExpenditure;
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
    fatMass: number;
    leanMass: number;
    maxLeanMass: number;

    constructor(am: IAnthrometrics) {
        this.anthrometrics = am;
        this.weight = am.weight;
        this.fatMass = am.weight * this.fatPercent() / 100;
        this.leanMass = am.weight - this.fatMass;
        this.maxLeanMass = estimators.maximumLeanBodyMass(am.height, am.wrist, am.ankle);
    }

    fatPercent(): number {
        if (this.weight && this.fatMass) {
            return this.fatMass / this.weight * 100;
        }
        else if (this.anthrometrics.fatPercent) {
            return this.anthrometrics.fatPercent;
        } else if (this.anthrometrics.skinfolds && this.anthrometrics.age) {
            return estimators.skinfoldBodyFat(
                this.anthrometrics.skinfolds.chest,
                this.anthrometrics.skinfolds.abdomen,
                this.anthrometrics.skinfolds.thigh,
                this.anthrometrics.age)
        } else if (this.anthrometrics.abdomen && this.anthrometrics.neck) {
            return estimators.navyBodyFat(this.anthrometrics.height, this.anthrometrics.abdomen, this.anthrometrics.neck);
        }
        else return 20; // perhaps an exception should be raised instead?
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

export class Diet {
    constructor(private bodyComposition, public duration: number,
                public calorieExpenditure: ICalorieExpenditureSchedule | ICalorieExpenditure,
                public massPreservationCoefficient: number = 1, public refeedSchedule?: IRefeedSchedule) {
    }

    private getCalorieExpenditure(day: Weekday): ICalorieExpenditure {
        let dayName = Weekday[day % 7];
        if (this.calorieExpenditure.hasOwnProperty(dayName)) {
            return this.calorieExpenditure[dayName];
        }
        else {
            return this.calorieExpenditure;
        }
    }

    private getCalorieDeficit(day: Weekday): number {
        let deficit, dayName = Weekday[day % 7];
        if (this.refeedSchedule && this.refeedSchedule.hasOwnProperty(dayName)) {
            deficit = this.refeedSchedule[dayName];
        }
        return deficit;
    }

    model(): DietDay[] {
        let day, dietDays = [], lastDietDay;
        dietDays.push(new DietDay(this.bodyComposition, this.getCalorieExpenditure(0)));
        for (day = 1; day < this.duration; day++) {
            lastDietDay = dietDays[day - 1];
            dietDays.push(new DietDay(lastDietDay.bodyComposition, this.getCalorieExpenditure(day),
                lastDietDay.adaptiveThermogenesis, lastDietDay.calorieIntake, this.getCalorieDeficit(day)))
        }
        return dietDays;
    }
}

export class DietDay {
    energyExpenditure: number;
    calorieIntake: number;
    bodyComposition: BodyComposition;
    bmr: number;
    adaptiveThermogenesis: number;
    private calorieDeficit: number;
    private muscleGain;
    private muscleGainCalories;

    constructor(bc: BodyComposition, private ce: ICalorieExpenditure, adaptiveThermogenesis?: number,
                private priorCalorieIntake?: number, calorieDeficit?: number) {
        this.calorieDeficit = this.calorieDeficit || bc.maxDeficit();
        this.bodyComposition = bc;
        this.muscleGain = bc.dailyMuscleGain(this.calorieDeficit);
        this.muscleGainCalories = estimators.muscleGainCalorieRequirement(this.muscleGain);
        let fastedExerciseCalorieExpenditure = ce.fastedExerciseCalorieExpenditure || 0, baseEnergyExpenditure,
            baseBMR = estimators.basalMetabolicRate(bc.leanMass);
        adaptiveThermogenesis = adaptiveThermogenesis || estimators.adaptiveThermogenesis(baseBMR);
        this.bmr = estimators.lowBodyFatCalorieExpenditureCorrection(bc.fatPercent(), estimators.adaptiveThermogenesisCorrection(baseBMR, adaptiveThermogenesis));
        if (ce.maintenanceCalories) {
            baseEnergyExpenditure = ce.maintenanceCalories + (this.bmr - baseBMR);
        } else {
            let activityLevel = ce.activityLevel || 1.2,
                activityExpenditure = estimators.activityExpenditure(bc.leanMass, bc.fatMass, activityLevel);
            baseEnergyExpenditure = this.bmr + estimators.lowBodyFatCalorieExpenditureCorrection(bc.fatPercent(), activityExpenditure) + this.muscleGainCalories;
        }
        this.energyExpenditure = baseEnergyExpenditure + estimators.lowBodyFatCalorieExpenditureCorrection(bc.fatPercent(), fastedExerciseCalorieExpenditure);
        if (Math.abs(calorieDeficit) < 1) {
            this.calorieIntake = baseEnergyExpenditure * (1 - calorieDeficit);
        } else {
            this.calorieIntake = baseEnergyExpenditure - calorieDeficit;
        }
        priorCalorieIntake = priorCalorieIntake || ce.maintenanceCalories || this.calorieIntake;
        this.adaptiveThermogenesis = estimators.adaptiveThermogenesis(priorCalorieIntake, this.calorieIntake, adaptiveThermogenesis);
        this.bodyComposition = bc.copy();
        // factor in loss of lean body mass with overly aggressive calorie restriction
        this.bodyComposition.fatMass += (this.calorieIntake + Math.min(this.muscleGainCalories, 0) - this.energyExpenditure) / 3500;
        this.bodyComposition.leanMass += this.muscleGain;
        this.bodyComposition.weight = bc.fatMass + bc.leanMass;
    }
}
