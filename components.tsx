/// <reference path="./react/react.d.ts"/>
/// <reference path="./react/react-global.d.ts"/>

interface IWeightHeightProperties {
    weight?: number;
    height?: number;
}

export class WeightHeightInput extends React.Component<IWeightHeightProperties, any> {
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

export class MuscleGainInput extends React.Component<IMuscleGainProperties, any> {
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

export class BodyFatEstimationInput extends React.Component<IBodyFatEstimationProperties, any> {
    getInitialState() {
        return {};
    }

    handleChange(event) {
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
                            <input type="radio" value="direct" onChange={this.handleChange}/>
                            I will provide my body fat percent
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="navy" onChange={this.handleChange}/>
                            Estimate my body fat percent using my abdomen and neck circumference
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="skinfold" onChange={this.handleChange}/>
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
    handleChange(event) {
        if (event.target.value == 'direct') {
            this.setState({calorieExpenditureEstimator: <DirectCalorieExpenditureInput/>});
        } else if (event.target.value == 'weekly-activity') {
            this.setState({calorieExpenditureEstimator: <WeeklyActivityInput/>});
        } else if (event.target.value == 'daily-activity') {
            this.setState({calorieExpenditureEstimator: <DailyActivityInput/>});
        }
    }

    getInitialState() {
        return {}
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
                            <input type="radio" value="direct" onChange={this.handleChange}/>
                            Use empirically determined total daily energy expenditure
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="weekly-activity" onChange={this.handleChange}/>
                            Estimate my basal metabolic rate and use a weekly activity level
                        </label>
                    </div>
                    <div className="radio">
                        <label>
                            <input type="radio" value="daily-activity" onChange={this.handleChange}/>
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
    getInitialState() {
        return {}
    }

    handleChange(event) {
        this.setState({maintenanceCalories: parseInt(event.target.value)});
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="maintenance-calories">Maintenance calories</label>
                        <input type="number" className="form-control" id="maintenance-calories" onChange={this.handleChange}/>
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
    initialState() {
        return {activityLevel: 1.2}
    }

    handleChange(event) {
        this.setState({activityLevel: parseFloat(event.target.value)})
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="activity-level">Occupational activity level</label>
                        {activityLevelSelector("activity-level", this.handleChange)}
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
    initialState() {
        return {}
    }

    handleChange(event) {
        let day = event.target.id.split("-"), newState = {};
        newState[day] = parseFloat(event.target.value);
        this.setState(newState);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Monday-activity-level">Occupational activity level</label>
                        {activityLevelSelector("Monday-activity-level", this.handleChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Tuesday-activity-level">Occupational activity level</label>
                        {activityLevelSelector("Tuesday-activity-level", this.handleChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Wednesday-activity-level">Occupational activity level</label>
                        {activityLevelSelector("Wednesday-activity-level", this.handleChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Thursday-activity-level">Occupational activity level</label>
                        {activityLevelSelector("Thursday-activity-level", this.handleChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Friday-activity-level">Occupational activity level</label>
                        {activityLevelSelector("Friday-activity-level", this.handleChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Saturday-activity-level">Occupational activity level</label>
                        {activityLevelSelector("Saturday-activity-level", this.handleChange)}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Sunday-activity-level">Occupational activity level</label>
                        {activityLevelSelector("Sunday-activity-level", this.handleChange)}
                    </div>
                </div>
            </div>
        )
    }
}