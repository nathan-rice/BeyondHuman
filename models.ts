export enum Weekday {Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday}

export interface RefeedSchedule {
    Monday?: number;
    Tuesday?: number;
    Wednesday?: number;
    Thursday?: number;
    Friday?: number;
    Saturday?: number;
    Sunday?: number;
}

export class DietConfiguration {
    constructor(public duration: number, public refeedSchedule: RefeedSchedule, public massPreservationCoefficient: number,
                public fastedExerciseCalorieExpenditure: number) {}
}

export interface SkinFoldMeasurements {
    chest: number;
    abdomen: number;
    thigh: number;
}

export interface UserAnthrometrics {
    height: number;
    weight: number;
    wrist: number;
    ankle: number;
    bodyFat?: number;
    abdomen?: number;
    neck?: number;
    skinfolds?: SkinFoldMeasurements;
}

export interface CalorieExpenditure {
    maintenanceCalories?: number;
    activityLevel?: number;
}
