'use strict';

var publicRequire = require('../../__tests__/helpers/publicRequire');

var visibilityApi = require('../../helpers/visibilityApi');
var visibilityApiInstance = visibilityApi();
var visibilityChangeListener;

var mockDocument = {
  addEventListener: function(event, listener) {
    if (event && event === visibilityApiInstance.visibilityChangeEventType) {
      visibilityChangeListener = listener;
    }
  }
};

var TimerInjector = require('inject!../../helpers/timer');
var Timer = TimerInjector({
  'event-emitter': publicRequire('event-emitter')
});

var eventDelegateInjector = require('inject!../timeSpentOnPage');
var delegate = eventDelegateInjector({
  once: publicRequire('once'),
  '../helpers/timer.js': Timer,
  document: mockDocument
});

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
    expect(call.args[1].type).toBe('timepassed(2)');
    expect(call.args[1].target).toBe(mockDocument);
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
