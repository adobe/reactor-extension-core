'use strict';

var Timer = require('../timer');

describe('timer', function() {
  beforeEach(function() {
    jasmine.clock().install();

    var baseTime = new Date(2013, 9, 23);
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
    it('the callback is called', function() {
      var callback = jasmine.createSpy('onTimePassedCallback');
      var timer = new Timer([50], callback);
      timer.start();
      jasmine.clock().tick(1000);

      expect(callback).toHaveBeenCalledWith(50);
    });

    it('the callback is called once per each marker', function() {
      var callback = jasmine.createSpy('onTimePassedCallback');
      var timer = new Timer([1000, 2000], callback);
      timer.start();
      jasmine.clock().tick(1000);
      jasmine.clock().tick(1000);

      expect(callback).toHaveBeenCalledWith(1000);
      expect(callback).toHaveBeenCalledWith(2000);
      expect(callback.calls.count()).toEqual(2);
    });
  });
});
