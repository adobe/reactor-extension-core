'use strict';

var decorateCodeInjector = require('inject!../decorateCode');
var decorateCode = decorateCodeInjector({
  'get-var': function() {
    return 'data-element-value';
  },
  'is-var': function() {
    return true;
  }
});

describe('decorate code', function() {
  it('decorates javascript action', function() {
    var settings = {
      language: 'javascript',
      source: 'console.log("logging")'
    };

    var decoratedCode = decorateCode({
      settings: settings,
      event: {},
      relatedElement: {}
    }, settings.source);

    expect(decoratedCode).toBe(
      '<script>_satellite["__runScript1"]' +
      '(function(event, target) {console.log("logging")});' +
      '</script>'
    );
  });

  it('sends the event and target to the random generated method for a javascript action',
    function() {
      var event = {};
      var relatedElement = {};
      var settings = {
        language: 'javascript',
        source: 'console.log("logging")'
      };
      var spy = jasmine.createSpy('fn');

      decorateCode({
        settings: settings,
        event: event,
        relatedElement: relatedElement
      }, settings.source);

      _satellite['__runScript2'](spy);

      expect(spy).toHaveBeenCalledWith(event, relatedElement);
    });

  it('clears the random generated method for a javascript action after its execution',
    function() {
      var settings = {
        language: 'javascript',
        source: 'console.log("logging")'
      };

      decorateCode({
        settings: settings,
        event: {},
        relatedElement: {}
      }, settings.source);


      expect(_satellite['__runScript3']).toBeDefined();
      _satellite['__runScript3'](function() {});
      expect(_satellite['__runScript3']).not.toBeDefined();
    });


  it('decorates global javascript action', function() {
    var settings = {
      language: 'javascript',
      global: true,
      source: 'console.log("logging")'
    };

    var decoratedCode = decorateCode({
      settings: settings,
      event: {},
      relatedElement: {}
    }, settings.source);

    expect(decoratedCode).toBe('<script>console.log("logging")</script>');
  });

  it('decorates html action', function() {
    var settings = {
      language: 'html',
      global: true,
      source: '<script>console.log("logging")</script>'
    };

    var decoratedCode = decorateCode({
      settings: settings,
      event: {},
      relatedElement: {}
    }, settings.source);

    expect(decoratedCode).toBe('<script>console.log("logging")</script>');
  });

  it('replaces data element tokens from inside an html action', function() {
    var settings = {
      language: 'html',
      global: true,
      source: '<div>%productname%</div>'
    };

    var decoratedCode = decorateCode({
      settings: settings,
      event: {},
      relatedElement: {}
    }, settings.source);

    expect(decoratedCode).toBe('<div>data-element-value</div>');
  });
});
