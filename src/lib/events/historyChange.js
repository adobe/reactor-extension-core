import debounce from './helpers/debounce';
import once from './helpers/once';

const history = window.history;
let lastURI = window.location.href;
const triggers = [];

/**
 * Replaces a method on an object with a proxy method only calls the original method but also
 * another explicitly defined function.
 * @param {Object} object The object containing the method to replace.
 * @param {String} methodName The name of the method to replace with the proxy method.
 * @param {Function} fn A function that should be called after the original method is called.
 */
const callThrough = (object, methodName, fn) => {
  const original = object[methodName];
  object[methodName] = function () {
    const returnValue = original.apply(object, arguments);
    fn.apply(null, arguments);
    return returnValue;
  };
};

/**
 * Calls all the trigger methods if the URI has changed.
 */
const callTriggersIfURIChanged = debounce(() => {
  const uri = window.location.href;
  if (lastURI !== uri) {
    triggers.forEach((trigger) => {
      trigger();
    });

    lastURI = uri;
  }
}, 0);

/**
 * Starts watching for history changes.
 */
const watchForHistoryChange = once(() => {
  if (history) {
    if (history.pushState) {
      callThrough(history, 'pushState', callTriggersIfURIChanged);
    }

    if (history.replaceState) {
      callThrough(history, 'replaceState', callTriggersIfURIChanged);
    }
  }

  window.addEventListener('popstate', callTriggersIfURIChanged);
  window.addEventListener('hashchange', callTriggersIfURIChanged);
});

/**
 * History change event. This event occurs when the URL hash is changed or the URL is changed
 * through the <code>history</code> API.
 * @param {Object} settings The event settings object.
 * @param {ruleTrigger} trigger The trigger callback.
 */
export default function historyChange(settings, trigger) {
  watchForHistoryChange();
  triggers.push(trigger);
}
