'use strict';
var visibilityApi = require('../../resources/visibilityApi');
var visibilityApiInstance = visibilityApi();
var visibilityChangeListener;

var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();

var mockDocument = {
  addEventListener: function(event, listener) {
    if (event && event === visibilityApiInstance.visibilityChangeEventType) {
      visibilityChangeListener = listener;
    }
  }
};

var eventDelegateInjector = require('inject!../timeSpentOnPage');
var delegate = eventDelegateInjector({
  'get-extension': publicRequire('get-extension'),
  once: publicRequire('once'),
  document: mockDocument
});

var Timer = publicRequire('get-extension')('dtm').getResource('timer');

describe('time spent on page event type', function() {
  beforeEach(function() {
    jasmine.clock().install();

    var baseTime = new Date();
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('triggers rule', function() {
    var trigger = jasmine.createSpy('timeSpentOnPageTrigger');

    delegate({timeOnPage: 2}, trigger);
    jasmine.clock().tick(2000);

    var call = trigger.calls.mostRecent();
    expect(call.args[0].type).toBe('timepassed(2)');
    expect(call.args[0].target).toBe(mockDocument);
  });

  it('stops the timer on tab blur', function() {
    spyOn(Timer.prototype, 'pause');

    delegate({});

    mockDocument[visibilityApiInstance.hiddenProperty] = true;
    visibilityChangeListener.call(location);

    expect(Timer.prototype.pause).toHaveBeenCalled();
  });

  it('resumes the timer on tab focus', function() {
    spyOn(Timer.prototype, 'resume');

    delegate({});

    mockDocument[visibilityApiInstance.hiddenProperty] = false;
    visibilityChangeListener.call(location);

    expect(Timer.prototype.resume).toHaveBeenCalled();
  });
});
