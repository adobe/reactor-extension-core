// Mocked window & Turbine globals for the "production code exports".
window.turbine = jasmine.createSpy('turbine');
window._satellite = jasmine.createSpy('_satellite');
const require = jasmine.createSpy('require'); // mock Turbine's public "require" function

// cleanup any changes to the "clean" global mocks before each test runs
beforeEach(() => {
  window.turbine = jasmine.createSpy('turbine');
  window._satellite = jasmine.createSpy('_satellite');
  require.calls.reset();
});
