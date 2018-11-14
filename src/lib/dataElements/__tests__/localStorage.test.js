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

describe('local storage data element delegate', function() {
  it('returns the value of a local storage item', function() {
    var mockWindow = {
      localStorage: {
        getItem: jasmine.createSpy().and.returnValue('bar')
      }
    };

    var dataElementDelegate = require('inject-loader!../localStorage')({
      '@adobe/reactor-window': mockWindow
    });

    var settings = {
      name: 'foo'
    };

    expect(dataElementDelegate(settings)).toBe('bar');
    expect(mockWindow.localStorage.getItem).toHaveBeenCalledWith('foo');
  });

  it('returns null if local storage item is not set', function() {
    var mockWindow = {
      localStorage: {
        getItem: jasmine.createSpy().and.returnValue(null)
      }
    };

    var dataElementDelegate = require('inject-loader!../localStorage')({
      '@adobe/reactor-window': mockWindow
    });

    var settings = {
      name: 'foo'
    };

    expect(dataElementDelegate(settings)).toBe(null);
    expect(mockWindow.localStorage.getItem).toHaveBeenCalledWith('foo');
  });

  it('returns null if error is thrown (like when local storage is disabled in safari)', function() {
    var dataElementDelegate = require('inject-loader!../localStorage')({
      '@adobe/reactor-window': {}
    });

    var settings = {
      name: 'foo'
    };

    expect(dataElementDelegate(settings)).toBe(null);
  });
});
