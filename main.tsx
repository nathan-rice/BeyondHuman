/// <reference path="client/definitions/react/react.d.ts"/>
/// <reference path="client/definitions/react/react-global.d.ts"/>

import components = require('./client/components');

var el = document.getElementById("body");
ReactDOM.render(<components.DietPlannerApp/>, el);