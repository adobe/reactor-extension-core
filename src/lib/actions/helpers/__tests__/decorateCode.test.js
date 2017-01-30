/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var decorateCodeInjector = require('inject!../decorateCode');
var decorateCode = decorateCodeInjector({
  '@turbine/replace-tokens': function(token) {
    return token.replace(/%(.+?)%/g, function(token, variableName) {
      return 'replaced - ' + variableName;
    });
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

  it('does not replace data element tokens for an embedded html action', function() {
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

    expect(decoratedCode).toBe('<div>%productname%</div>');
  });


  it('does not replace data element tokens for an embedded html action', function() {
    var settings = {
      language: 'html',
      global: true,
      source: '<div>productname</div>'
    };

    var replaceTokensSpy = jasmine.createSpy('replace-tokens');

    var decorateCode = decorateCodeInjector({
      'replace-tokens': replaceTokensSpy
    });

    decorateCode({
      settings: settings,
      event: {},
      relatedElement: {}
    }, settings.source);

    expect(replaceTokensSpy).not.toHaveBeenCalled();
  });

  it('does replace data element tokens for an html action loaded from a file', function() {
    var settings = {
      language: 'html',
      global: true,
      source: 'url1',
      isExternal: true
    };

    var decoratedAction = decorateCode({
      settings: settings,
      event: {},
      relatedElement: {}
    }, '<div>%productname%</div>');

    expect(decoratedAction).toBe('<div>replaced - productname</div>');
  });
});
