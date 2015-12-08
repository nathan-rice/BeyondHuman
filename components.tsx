/// <reference path="./react/react.d.ts"/>
/// <reference path="./react/react-global.d.ts"/>
/// <reference path="./chartjs/chart.d.ts"/>

import models = require("./models");

export class DietPlannerApp extends React.Component<any, any> {
    diet: models.Diet;
    anthrometrics: models.IAnthrometrics;
    calorieExpenditure: models.ICalorieExpenditure | models.ICalorieExpenditureSchedule;
    refeedSchedule: models.IRefeedSchedule;
    settings: any; // misc container object passed via props as a catch all for diet settings

    constructor() {
        this.onClick = this.onClick.bind(this);
        this.state = {diet: []};
        this.calorieExpenditure = {};
        this.anthrometrics = {weight: 210, height: 72, wrist: 7.5, ankle: 11.75};
        this.refeedSchedule = {};
        this.settings = {massPreservationCoefficient: 1, duration: 84, fastedExerciseCalorieExpenditure: 500,
        weeklyFastedExerciseSessions: 4};
        super();
    }



    onClick(event) {
        let dietPlan, bodyComposition = new models.BodyComposition(this.anthrometrics);
        event.preventDefault();
        this.diet = new models.Diet(bodyComposition, this.settings.duration, this.calorieExpenditure,
            this.settings.massPreservationCoefficient, this.refeedSchedule);
        dietPlan = this.diet.model();
        this.setState({diet: dietPlan});
    }

    render() {
        let diet = this.state.diet.length > 0 ? <DietPlanTable days={this.state.diet}/> : '';
        return (
            <div className="container">
                <form>
                    <div className="row">
                        <div className="form-group">
                            <label htmlFor="diet-duration">Diet duration</label>
                            <input type="number" className="form-control" id="diet-duration"
                                   defaultValue={this.settings.duration}
                                   onChange={e => this.settings.duration = (e.target as HTMLInputElement).valueAsNumber}/>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <h2>Diet planner</h2>
                    </div>
                    <WeightHeightInput anthrometrics={this.anthrometrics}/>
                    <hr/>
                    <MuscleGainInput anthrometrics={this.anthrometrics}/>
                    <hr/>
                    <BodyFatEstimationInput anthrometrics={this.anthrometrics}/>
                    <hr/>
                    <CalorieExpenditureInput calorieExpenditure={this.calorieExpenditure}/>
                    <hr/>
                    <label>Mass preservation coefficient
                        <input type="range" step="0.1" min="0.5" max="1.5" className="form-control"
                               defaultValue={this.settings.massPreservationCoefficient}
                               onChange={e => this.settings.massPreservationCoefficient = (e.target as HTMLInputElement).valueAsNumber}/>
                    </label>
                    <hr/>
                    <div className="row">
                        <p>In order to maintain a reasonable rate of fat loss as fat mass decreases, it is necessary to incorporate
                fasted cardiovascular training. The reason this is necessary is due to the fact that the rate lipolysis
                in fat cells is the limiting factor in the speed of weight loss at low bodyfat levels, and
                the lipolytic response to cardiovascular training is significantly blunted in the fed state.
                        </p>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="exercise-calorie-expenditure">Fasted exercise calorie expenditure
                                </label>
                                <input type="number" step="0.1" className="form-control"
                                       id="exercise-calorie-expenditure"
                                       defaultValue={this.settings.fastedExerciseCalorieExpenditure}
                                       onChange={e => this.settings.fastedExerciseCalorieExpenditure = (e.target as HTMLInputElement).valueAsNumber}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="weekly-exercise-sessions">Weekly fasted exercise sessions</label>
                                <input type="number" className="form-control" id="weekly-exercise-sessions"
                                       defaultValue={this.settings.weeklyFastedExerciseSessions}
                                       onChange={e => this.settings.weeklyFastedExerciseSessions = (e.target as HTMLInputElement).valueAsNumber}
                                />
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <RefeedInput refeedSchedule={this.refeedSchedule}/>
                    <button onClick={this.onClick}>Compute</button>
                </form>
                {diet}
            </div>

        )
    }
}

interface IWeightHeightProperties {
    anthrometrics: models.IAnthrometrics;
}

class WeightHeightInput extends React.Component<IWeightHeightProperties, any> {
    render() {
        return (
            <div>
                <div className="row">
                    <h3>Height and weight</h3>
                    <p>This diet planner performs a variety of computations that require height and weight as inputs.
                    </p>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="body-weight">Body weight (lbs)</label>
                            <input type="number" defaultValue={this.props.anthrometrics.weight} step="0.01"
                                   className="form-control" id="body-weight"
                                   onChange={e => this.props.anthrometrics.weight = (e.target as HTMLInputElement).valueAsNumber}/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="height">Height (inches)</label>
                            <input type="number" defaultValue={this.props.anthrometrics.height} step="0.01"
                                   className="form-control" id="height"
                                   onChange={e => this.props.anthrometrics.height = (e.target as HTMLInputElement).valueAsNumber}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

interface IMuscleGainProperties {
    anthrometrics: models.IAnthrometrics;
}

class MuscleGainInput extends React.Component<IMuscleGainProperties, any> {
    render() {
        return (
            <div>
                <div className="row">
                    <h3>Estimating rate of muscle gain</h3>

                    <p>In order to accurately factor in muscle gain when assessing your dietary needs, we need to estimate your
                rate of muscle gain. To do this, we find an<a href="http://www.weightrainer.net/potential.html">estimate of
                    your maximum drug free muscle mass potential</a>, then work backwards from that using our estimate
                of your current lean body mass to find your<a href="#"
                                                              data-tooltip="An estimate of the amount of time it would take given consistent diet and training to reach the current level of muscularity">training
                    age</a>. Given your training age, we can estimate the rate of muscle gain using a formula based on
                empirical observations of muscle mass accrual in drug free trainees.
                    </p>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="wrist">Wrist circumference (inches)</label>
                            <input type="number" defaultValue={this.props.anthrometrics.wrist} step="0.01"
                                   className="form-control" id="wrist"
                                   onChange={e => this.props.anthrometrics.wrist = (e.target as HTMLInputElement).valueAsNumber}/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="ankle">Ankle circumference (inches)</label>
                            <input type="number" defaultValue={this.props.anthrometrics.ankle} step="0.01"
                                   className="form-control" id="ankle"
                                   onChange={e => this.props.anthrometrics.ankle = (e.target as HTMLInputElement).valueAsNumber}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

interface IBodyFatEstimationProperties {
    anthrometrics: models.IAnthrometrics;
}

class BodyFatEstimationInput extends React.Component<IBodyFatEstimationProperties, any> {

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.state = {};
        super();
    }

    onChange(event) {
        this.setState({bodyFatEstimator: event.target.value});
    }

    getBodyFatEstimator() {
        if (this.state.bodyFatEstimator == "direct") {
            delete this.props.anthrometrics.abdomen;
            delete this.props.anthrometrics.neck;
            delete this.props.anthrometrics.skinfolds;
            return <DirectBodyFatInput anthrometrics={this.props.anthrometrics}/>;
        } else if (this.state.bodyFatEstimator == "navy") {
            delete this.props.anthrometrics.fatPercent;
            delete this.props.anthrometrics.skinfolds;
            return <NavyBodyFatInput anthrometrics={this.props.anthrometrics}/>;
        } else if (this.state.bodyFatEstimator == "skinfold") {
            delete this.props.anthrometrics.fatPercent;
            delete this.props.anthrometrics.abdomen;
            delete this.props.anthrometrics.neck;
            this.props.anthrometrics.skinfolds = {chest: 0, thigh: 0, abdomen: 0};
            return <SkinfoldBodyFatInput anthrometrics={this.props.anthrometrics}/>;
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <p>In order to accurately plan your diet, it is critical to know your starting body fat percentage. If you
                have had your body composition assessed recently using a high accuracy method such as DXA or hydrostatic
                weighing, go ahead and enter it here. If you don't know your body fat percentage, we can attempt to
                estimate it based on your abdomen and neck circumference, or from caliper skin-fold measurements. Be
                aware these estimation methods are highly inexact, and their use will impact the quality of the
                resulting diet plan.
                    </p>
                </div>
                <div className="row">
                    <div className="radio">
                        <label>
                            <input type="radio" value="direct" checked={this.state.bodyFatEstimator === "direct"}
                                   onChange={this.onChange}/>
                            I will provide my body fat percent
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="navy" checked={this.state.bodyFatEstimator === "navy"}
                                   onChange={this.onChange}/>
                            Estimate my body fat percent using my abdomen and neck circumference
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="skinfold" checked={this.state.bodyFatEstimator === "skinfold"}
                                   onChange={this.onChange}/>
                            Estimate my body fat percent using caliper skin-fold measurements
                        </label>
                    </div>
                </div>
                {this.getBodyFatEstimator()}
            </div>
        )
    }
}

interface IDirectBodyFatProperties {
    anthrometrics: models.IAnthrometrics;
    defaultFatPercent?: number;
}

class DirectBodyFatInput extends React.Component<IDirectBodyFatProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="body-fat-percentage">Body fat (%)</label>
                        <input type="number" step="0.01"
                               className="form-control" id="body-fat-percentage"
                               onChange={e => this.props.anthrometrics.fatPercent = (e.target as HTMLInputElement).valueAsNumber}/>
                    </div>
                </div>
            </div>
        )
    }
}

interface INavyBodyFatProperties {
    anthrometrics: models.IAnthrometrics;
    defaultAbdomen?: number;
    defaultNeck?: number;
}

class NavyBodyFatInput extends React.Component<INavyBodyFatProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="abdomen">Abdomen circumference (inches)</label>
                        <input type="number" step="0.01"
                               className="form-control" id="abdomen"
                               onChange={e => this.props.anthrometrics.abdomen = (e.target as HTMLInputElement).valueAsNumber}/>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="neck">Neck circumference (inches)</label>
                        <input type="number" step="0.01"
                               className="form-control" id="neck"
                               onChange={e => this.props.anthrometrics.neck = (e.target as HTMLInputElement).valueAsNumber}/>
                    </div>
                </div>
            </div>
        )
    }
}

interface ISkinfoldBodyFatProperties {
    anthrometrics: models.IAnthrometrics;
    defaultChest?: number;
    defaultAbdomen?: number;
    defaultThigh?: number;
}

class SkinfoldBodyFatInput extends React.Component<ISkinfoldBodyFatProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="skinfold-chest">Chest skin-fold (mm)</label>
                        <input type="number" step="0.01"
                               className="form-control" id="skinfold-chest"
                               onChange={e => this.props.anthrometrics.skinfolds.chest = (e.target as HTMLInputElement).valueAsNumber}/>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="skinfold-abdomen">Abdomen skin-fold (mm)</label>
                        <input type="number" step="0.01"
                               className="form-control" id="skinfold-abdomen"
                               onChange={e => this.props.anthrometrics.skinfolds.abdomen = (e.target as HTMLInputElement).valueAsNumber}/>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="skinfold-thigh">Thigh skin-fold (mm)</label>
                        <input type="number" step="0.01"
                               className="form-control" id="skinfold-thigh"
                               onChange={e => this.props.anthrometrics.skinfolds.thigh = (e.target as HTMLInputElement).valueAsNumber}/>
                    </div>
                </div>
            </div>
        )
    }
}

interface ICalorieExpenditureProperties {
    calorieExpenditure: models.ICalorieExpenditure | models.ICalorieExpenditureSchedule;
    calorieExpenditureEstimator?: string;
}

class CalorieExpenditureInput extends React.Component<ICalorieExpenditureProperties, any> {

    constructor() {
        this.onChange = this.onChange.bind(this);
        this.state = {};
        super();
    }

    onChange(event) {
        this.setState({calorieExpenditureEstimator: event.target.value});
    }

    calorieExpenditureToCalorieExpenditureSchedule(ce: models.ICalorieExpenditure): models.ICalorieExpenditureSchedule {
        delete ce.maintenanceCalories;
        delete ce.activityLevel;
        (ce as models.ICalorieExpenditureSchedule).Monday = {activityLevel: 1.2};
        (ce as models.ICalorieExpenditureSchedule).Tuesday = {activityLevel: 1.2};
        (ce as models.ICalorieExpenditureSchedule).Wednesday = {activityLevel: 1.2};
        (ce as models.ICalorieExpenditureSchedule).Thursday = {activityLevel: 1.2};
        (ce as models.ICalorieExpenditureSchedule).Friday = {activityLevel: 1.2};
        (ce as models.ICalorieExpenditureSchedule).Saturday = {activityLevel: 1.2};
        (ce as models.ICalorieExpenditureSchedule).Sunday = {activityLevel: 1.2};
        return ce as models.ICalorieExpenditureSchedule;
    }

    calorieExpenditureScheduleToCalorieExpenditure(ces: models.ICalorieExpenditureSchedule): models.ICalorieExpenditure {
        delete ces.Monday;
        delete ces.Tuesday;
        delete ces.Wednesday;
        delete ces.Thursday;
        delete ces.Friday;
        delete ces.Saturday;
        delete ces.Sunday;
        (ces as models.ICalorieExpenditure).activityLevel = 1.2;
        return ces;
    }

    getCalorieExpenditureEstimator() {
        let ce;
        if (this.state.calorieExpenditureEstimator == 'daily-activity') {
            ce = this.calorieExpenditureToCalorieExpenditureSchedule(this.props.calorieExpenditure as models.ICalorieExpenditure);
            return <DailyActivityInput calorieExpenditureSchedule={ce}/>;
        } else {
            ce = this.calorieExpenditureScheduleToCalorieExpenditure(this.props.calorieExpenditure as models.ICalorieExpenditureSchedule);
            if (this.state.calorieExpenditureEstimator == 'direct') {
                return <DirectCalorieExpenditureInput calorieExpenditure={ce}/>;
            } else if (this.state.calorieExpenditureEstimator == 'weekly-activity') {
                return <WeeklyActivityInput calorieExpenditure={ce}/>;
            }
        }
    }

    render() {
        return (
            <div>
                <div className="row">
                    <h3>Calorie expenditure</h3>

                    <p>In order to provide accurate calorie intake targets, we need to know how many calories you expend during
                a normal day. If you have empirically determined your total daily energy expenditure, you can enter it here.
                Otherwise, we can try to estimate your basal metabolic rate using your lean body mass, then use that along with
                your activity level (either daily, or averaged over the week) to determine your total daily energy expenditure.
                    </p>
                </div>
                <div className="row">
                    <div className="radio">
                        <label>
                            <input type="radio" value="direct"
                                   checked={this.state.calorieExpenditureEstimator === "direct"}
                                   onChange={this.onChange}/>
                            I will provide my total daily energy expenditure
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="weekly-activity"
                                   checked={this.state.calorieExpenditureEstimator === "weekly-activity"}
                                   onChange={this.onChange}/>
                            Estimate my basal metabolic rate and use a weekly activity level
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="daily-activity"
                                   checked={this.state.calorieExpenditureEstimator === "daily-activity"}
                                   onChange={this.onChange}/>
                            Estimate my basal metabolic rate and use daily activity levels
                        </label>
                    </div>
                </div>
                {this.getCalorieExpenditureEstimator()}
            </div>
        )
    }
}

interface ISingleCalorieExpenditureProperties {
    calorieExpenditure: models.ICalorieExpenditure;
}

class DirectCalorieExpenditureInput extends React.Component<ISingleCalorieExpenditureProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="maintenance-calories">Total daily energy expenditure</label>
                        <input type="number" className="form-control" id="maintenance-calories"
                               onChange={e => this.props.calorieExpenditure.maintenanceCalories = (e.target as HTMLInputElement).valueAsNumber}/>
                    </div>
                </div>
            </div>
        )
    }
}

class ActivityLevelSelector extends React.Component<ISingleCalorieExpenditureProperties, any> {
    render() {
        return (
            <select className="form-control" defaultValue={this.props.calorieExpenditure.activityLevel}
                    onChange={e => this.props.calorieExpenditure.activityLevel = parseFloat((e.target as HTMLSelectElement).value)}>
                <option value="1.2">Primarily seated</option>
                <option value="1.375">Moderate standing/light movement</option>
                <option value="1.55">Primarily standing/frequent movement</option>
                <option value="1.725">Manual labor (light lifting/carrying)</option>
                <option value="1.9">Manual labor (heavy lifting/carrying)</option>
            </select>
        )
    }
}

class WeeklyActivityInput extends React.Component<ICalorieExpenditureProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="activity-level">Weekly average activity level</label>
                        <ActivityLevelSelector calorieExpenditure={this.props.calorieExpenditure}/>
                    </div>
                </div>
            </div>
        )
    }
}

interface IDailyActivityProperties {
    calorieExpenditureSchedule: models.ICalorieExpenditureSchedule;
}

class DailyActivityInput extends React.Component<IDailyActivityProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Monday-activity-level">Monday activity Level</label>
                        <ActivityLevelSelector calorieExpenditure={this.props.calorieExpenditureSchedule.Monday}/>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Tuesday-activity-level">Tuesday activity level</label>
                        <ActivityLevelSelector calorieExpenditure={this.props.calorieExpenditureSchedule.Tuesday}/>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Wednesday-activity-level">Wednesday activity level</label>
                        <ActivityLevelSelector calorieExpenditure={this.props.calorieExpenditureSchedule.Wednesday}/>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Thursday-activity-level">Thursday activity level</label>
                        <ActivityLevelSelector calorieExpenditure={this.props.calorieExpenditureSchedule.Thursday}/>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Friday-activity-level">Friday activity level</label>
                        <ActivityLevelSelector calorieExpenditure={this.props.calorieExpenditureSchedule.Friday}/>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Saturday-activity-level">Saturday activity level</label>
                        <ActivityLevelSelector calorieExpenditure={this.props.calorieExpenditureSchedule.Saturday}/>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Sunday-activity-level">Sunday activity level</label>
                        <ActivityLevelSelector calorieExpenditure={this.props.calorieExpenditureSchedule.Sunday}/>
                    </div>
                </div>
            </div>
        )
    }
}

interface IReefeedProperties {
    refeedSchedule: models.IRefeedSchedule;
}

class RefeedInput extends React.Component<IReefeedProperties, any> {
    render() {
        return (
            <div>
                <div className="row">
                    <h3>Refeeds</h3>

                    <p>It is a good idea to schedule refeeds into any diet plan. Refeeds are beneficial because they break up
                the monotony of dieting, allow glycogen replenishment, raise your metabolic rate and normalize hormone
                levels.
                    </p>

                    <p>The leaner you are, the more important refeeds become. For people above 12% bodyfat, one refeed per week
                is sufficient. From 8% to 12%, two refeeds per week is generally advisable. Below 8% bodyfat, three
                refeeds per week is recommended.
                    </p>

                    <p>Generally, it is a good idea to schedule refeeds on workout days. If you work out more than three times
                per week, you should schedule refeeds to coincide with your highest volume workouts.
                    </p>
                    <label>Refeed days</label>
                </div>
                <div className="row">
                    <RefeedDayInput day={models.Weekday.Monday} refeedSchedule={this.props.refeedSchedule}/>
                    <RefeedDayInput day={models.Weekday.Tuesday} refeedSchedule={this.props.refeedSchedule}/>
                    <RefeedDayInput day={models.Weekday.Wednesday} refeedSchedule={this.props.refeedSchedule}/>
                    <RefeedDayInput day={models.Weekday.Thursday} refeedSchedule={this.props.refeedSchedule}/>
                    <RefeedDayInput day={models.Weekday.Friday} refeedSchedule={this.props.refeedSchedule}/>
                    <RefeedDayInput day={models.Weekday.Saturday} refeedSchedule={this.props.refeedSchedule}/>
                    <RefeedDayInput day={models.Weekday.Sunday} refeedSchedule={this.props.refeedSchedule}/>
                </div>
            </div>
        )
    }
}

interface IRefeedDayProperties {
    refeedSchedule: models.IRefeedSchedule;
    day: models.Weekday;
}

class RefeedDayInput extends React.Component<IRefeedDayProperties, any> {
    private toggleRefeed(day) {
        if (this.props.refeedSchedule[day]) {
            delete this.props.refeedSchedule[day];
        } else {
            this.props.refeedSchedule[day] = 1.05;
        }
    }

    render() {
        let day = models.Weekday[this.props.day];
        return (
            <div className="col-xs-3">
                <label className="checkbox-inline">
                    <input checked={this.props.refeedSchedule[day]}
                           onChange={() => this.toggleRefeed(day)}
                           type="checkbox"/>
                    {day}
                </label>
            </div>
        )
    }
}


interface IDietPlanTableProperties {
    days: models.DietDay[];
}

class DietPlanTable extends React.Component<IDietPlanTableProperties, any> {
    private transformDietDay(dietDay: models.DietDay, i: number) {
        return <DietPlanTableEntry energyExpenditure={dietDay.energyExpenditure}
                                   calorieIntake={dietDay.calorieIntake}
                                   weight={dietDay.bodyComposition.weight}
                                   leanMass={dietDay.bodyComposition.leanMass}
                                   fatMass={dietDay.bodyComposition.fatMass}
                                   bodyFatPercent={dietDay.bodyComposition.fatPercent()}/>
    }

    render() {
        return (
            <div>
                <hr/>
                <div className="row">
                    <h3>Diet plan</h3>
                </div>
            <div className="row">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <td>Daily energy expenditure</td>
                            <td>Daily calorie intake</td>
                            <td>Weight</td>
                            <td>Lean mass</td>
                            <td>Fat mass</td>
                            <td>Body fat percent</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.days.map(this.transformDietDay)}
                    </tbody>
                </table>
            </div>
                </div>
        )
    }
}

interface IDietPlanTableEntryProperties {
    energyExpenditure: number;
    calorieIntake: number;
    weight: number;
    leanMass: number;
    fatMass: number;
    bodyFatPercent: number;
}

class DietPlanTableEntry extends React.Component<IDietPlanTableEntryProperties, any> {

    private round(number: number): number {
        return Math.round(number * 100) / 100;
    }

    render() {
        return (
            <tr>
                <td>{ this.round(this.props.energyExpenditure) }</td>
                <td>{ this.round(this.props.calorieIntake) }</td>
                <td>{ this.round(this.props.weight) }</td>
                <td>{ this.round(this.props.leanMass) }</td>
                <td>{ this.round(this.props.fatMass) }</td>
                <td>{ this.round(this.props.bodyFatPercent) }</td>
            </tr>
        )
    }
}