'use strict';

var publicRequire = require('../../__tests__/helpers/stubPublicRequire')();
var Timer = publicRequire('get-extension')('dtm').getHelper('timer');

describe('timer', function() {
  beforeEach(function() {
    jasmine.clock().install();

    var baseTime = new Date();
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('updates the tracked time every 1s', function() {
    var timer = new Timer();
    timer.start();
    jasmine.clock().tick(1000);

    expect(timer.getTime()).toBe(1000);
  });

  describe('when paused', function() {
    it('updates the track time until that moment', function() {
      var timer = new Timer();
      timer.start();
      jasmine.clock().tick(400);
      timer.pause();

      expect(timer.getTime()).toBe(400);
    });

    it('stops updating the tracked time', function() {
      var timer = new Timer();
      timer.start();
      jasmine.clock().tick(200);
      timer.pause();
      jasmine.clock().tick(400);

      expect(timer.getTime()).toBe(200);
    });
  });

  describe('when resumed', function() {
    it('it counts the time starting from that moment', function() {
      var timer = new Timer();
      timer.start();
      jasmine.clock().tick(400);
      timer.pause();
      jasmine.clock().tick(100);
      timer.resume();
      jasmine.clock().tick(3000);

      expect(timer.getTime()).toBe(3400);
    });
  });

  describe('when markers are provided', function() {
    it('an markerPassed event is emitted', function() {
      var callback = jasmine.createSpy('onTimePassedCallback');
      var timer = new Timer();
      timer.on('markerPassed', callback);
      timer.addMarker(5000);
      timer.start();

      jasmine.clock().tick(6000);

      expect(callback).toHaveBeenCalledWith(5000);
    });

    it('the markerPassed event is emitted once per each marker', function() {
      var callback = jasmine.createSpy('onTimePassedCallback');
      var timer = new Timer();
      timer.on('markerPassed', callback);
      timer.addMarker(1000);
      timer.addMarker(2000);
      timer.start();

      jasmine.clock().tick(1000);
      jasmine.clock().tick(1000);

      // The emitters listeners are called using `setTimeout(listener, 0);`. We need this extra
      // `tick` call to ensure the listener is called the second time (otherwise, the listener will
      // be called after the test is completed). The `1000` value of the tick will also insure that
      // no extra calls will be made.
      jasmine.clock().tick(1000);

      expect(callback).toHaveBeenCalledWith(1000);
      expect(callback).toHaveBeenCalledWith(2000);
      expect(callback.calls.count()).toEqual(2);
    });

    it('no marker will be called twice', function() {
      var callback = jasmine.createSpy('onTimePassedCallback');
      var timer = new Timer();
      timer.on('markerPassed', callback);
      timer.addMarker(5000);
      timer.addMarker(5000);
      timer.start();

      jasmine.clock().tick(6000);

      expect(callback.calls.count()).toEqual(1);
    });

    it('the markerPassed event will be emitted in ascending order', function() {
      var callback = jasmine.createSpy('onTimePassedCallback');
      var timer = new Timer();
      timer.on('markerPassed', callback);
      timer.addMarker(20);
      timer.addMarker(10);
      timer.start();

      jasmine.clock().tick(1000);

      // The emitters listeners are called using `setTimeout(listener, 0);`. We need this extra
      // `tick` call to ensure the listener is called the second time (otherwise, the listener will
      // be called after the test is completed).
      jasmine.clock().tick(0);

      var call = callback.calls.mostRecent();
      expect(call.args[0]).toBe(20);
    });
  });
});
