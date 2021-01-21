/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';
var assign = require('@adobe/reactor-object-assign');
var mitt = require('../../../../node_modules/mitt/dist/mitt');

var CHECK_INTERVAL_MS = 1000;
var onlyUnique = function (value, index, self) {
  return self.indexOf(value) === index;
};

/**
 * Track the time passed since an initial moment in time.
 *
 * @param {number} [checkInterval] The interval (in milliseconds) at which the class will update
 * it's internal counter.
 * @constructor
 */
var Timer = function (checkInterval) {
  assign(this, mitt());

  this._total = 0;
  this._checkInterval = checkInterval || CHECK_INTERVAL_MS;
  this._intervalId = null;

  this._markers = [];
};

Timer.prototype = {
  start: function () {
    this.resume();
  },

  resume: function () {
    this._setIntervalUpdater();
    this._startNewInternalTimer();
  },

  pause: function () {
    this._removeIntervalUpdater();
    this._calculateTimePassed();
    this._stopInternalTimer();
  },

  getTime: function () {
    return this._total;
  },

  /**
   * Add new marker to be tracked by the timer. An event (`markedPassed`) will be triggered when
   * a marker is passed.
   *
   * @param {number} marker The marker number to be tracked (in milliseconds).
   */
  addMarker: function (marker) {
    this._markers.push(marker);
    this._markers = this._markers.filter(onlyUnique);
    this._markers.sort();
  },

  _setIntervalUpdater: function () {
    this._intervalId = window.setInterval(
      this._calculateTimePassed.bind(this),
      this._checkInterval
    );
  },

  _removeIntervalUpdater: function () {
    window.clearInterval(this._intervalId);
  },

  _startNewInternalTimer: function () {
    this._startTime = new Date().getTime();
  },

  _stopInternalTimer: function () {
    this._startTime = null;
  },

  _calculateTimePassed: function () {
    this._total += new Date().getTime() - this._startTime;
    this._checkMarkersCompleted();
    this._startNewInternalTimer();
  },

  _checkMarkersCompleted: function () {
    var timePassed = this.getTime();

    for (var i = 0; i < this._markers.length; i++) {
      var marker = this._markers[i];
      if (timePassed >= marker) {
        this.emit('markerPassed', marker);
        this._markers.splice(i, 1);
        i -= 1;
      }
    }
  }
};

module.exports = Timer;
