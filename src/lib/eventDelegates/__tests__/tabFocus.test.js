'use strict';

var eventDelegateInjector = require('inject!../tabFocus');
var visibilityApi = require('../../helpers/visibilityApi');
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
  helperStubs: {
    'dtm/helpers/visibility-api': visibilityApi
  }
});
var delegate = eventDelegateInjector({
  'get-extension': publicRequire('get-extension'),
  once: publicRequire('once'),
  document: mockDocument
});


describe('tabfocus event type', function() {
  it('triggers rule when the tabfocus event occurs', function() {
    var trigger = jasmine.createSpy();

    delegate({}, trigger);

    expect(trigger.calls.count()).toBe(0);

    mockDocument[visibilityApiInstance.hiddenProperty] = false;
    visibilityChangeListener.call(location);

    expect(trigger.calls.count()).toBe(1);
    var call = trigger.calls.mostRecent();
    expect(call.args[0]).toBe(mockDocument.location);
    expect(call.args[1].type).toBe('tabfocus');
    expect(call.args[1].target).toBe(mockDocument);
  });
});
