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

var testStandardEvent = require('./helpers/testStandardEvent');
const createClickDelegate = require('../click');

var getClickEvent = function () {
  var event;

  if (
    navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.appVersion.indexOf('Trident/') > 0
  ) {
    event = document.createEvent('MouseEvent');
    event.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
  } else {
    event = new MouseEvent('click');
  }

  return event;
};

describe('click event delegate', function () {
  var mockWindow = {};
  var delegate;

  beforeEach(function () {
    delegate = createClickDelegate(mockWindow);
  });

  afterEach(function () {
    resetTurbineVariable();
  });

  testStandardEvent(function () {
    return delegate;
  }, 'click');

  describe('anchor delay', function () {
    var INITIAL_LOCATION = 'http://clicktests.com/';
    var LINK_LOCATION = 'http://example.com/';
    var defaultPrevented;
    var link;
    var spanWithinLink;
    var triggerSpy;

    // Regardless of what we're testing, we can't let a simulated link click take us away
    // from the testing page. However, we also need to record if the default was prevented by
    // the delegate so we can assert on it within the tests.
    var clickHandler = function (event) {
      defaultPrevented = event.defaultPrevented;
      event.preventDefault();
    };

    beforeEach(function () {
      jasmine.clock().install();
      document.addEventListener('click', clickHandler);

      mockWindow.location = INITIAL_LOCATION;
      mockWindow.top = mockWindow;
      mockWindow.name = 'myWindow';

      defaultPrevented = false;

      link = document.createElement('a');
      link.href = 'http://example.com/';

      spanWithinLink = document.createElement('span');
      link.appendChild(spanWithinLink);

      document.body.appendChild(link);

      triggerSpy = jasmine.createSpy('trigger');
    });

    afterEach(function () {
      document.body.removeChild(link);

      // Without resetting between tests, the delegate would continue watching for and taking
      // action on click events from prior tests.
      delegate.__reset();

      jasmine.clock().uninstall();
      document.removeEventListener('click', clickHandler);
    });

    it('delays navigation by a custom delay when link is clicked', function () {
      delegate(
        {
          anchorDelay: 3000
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(true);
      jasmine.clock().tick(2999);
      expect(mockWindow.location).toEqual(INITIAL_LOCATION);
      jasmine.clock().tick(1);
      expect(mockWindow.location).toEqual(LINK_LOCATION);
    });

    it('delays navigation by a custom delay when link descendant clicked', function () {
      delegate(
        {
          anchorDelay: 3000
        },
        triggerSpy
      );

      spanWithinLink.click();

      expect(defaultPrevented).toBe(true);
      jasmine.clock().tick(2999);
      expect(mockWindow.location).toEqual(INITIAL_LOCATION);
      jasmine.clock().tick(1);
      expect(mockWindow.location).toEqual(LINK_LOCATION);
    });

    it('does not delay navigation if no related rule runs', function () {
      delegate(
        {
          elementSelector: 'h2',
          anchorDelay: 100
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(false);
    });

    it('does not delay navigation if the element clicked on is not a link', function () {
      delegate(
        {
          anchorDelay: 100
        },
        triggerSpy
      );

      document.body.click();

      expect(defaultPrevented).toBe(false);
    });

    it('does not delay navigation if the link does not have an href', function () {
      link.removeAttribute('href');

      delegate(
        {
          anchorDelay: 100
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(false);
    });

    it('does not delay navigation if the link has target=_blank', function () {
      link.setAttribute('target', '_blank');

      delegate(
        {
          anchorDelay: 100
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(false);
    });

    it(
      'does not delay navigation if the link has target=_top and is' +
        ' within an iframe',
      function () {
        mockWindow.top = {};
        link.setAttribute('target', '_top');

        delegate(
          {
            anchorDelay: 100
          },
          triggerSpy
        );

        link.click();

        expect(defaultPrevented).toBe(false);
      }
    );

    it('does not delay navigation if the user is pressing down the ctrl key', function () {
      delegate(
        {
          anchorDelay: 3000
        },
        triggerSpy
      );

      var mouseEvent = new MouseEvent('click', {
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      });
      link.dispatchEvent(mouseEvent);

      expect(defaultPrevented).toBe(false);
    });

    it(
      'does not delay navigation if the user is pressing down the meta ' +
        '(windows or cmd) key',
      function () {
        delegate(
          {
            anchorDelay: 3000
          },
          triggerSpy
        );

        var mouseEvent = new MouseEvent('click', {
          metaKey: true,
          bubbles: true,
          cancelable: true
        });
        link.dispatchEvent(mouseEvent);

        expect(defaultPrevented).toBe(false);
      }
    );

    it(
      'does not delay navigation if the user initiates the click using the middle ' +
        'mouse button',
      function () {
        delegate(
          {
            anchorDelay: 3000
          },
          triggerSpy
        );

        var mouseEvent = new MouseEvent('click', {
          button: 2,
          bubbles: true,
          cancelable: true
        });
        link.dispatchEvent(mouseEvent);

        expect(defaultPrevented).toBe(false);
      }
    );

    it('delays navigation if the link has target=_top and is not within an iframe', function () {
      link.setAttribute('target', '_top');

      delegate(
        {
          anchorDelay: 100
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(true);
    });

    it('delays navigation if anchorDelay is a string', function () {
      link.setAttribute('target', '_top');

      delegate(
        {
          anchorDelay: '100'
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(true);
    });

    it('does not delay navigation if the link has target=_parent', function () {
      link.setAttribute('target', '_parent');

      delegate(
        {
          anchorDelay: 100
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(false);
    });

    it('delays navigation if the link has a target that is the window name', function () {
      link.setAttribute('target', 'myWindow');

      delegate(
        {
          anchorDelay: 100
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(true);
    });

    it('delays navigation if the link has a target that is not equal the window name', function () {
      link.setAttribute('target', 'otherWindow');

      delegate(
        {
          anchorDelay: 100
        },
        triggerSpy
      );

      link.click();

      expect(defaultPrevented).toBe(false);
    });

    it('ignores the fake events generated by AppMeasurement', function () {
      delegate(
        {
          bubbleFireIfParent: true,
          bubbleFireIfChildFired: true
        },
        triggerSpy
      );

      var event = getClickEvent();
      event['s_fe'] = 1;
      document.body.dispatchEvent(event);

      expect(triggerSpy.calls.count()).toBe(0);
    });
  });
});
