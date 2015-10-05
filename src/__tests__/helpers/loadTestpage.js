'use strict';

(function() {
  /**
   * We have to deliver a new instance of the jasmine clock because jasmine.clock is already tied
   * to this window's globals and not the iframe's window's globals. For this we create
   * a special jasmine instance that overrides the clock method but inherits the rest of the
   * this window's jasmine object.
   * @param iframeWindow The iframe's window object.
   * @constructor
   */
  var IFrameJasmine = function(iframeWindow) {
    var _clock = new jasmine.Clock(
      iframeWindow,
      function() {
        return new jasmine.DelayedFunctionScheduler();
      },
      new jasmine.MockDate(iframeWindow));
    this.clock = function() {
      return _clock;
    };
  };

  IFrameJasmine.prototype = jasmine;

  var bustCache = function(url) {
    var cacheBustSeparator = url.indexOf('?') !== -1 ? '&' : '?';
    return url + cacheBustSeparator + 'cachebust=' + Date.now();
  };

  var loadIframe = function(url) {
    var iframe = document.createElement('iframe');
    iframe.style.width = '600px';
    iframe.style.height = '400px';
    iframe.style.border = '1px solid #888';

    // Don't cache bust if we're using the Karma debug page. Using the cachebusting when
    // debugging makes it difficult to work with breakpoints.
    if (document.location.pathname.indexOf('debug.html') === -1) {
      url = bustCache(url);
    }

    iframe.src = url;
    document.body.appendChild(iframe);
    return iframe;
  };

  var eraseLocalStorageConfig = function() {
    if (!window.localStorage) {
      return;
    }

    localStorage.removeItem('sdsat_debug');
    localStorage.removeItem('sdsat_hide_activity');
  };

  /**
   * Run a test page within an iframe.
   * @param {string} path The path of the test page. May be absolute or relative.
   * @param {Object} [testConfig] An object to set on the iframe window object. This can
   * be used to configure a test in the iframe.
   * @param {boolean} [focus] If true, only this test will run and no other tests.
   */
  window.runTestPage = function(description, path, testConfig, focus) {
    var absolutePath;

    if (path.charAt(0) === '/') {
      absolutePath = '/base' + path;
    } else {
      var scripts = document.getElementsByTagName('script');
      var currentScriptPath = scripts[scripts.length - 1].src;
      var currentScriptDir = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1);
      absolutePath = currentScriptDir + path;
    }

    var runTest = function(done) {
      eraseLocalStorageConfig();

      var iframe = loadIframe(absolutePath);
      var iwin = iframe.contentWindow || iframe.contentDocument.defaultView;

      iwin.done = function() {
        //document.body.removeChild(iframe);
        done();
      };

      iwin.expect = expect;
      iwin.fail = fail;
      iwin.jasmine = new IFrameJasmine(iwin);
      iwin.testConfig = testConfig;
      iwin.spyOn = spyOn;
    };

    if (focus) {
      fit(description, runTest);
    } else {
      it(description, runTest);
    }
  };

  /**
   * Run a single test page and ignore all other tests.
   * @param {string} path The path of the test page. May be absolute or relative.
   * @param {Object} [testConfig] An object to set on the iframe window object. This can
   * be used to configure a test in the iframe.
   */
  window.frunTestPage = function(description, path, testConfig) {
    window.runTestPage(description, path, testConfig, true);
  };
})();
