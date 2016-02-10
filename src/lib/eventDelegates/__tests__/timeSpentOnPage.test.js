'use strict';

var eventDelegateInjector = require('inject!../timeSpentOnPage');
var Timer = require('../../resources/timer');
var visibilityApi = require('../../resources/visibilityApi');
var visibilityApiInstance = visibilityApi();
var visibilityChangeListener;

var mockDocument = {
  location: 'somelocation',
  addEventListener: function(event, listener) {
    if (event && event === visibilityApiInstance.visibilityChangeEventType) {
      visibilityChangeListener = listener;
    }
  }
};

var publicRequire = require('../../__tests__/helpers/stubPublicRequire')({
  resourceStubs: {
    'dtm.visibilityApi': visibilityApi,
    'dtm.timer': Timer
  }
});

var delegate = eventDelegateInjector({
  resourceProvider: publicRequire('resourceProvider'),
  once: publicRequire('once'),
  document: mockDocument
});


describe('time spent on page event type', function() {
  beforeEach(function() {
    jasmine.clock().install();

    var baseTime = new Date(2013, 9, 23);
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

  it('stops the timer on tab blur', function() {;
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
