'use strict';

var eventDelegateInjector = require('inject!../tabBlur');
var visibilityApi = require('../helpers/visibilityApi');
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

var delegate = eventDelegateInjector({
  document: mockDocument
});

var isIE = function() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
};

describe('tabblur event type', function() {
  if (!isIE () || isIE() > 9) {
    it('triggers rule when the tabblur event occurs', function() {
      var trigger = jasmine.createSpy();

      delegate({}, trigger);

      expect(trigger.calls.count()).toBe(0);

      mockDocument[visibilityApiInstance.hiddenProperty] = true;
      visibilityChangeListener.call(location);

      expect(trigger.calls.count()).toBe(1);
      var call = trigger.calls.mostRecent();
      expect(call.args[0]).toBe(mockDocument.location);
      expect(call.args[1].type).toBe('tabblur');
      expect(call.args[1].target).toBe(mockDocument);
    });
  }
});
