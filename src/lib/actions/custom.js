'use strict';

var loadScript = require('load-script');
var getVar = require('get-var');
var logger = require('logger');
var once = require('once');
var buildInfo = require('build-info');

var BLOCKING_CODE_ID_ATTRIBUTE = 'data-dtmblockingcodeid';

var domContentLoaded = false;

document.addEventListener('DOMContentLoaded', function() {
  domContentLoaded = true;
});

var canWriteToDocument = function() {
  return document.write && !domContentLoaded;
};

var appendToBody = function(element) {
  // Ensure body is available before adding the element.
  if (domContentLoaded) {
    document.getElementsByTagName('body')[0].appendChild(element);
  } else {
    document.addEventListener('DOMContentLoaded', appendToBody.bind(this, element));
  }
};

var getQueryStringForTokens = function(tokens, relatedElement, event) {
  return tokens
    .map(function(token) {
      return token + '=' + getVar(token, relatedElement, event);
    })
    .join('&');
};

// A map used to store everything necessary to provide the
// "this", "event", and "target" variables to non-global JavaScript.
var actionsAwaitingJSCallback = {
  _actionsByCodeId: {},
  addAction: function(action) {
    var id = action.settings.codeId;
    var actions = this._actionsByCodeId[id];

    if (!actions) {
      actions = this._actionsByCodeId[id] = [];
    }

    actions.push(action);
  },
  removeActionById: function(id) {
    var actions = this._actionsByCodeId[id];
    var action;

    if (actions && actions.length) {
      action = actions.shift();

      if (!actions.length) {
        delete this._actionsByCodeId[id];
      }
    }
    return action;
  }
};

// A queue for sequential JavaScript and HTML.
var sequentialQueue = {
  _queue: [],
  _outstandingAction: null,
  _process: function() {
    if (!this._outstandingAction && this._queue.length) {
      this._outstandingAction = this._queue.shift();
      processAction(this._outstandingAction);
    }
  },
  addAction: function(action) {
    this._queue.push(action);
    this._process();
  },
  actionCompleted: function(codeId) {
    // Is the code that has completed loading the one we were waiting on? If so, we'll move
    // onto loading the next item in the queue; otherwise, we'll keep waiting.
    if (this._outstandingAction && this._outstandingAction.settings.codeId === codeId) {
      this._outstandingAction = null;
      this._process();
    }
  }
};

// Method called by both global and non-global external JavaScript.
_satellite._customJSLoaded = function(codeId, callback) {
  var action = actionsAwaitingJSCallback.removeActionById(codeId);

  if (callback) {
    var event = action.event;
    var target;

    if (event) {
      target = event.target;
    }

    callback.call(action.relatedElement, event, target);
  }
};

// Watches for script loading errors for any blocking external JavaScript and cleans
// up related items accordingly. To understand why this is necessary, see the documentation
// found above the code that calls it.
var watchForBlockingJavaScriptError = once(function() {
  window.addEventListener('error', function(event) {
    if (event.target.hasAttribute && event.target.hasAttribute(BLOCKING_CODE_ID_ATTRIBUTE)) {
      var codeId = event.target.getAttribute(BLOCKING_CODE_ID_ATTRIBUTE);
      actionsAwaitingJSCallback.removeActionById(codeId);
    }
  }, true);
});

var loadJavaScriptSequential = function(action) {
  actionsAwaitingJSCallback.addAction(action);

  var source = action.settings.source;
  var codeId = action.settings.codeId;

  // We first try to document.write because if the page is still loading we want the script to
  // load and execute before parsing the rest of the page. If the page has already loaded,
  // we'll instead use loadScript to create and append a script element. Even though the script
  // won't be "blocking" in this case (it won't prevent other things from happening on the page
  // while it loads), it will still be sequential in relation to other DTM third-party scripts
  // due to the sequential queue we have in place.
  if (canWriteToDocument()) {
    document.write('<script ' +
      'src="' + source + '" ' +
      BLOCKING_CODE_ID_ATTRIBUTE + '="' + codeId + '"' +
      '></scr' + 'ipt>');
    // If the script fails to load, we need to call actionsAwaitingJSCallback.removeActionById
    // otherwise the action object and everything it references will remain in memory.
    // We're limited in how we detect that the script has failed to load. We
    // can't add an onerror attribute to the HTML we're writing because content security policies
    // can prevent inline script from executing:
    // https://developer.chrome.com/extensions/contentSecurityPolicy
    // Another option might be to find the last script element written to the document (which
    // typically would be the one we just wrote) and add an event listener for the error
    // event; however, sometimes, particularly on page bottom rules when writing multiple scripts,
    // document.write does not actually write to the document immediately.
    // This is explained here:
    // http://docstore.mik.ua/orelly/web/jscript/refp_95.html
    // "The results of calling Document.write() may not be immediately visible in the targeted web
    // browser window or frame. This is because a web browser may buffer up data to output in
    // larger chunks. Calling Document.close() is the only way to explicitly force all buffered
    // output to be 'flushed' and displayed in the browser window."
    // As a result, we will instead watch for errors on window in their capture phase and determine
    // if they are load errors for the scripts we added here.
    watchForBlockingJavaScriptError();
    // If we were able to document.write the script tag, it will be blocking (scripts added to
    // the document later won't be executed before it) so we can immediately move to processing
    // the next item in the sequential queue. One alternative explored was only writing one script
    // tag at a time and waiting for the loaded script to call _satellite._customJSLoaded()
    // before writing the next script tag. With this approach, we still needed to handle errors
    // like if the first script 404'd while loading by watching for an error event.
    // In this case, and only when the prior script errors, IE (at least 9 and 10) considers
    // the document "closed" at this point and will replace the entire document with the second
    // script tag. This occurs even though the DOMContentLoaded event has not yet fired. ¯\_(ツ)_/¯
    // Instead, we're relegated to making sure that all the document.writes that we can perform
    // occur as soon as possible and letting the browser naturally handle the queuing and
    // blocking.
    sequentialQueue.actionCompleted(codeId);
  } else {
    loadScript(source).then(function() {
      sequentialQueue.actionCompleted(codeId);
    }, function() {
      sequentialQueue.actionCompleted(codeId);
      actionsAwaitingJSCallback.removeActionById(codeId);
    });
  }
};

var loadJavaScriptNonSequential = function(action) {
  var source = action.settings.source;

  actionsAwaitingJSCallback.addAction(action);
  loadScript(source).catch(function() {
    actionsAwaitingJSCallback.removeActionById(action.settings.codeId);
  });
};

var loadHtmlSequential = function(action) {
  var name = action.settings.name;
  var source = action.settings.source;
  var codeId = action.settings.codeId;

  if (canWriteToDocument()) {
    // Note that if the rule is fired in Internet Explorer 9 before the page's
    // HTML document has been loaded and parsed, any inline script
    // (e.g., <script>console.log('test');<script>) within source will be executed before
    // prior sequential JavaScript.
    document.write(source);
  } else {
    logger.error('Unable to write sequential HTML for ' + name + '. Sequential HTML ' +
      'is not supported for rules that fire after the page has loaded.');
  }

  sequentialQueue.actionCompleted(codeId);
};

var loadHtmlNonSequential = function(action) {
  var source = action.settings.source;
  var tokens = action.settings.tokens;

  if (tokens && tokens.length) {
    source = source + '?' + getQueryStringForTokens(tokens, action.relatedElement, action.event);
  }

  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = source;
  appendToBody(iframe);
};

var processAction = function(action) {
  var loadFn;

  switch (action.settings.language) {
    case 'javascript':
      loadFn = action.settings.sequential ? loadJavaScriptSequential : loadJavaScriptNonSequential;
      break;
    case 'html':
      loadFn = action.settings.sequential ? loadHtmlSequential : loadHtmlNonSequential;
      break;
  }

  if (loadFn) {
    loadFn(action);
  }
};

/**
 * The custom action event. This loads and executes custom JavaScript or HTML provided by the user.
 * @param {Object} settings Action settings.
 * @param {number} settings.name The name of the action. Typically used by users to remind
 * themselves what the code is intended to do.
 * @param {string} settings.source If <code>settings.language</code> is <code>html</code> and
 * <code>settings.sequential</code> is <code>true</code>, then this will be the user's code.
 * Otherwise, it will be a relative path to the file containing the users code.
 * @param {string} settings.language The language of the user's code. Must be either
 * <code>javascript</code> or <code>html</code>.
 * @param {string} settings.codeId A unique ID for the code. This is generated by the server
 * and is also passed to <code>_satellite._customJSLoaded</code> from loaded JavaScript files.
 * @param {boolean} [settings.sequential] Whether the script should be loaded and executed in order
 * related to other custom actions with <code>settings.sequential</code> set to <code>true</code>.
 */
module.exports = function(settings, relatedElement, event) {
  var action = {
    settings: settings,
    relatedElement: relatedElement,
    event: event
  };

  if (settings.sequential) {
    sequentialQueue.addAction(action);
  } else {
    processAction(action);
  }
};

if (typeof ENV_TEST !== 'undefined' && ENV_TEST) {
  module.exports.__isMemoryCleanedUp = function() {
    return !Object.keys(actionsAwaitingJSCallback._actionsByCodeId).length &&
        !sequentialQueue._queue.length;
  };
}
