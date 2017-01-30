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

/**
 * Modifies a weakmap so that when get() is called with a key for which no entry is found,
 * a default value will be stored and then returned for the key.
 * @param {Object} weakMap The WeakMap instance to modify.
 * @param {Function} defaultValueFactory A function that returns the default value that should
 * be used.
 */
module.exports = function(weakMap, defaultValueFactory) {
  var originalGet = weakMap.get;

  weakMap.get = function(key) {
    if (!weakMap.has(key)) {
      weakMap.set(key, defaultValueFactory());
    }

    return originalGet.apply(this, arguments);
  };

  return weakMap;
};
