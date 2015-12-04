/// <reference path="./react/react.d.ts"/>
/// <reference path="./react/react-global.d.ts"/>

import components = require('./components');

var el = document.getElementById("body");
ReactDOM.render(<components.DietPlannerApp/>, el);