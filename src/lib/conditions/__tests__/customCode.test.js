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

var conditionDelegate = require('../customCode');

describe('custom code condition delegate', function() {
  it('should run a user-defined function', function() {
    var settings = {
      source: function() {
        return true;
      }
    };

    var event = {
      currentTarget: {},
      target: {}
    };

    var relatedElement = {};

    spyOn(settings, 'source').and.callThrough();
    conditionDelegate(settings, relatedElement, event);

    expect(settings.source.calls.first()).toEqual({
      object: relatedElement,
      args: [event, event.target],
      returnValue: true
    });
  });
});
