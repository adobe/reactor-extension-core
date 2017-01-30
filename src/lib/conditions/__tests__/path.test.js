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

var mockDocument = {
  location: {
    pathname: '/foo/bar.html',
    search: '?mmm=bacon'
  }
};

var conditionDelegateInjector = require('inject!../path');
var conditionDelegate = conditionDelegateInjector({
  '@turbine/document': mockDocument
});

describe('path condition delegate', function() {
  it('returns true when the path matches an acceptable string', function() {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '/foo/bar.html?mmm=bacon'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the path does not match an acceptable string', function() {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: 'hotdogs.html?mmm=bacon'
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });

  it('returns true when the path matches an acceptable regex', function() {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '\\/Foo\\/bar.*',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(true);
  });

  it('returns false when the path does not match an acceptable regex', function() {
    var settings = {
      paths: [
        {
          value: 'snowcones.html'
        },
        {
          value: '/index.*',
          valueIsRegex: true
        }
      ]
    };
    expect(conditionDelegate(settings)).toBe(false);
  });
});
