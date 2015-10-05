'use strict';

(function() {

  /*eslint-disable*/
  var domReady = (function(ready) {

    var fns = [], fn, f = false
      , doc = document
      , testEl = doc.documentElement
      , hack = testEl.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , addEventListener = 'addEventListener'
      , onreadystatechange = 'onreadystatechange'
      , loaded = /^loade|^c/.test(doc.readyState);

    var flush = function() {
      loaded = 1;

      while (fns.length) {
        var fn = fns.shift();
        fn();
      }
    };

    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function() {
      doc.removeEventListener(domContentLoaded, fn, f);
      flush();
    }, f);


    hack && doc.attachEvent(onreadystatechange, (fn = function() {
      if (/^c/.test(doc.readyState)) {
        doc.detachEvent(onreadystatechange, fn);
        flush();
      }
    }));

    return (ready = hack ?
      function(fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function() {
            try {
              testEl.doScroll('left');
            } catch (e) {
              return setTimeout(function() {
                ready(fn);
              }, 50);
            }
            fn();
          }();
      } :
      function(fn) {
        loaded ? fn() : fns.push(fn);
      });
  }());
  /*eslint-enable*/

  var addEventListener = window.addEventListener ?
    function(node, evt, cb) {
      node.addEventListener(evt, cb, false);
    } :
    function(node, evt, cb) {
      node.attachEvent('on' + evt, cb);
    };

  var page;

  var waitForDOMLoaded = function() {
    page.queue.push(function(next) {
      domReady(function() {
        next();
      });
    });
    return page;
  };

  var waitForContentLoaded = function() {
    page.queue.push(function(next) {
      addEventListener(window, 'load', next);
    });
    return page;
  };

  var execute = function(cb) {
    page.queue.push(function(next) {
      cb(page);
      next();
    });
    return page;
  };

  var queueStarted = false;

  var start = function() {
    if (queueStarted) {
      return;
    }

    queueStarted = true;

    var queue = page.queue;
    var idx = 0;

    var next = function() {
      var cb = queue[idx++];
      if (!cb) {
        return window.done();
      }
      cb(next);
    };

    next();
  };

  window.onerror = function(err, url, line) {
    window.fail(err + ' at ' + url + ' on line ' + line);
    window.done();
  };

  page = {
    queue: [],
    waitForDOMLoaded: waitForDOMLoaded,
    waitForContentLoaded: waitForContentLoaded,
    execute: execute,
    start: start
  };

  window.TestPage = page;
})();
