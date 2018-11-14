'use strict';

// This allows us to mock the turbine free variable in our tests. This is the turbine object that
// extension library modules can access and is provided by turbine. Although turbine won't be on
// window when running in Launch, this seems to be the easiest way to simulate a free variable
// when testing.
window.mockTurbineVariable = function(turbine) {
  window.turbine = turbine;
};

window.resetTurbineVariable = function() {
  window.turbine = {};
};

window.resetTurbineVariable();
