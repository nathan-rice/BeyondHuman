/// <reference path="./react/react.d.ts"/>
/// <reference path="./react/react-global.d.ts"/>

import models = require("./models");

export class DietPlannerApp extends React.Component<any, any> {
    render() {
        return (
            <div className="container">
                <form>
                    <div className="row">
                        <div className="form-group">
                            <label>Diet duration
                                <input type="number" className="form-control" id="diet-duration"/>
                            </label>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <h3>Tell us a bit about yourself</h3>
                    </div>
                    <MuscleGainInput/>
                    <hr/>
                    <BodyFatEstimationInput/>
                    <hr/>
                    <CalorieExpenditureInput/>
                    <hr/>
                    <label>Mass preservation coefficient
                        <input type="range" value="1" step="0.1" min="0.5" max="1.5" className="form-control"/>
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
                                       id="exercise-calorie-expenditure"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="weekly-exercise-sessions">Weekly fasted exercise sessions</label>
                                <input type="number" className="form-control" id="weekly-exercise-sessions"/>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <RefeedInput/>
                    <button>Compute</button>
                </form>
            </div>
        )
    }
}

interface IWeightHeightProperties {
    weight?: number;
    height?: number;
}

class WeightHeightInput extends React.Component<IWeightHeightProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="body-weight">Body weight (lbs)</label>
                        <input type="number" step="0.01" className="form-control" id="body-weight"/>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="height">Height (inches)</label>
                        <input type="number" step="0.01" className="form-control" id="height"/>
                    </div>
                </div>
            </div>
        )
    }
}

interface IMuscleGainProperties {
    ankle?: number;
    wrist?: number;
    height?: number;
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
                            <input type="number" step="0.01" className="form-control" id="wrist"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="ankle">Ankle circumference (inches)</label>
                            <input type="number" step="0.01" className="form-control" id="ankle"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

interface IBodyFatEstimationProperties {
    bodyFatMethod?: string;
}

class BodyFatEstimationInput extends React.Component<IBodyFatEstimationProperties, any> {
    
    
    constructor() {
        this.onChange = this.onChange.bind(this);
        this.state = {};
        super();
    }

    onChange(event) {
        if (event.target.value == "direct") {
            this.setState({bodyFatEstimator: <DirectBodyFatInput />});
        } else if (event.target.value == "navy") {
            this.setState({bodyFatEstimator: <NavyBodyFatInput />});
        } else if (event.target.value == "skinfold") {
            this.setState({bodyFatEstimator: <SkinfoldBodyFatInput />});
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
                            <input type="radio" value="direct" onChange={this.onChange}/>
                            I will provide my body fat percent
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="navy" onChange={this.onChange}/>
                            Estimate my body fat percent using my abdomen and neck circumference
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="skinfold" onChange={this.onChange}/>
                            Estimate my body fat percent using caliper skin-fold measurements
                        </label>
                    </div>
                </div>
                {this.state.bodyFatEstimator}
            </div>
        )
    }
}

interface IDirectBodyFatProperties {
    bodyFatPercentage?: number;
}

class DirectBodyFatInput extends React.Component<IDirectBodyFatProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="body-fat-percentage">Body fat (%)</label>
                        <input type="number" step="0.01" className="form-control" id="body-fat-percentage"/>
                    </div>
                </div>
            </div>
        )
    }
}

interface INavyBodyFatProperties {
    abdomen?: number;
    neck?: number;
}

class NavyBodyFatInput extends React.Component<INavyBodyFatProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="abdomen">Abdomen circumference inches</label>
                        <input type="number" step="0.01" className="form-control" id="abdomen"/>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="neck">Neck circumference inches</label>
                        <input type="number" step="0.01" className="form-control" id="neck"/>
                    </div>
                </div>
            </div>
        )
    }
}

interface ISkinfoldBodyFatProperties {
    chest?: number;
    abdomen?: number;
    thigh?: number;
}

class SkinfoldBodyFatInput extends React.Component<ISkinfoldBodyFatProperties, any> {
    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="skinfold-chest">Chest skin-fold measurement (mm)</label>
                        <input type="number" step="0.01" className="form-control" id="skinfold-chest"/>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="skinfold-abdomen">Abdomen skin-fold measurement (mm)</label>
                        <input type="number" step="0.01" className="form-control" id="skinfold-abdomen"/>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="skinfold-thigh">Thigh skin-fold measurement (mm)</label>
                        <input type="number" step="0.01" className="form-control" id="skinfold-thigh"/>
                    </div>
                </div>
            </div>
        )
    }
}

interface ICalorieExpenditureProperties {
    maintenanceCalories?: number;
    activityLevel?: number;
}

class CalorieExpenditureInput extends React.Component<ICalorieExpenditureProperties, any> {
    
    constructor() {
        this.onChange = this.onChange.bind(this);
        this.state = {};
        super();
    }

    onChange(event) {
        if (event.target.value == 'direct') {
            this.setState({calorieExpenditureEstimator: <DirectCalorieExpenditureInput/>});
        } else if (event.target.value == 'weekly-activity') {
            this.setState({calorieExpenditureEstimator: <WeeklyActivityInput/>});
        } else if (event.target.value == 'daily-activity') {
            this.setState({calorieExpenditureEstimator: <DailyActivityInput/>});
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
                            <input type="radio" value="direct" onChange={this.onChange}/>
                            Use empirically determined total daily energy expenditure
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="weekly-activity" onChange={this.onChange}/>
                            Estimate my basal metabolic rate and use a weekly activity level
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="daily-activity" onChange={this.onChange}/>
                            Estimate my basal metabolic rate and use daily activity levels
                        </label>
                    </div>
                </div>
                {this.state.calorieExpenditureEstimator}
            </div>
        )
    }
}

interface IDirectCalorieExpenditureProperties {
    maintenanceCalories?: number;
}

class DirectCalorieExpenditureInput extends React.Component<IDirectCalorieExpenditureProperties, any> {
    
    constructor() {
        this.onChange = this.onChange.bind(this);
        this.state = {};
        super();
    }

    onChange(event) {
        this.setState({maintenanceCalories: parseInt(event.target.value)});
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="maintenance-calories">Maintenance calories</label>
                        <input type="number" className="form-control" id="maintenance-calories"
                               onChange={this.onChange}/>
                    </div>
                </div>
            </div>
        )
    }
}

interface IWeeklyActivityProperties {
    activityLevel?: number;
}

function activityLevelSelector(id, onChange, value = "1.2") {
    return (
        <select className="form-control" value={value} id={id} onChange={onChange}>
            <option value="1.2">Primarily seated</option>
            <option value="1.375">Moderate standing/light movement</option>
            <option value="1.55">Primarily standing/frequent movement</option>
            <option value="1.725">Manual labor (light lifting/carrying)</option>
            <option value="1.9">Manual labor (heavy lifting/carrying)</option>
        </select>
    )
}

class WeeklyActivityInput extends React.Component<IWeeklyActivityProperties, any> {
    
    constructor() {
        this.onChange = this.onChange.bind(this);
        this.state = {activityLevel: 1.2};
        super();
    }

    onChange(event) {
        this.setState({activityLevel: parseFloat(event.target.value)})
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="activity-level">Activity level</label>
                        {activityLevelSelector("activity-level", this.onChange)}
                    </div>
                </div>
            </div>
        )
    }
}

interface IDailyActivityProperties {
    Monday?: number;
    Tuesday?: number;
    Wednesday?: number;
    Thursday?: number;
    Friday?: number;
    Saturday?: number;
    Sunday?: number;
}

class DailyActivityInput extends React.Component<IDailyActivityProperties, any> {
    
    constructor() {
        this.onChange = this.onChange.bind(this);
        this.state = {};
        super();
    }

    onChange(event) {
        let day = event.target.id.split("-"), newState = {};
        newState[day] = parseFloat(event.target.value);
        this.setState(newState);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Monday-activity-level">Activity level</label>
                        {activityLevelSelector("Monday-activity-level", this.onChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Tuesday-activity-level">Activity level</label>
                        {activityLevelSelector("Tuesday-activity-level", this.onChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Wednesday-activity-level">Activity level</label>
                        {activityLevelSelector("Wednesday-activity-level", this.onChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Thursday-activity-level">Activity level</label>
                        {activityLevelSelector("Thursday-activity-level", this.onChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Friday-activity-level">Activity level</label>
                        {activityLevelSelector("Friday-activity-level", this.onChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Saturday-activity-level">Activity level</label>
                        {activityLevelSelector("Saturday-activity-level", this.onChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Sunday-activity-level">Activity level</label>
                        {activityLevelSelector("Sunday-activity-level", this.onChange)}
                    </div>
                </div>
            </div>
        )
    }
}

class RefeedInput extends React.Component<any, any> {
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
                    <div className="col-xs-3">
                        <label className="checkbox-inline"><input type="checkbox"/>Monday
                        </label>
                    </div>
                    <div className="col-xs-3">
                        <label className="checkbox-inline"><input type="checkbox"/>Tuesday
                        </label>
                    </div>
                    <div className="col-xs-3">
                        <label className="checkbox-inline"><input type="checkbox"/>Wednesday
                        </label>
                    </div>
                    <div className="col-xs-3">
                        <label className="checkbox-inline"><input type="checkbox"/>Thursday
                        </label>
                    </div>
                    <div className="col-xs-3">
                        <label className="checkbox-inline"><input type="checkbox"/>Friday
                        </label>
                    </div>
                    <div className="col-xs-3">
                        <label className="checkbox-inline"><input type="checkbox"/>Saturday
                        </label>
                    </div>
                    <div className="col-xs-3">
                        <label className="checkbox-inline"><input type="checkbox"/>Sunday
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

interface IDietPlanTableState {
    rows: models.DietDay[];
}

class DietPlanTable extends React.Component<any, IDietPlanTableState> {
    transformDietDay(dietDay:models.DietDay, i:number) {
        return <DietPlanTableEntry energyExpenditure={dietDay.energyExpenditure}
                                   calorieIntake={dietDay.calorieIntake}
                                   weight={dietDay.bodyComposition.weight}
                                   leanMass={dietDay.bodyComposition.leanMass}
                                   fatMass={dietDay.bodyComposition.fatMass}
                                   bodyFatPercent={dietDay.bodyComposition.fatPercent()}/>
    }

    render() {
        return (
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
                        {this.state.rows.map(this.transformDietDay)}
                    </tbody>
                </table>
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

    private round(number:number):number {
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