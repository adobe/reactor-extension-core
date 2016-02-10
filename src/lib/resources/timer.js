'use strict';
var CHECK_INTERVAL = 1000;

/**
 * Track the time passed since an initial moment in time.
 *
 * @param {Array} markers A list of time markers.
 * @param {Function} callback A callback that will be triggered whenever the timer surpasses a
 * time marker.
 * @param {Number} checkInterval Then interval when the class will update it's counted time.
 * @constructor
 */
var Timer = function(markers, callback, checkInterval) {
  this._total = 0;
  this._checkInterval = checkInterval || CHECK_INTERVAL;
  this._intervalId = null;

  this._markers = markers || [];
  this._onTimePassedCallback = callback || null;
};

Timer.prototype = {
  start: function() {
    this.resume();
  },

  resume: function() {
    this._setIntervalUpdater();
    this._startNewInternalTimer();
  },

  pause: function() {
    this._removeIntervalUpdater();
    this._calculateTimePassed();
    this._stopInternalTimer();
  },

  getTime: function() {
    return this._total;
  },

  addMarker: function(marker) {
    this._markers.push(marker);
  },

  _setIntervalUpdater: function() {
    this._intervalId =
      window.setInterval(this._calculateTimePassed.bind(this), this._checkInterval);
  },

  _removeIntervalUpdater: function() {
    window.clearInterval(this._intervalId);
  },

  _startNewInternalTimer: function() {
    this._startTime = new Date().getTime();
  },

  _stopInternalTimer: function() {
    this._startTime = null;
  },

  _calculateTimePassed: function() {
    this._total += new Date().getTime() - this._startTime;
    this._checkMarkersCompleted();
    this._startNewInternalTimer();
  },

  _checkMarkersCompleted: function() {
    var newMarkers = [];
    var timePassed =  this.getTime();

    for (var i = 0, l = this._markers.length; i < l; i++) {
      if (timePassed >= this._markers[i] * 1000) {
        this._onTimePassedCallback(this._markers[i]);
      } else {
        newMarkers.push(this._markers[i]);
      }
    }

    this._markers = newMarkers;
  }
};

module.exports = Timer;
