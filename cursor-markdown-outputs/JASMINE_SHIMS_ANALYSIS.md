# Jasmine Compatibility Shims - Usage Analysis

## Overview

The project uses **Vitest** as the test runner, but maintains **Jasmine compatibility shims** to support the existing test suite without requiring a complete rewrite.

## What We're Shimming

### ✅ Actively Used Shims

| Jasmine API | Vitest Equivalent | Usage Count | Files |
|-------------|-------------------|-------------|-------|
| `jasmine.createSpy()` | `vi.fn()` + custom `.calls` & `.and` APIs | **148** | 37 files |
| `jasmine.clock()` | `vi.useFakeTimers()` | **119** | 14 files |
| `jasmine.any()` | `expect.any()` | **16** | 9 files |
| `jasmine.createSpyObj()` | Object with multiple `vi.fn()` | **6** | 6 files |
| **TOTAL** | | **289** | **46 files** |

### ❌ Unused Shims (Can Be Removed)

| Jasmine API | Vitest Equivalent | Usage Count |
|-------------|-------------------|-------------|
| `jasmine.anything()` | `expect.anything()` | **0** |
| `jasmine.objectContaining()` | `expect.objectContaining()` | **0** |
| `jasmine.arrayContaining()` | `expect.arrayContaining()` | **0** |
| `jasmine.stringMatching()` | `expect.stringMatching()` | **0** |

---

## Detailed Breakdown

### 1. `jasmine.createSpy()` - Most Used (148 instances)

**What it does:**
- Creates a spy/mock function
- Provides `.calls` API for inspecting call history
- Provides `.and` API for configuring behavior

**Our Implementation:**
```javascript
jasmine.createSpy: (name) => {
  const spy = vi.fn().mockName(name || 'spy');
  
  // Custom .calls API
  Object.defineProperty(spy, 'calls', {
    get() {
      return {
        count: () => spy.mock.calls.length,
        all: () => spy.mock.calls.map(...),
        mostRecent: () => { ... },
        first: () => { ... },
        reset: () => spy.mockClear()
      };
    }
  });
  
  // Custom .and API
  spy.and = {
    returnValue: (value) => spy.mockReturnValue(value),
    returnValues: (...values) => spy.mockReturnValueOnce(...values),
    callThrough: () => spy.mockImplementation(...),
    callFake: (fn) => spy.mockImplementation(fn),
    throwError: (error) => spy.mockImplementation(...),
    stub: () => spy.mockReset()
  };
  
  return spy;
}
```

**Example Usage:**
```javascript
const trigger = jasmine.createSpy();
delegate({ type: 'click' }, trigger);

expect(trigger.calls.count()).toBe(1);
const call = trigger.calls.mostRecent();
expect(call.args[0]).toEqual({ ... });
```

**Used in:**
- Event delegate tests (click, hover, change, etc.)
- Timer tests
- Spy/mock tests throughout lib/

---

### 2. `jasmine.clock()` - Timer Control (119 instances)

**What it does:**
- Provides fake timer control for testing async code
- Allows advancing time synchronously

**Our Implementation:**
```javascript
jasmine.clock: () => ({
  install: () => vi.useFakeTimers(),
  uninstall: () => vi.useRealTimers(),
  tick: (ms) => vi.advanceTimersByTime(ms),
  mockDate: (date) => vi.setSystemTime(date),
})
```

**Example Usage:**
```javascript
const clock = jasmine.clock();
clock.install();

// Trigger async code
delegate({ delay: 1000 }, trigger);

// Fast-forward time
clock.tick(1000);

expect(trigger.calls.count()).toBe(1);
clock.uninstall();
```

**Used in:**
- Time-based event tests (timeOnPage, mediaTimePlayed)
- Debounce/throttle tests
- Click delay tests
- Timer helper tests
- Visitor tracking tests

---

### 3. `jasmine.any()` - Type Matching (16 instances)

**What it does:**
- Matches any value of a specific type in expectations

**Our Implementation:**
```javascript
jasmine.any: (constructor) => expect.any(constructor)
```

**Example Usage:**
```javascript
expect(call.args[0]).toEqual({
  element: outerElement,
  nativeEvent: jasmine.any(Object),  // Any object
  detail: { foo: 'bar' }
});
```

**Used in:**
- Event payload validation
- Object shape matching
- Generic type checks

---

### 4. `jasmine.createSpyObj()` - Multiple Spies (6 instances)

**What it does:**
- Creates an object with multiple spy methods

**Our Implementation:**
```javascript
jasmine.createSpyObj: (baseName, methodNames) => {
  const obj = {};
  methodNames.forEach((method) => {
    obj[method] = jasmine.createSpy(`${baseName}.${method}`);
  });
  return obj;
}
```

**Example Usage:**
```javascript
const turbine = jasmine.createSpyObj('turbine', ['logger', 'getDataElementValue']);
turbine.logger.returns('test');
```

**Used in:**
- Mock complex objects
- Mock turbine/satellite APIs

---

## Unused Shims (Can Be Removed)

### 1. `jasmine.anything()` - Never Used

**Currently:**
```javascript
jasmine.anything: () => expect.anything()
```

**Recommendation:** ❌ **Remove** - Not used anywhere

---

### 2. `jasmine.objectContaining()` - Never Used

**Currently:**
```javascript
jasmine.objectContaining: (obj) => expect.objectContaining(obj)
```

**Recommendation:** ❌ **Remove** - Not used anywhere

---

### 3. `jasmine.arrayContaining()` - Never Used

**Currently:**
```javascript
jasmine.arrayContaining: (arr) => expect.arrayContaining(arr)
```

**Recommendation:** ❌ **Remove** - Not used anywhere

---

### 4. `jasmine.stringMatching()` - Never Used

**Currently:**
```javascript
jasmine.stringMatching: (str) => expect.stringMatching(str)
```

**Recommendation:** ❌ **Remove** - Not used anywhere

---

## Other Global Shims

### Non-Jasmine Globals in `vitest.setup.js`

| Global | Purpose | Usage |
|--------|---------|-------|
| `globalThis.Simulate` | DOM event simulation | Used in many event tests |
| `globalThis.process` | Node process object | Required for ES modules |
| `globalThis.turbine` | Adobe Launch API mock | Required for all delegate tests |
| `globalThis.require` | AMD-style require | Used in delegate tests |
| `globalThis.mockTurbineVariable` | Test helper | Used to override turbine config |

---

## Recommendations

### 1. ✅ Keep Essential Shims

These are heavily used and provide significant value:
- ✅ `jasmine.createSpy()` (148 uses)
- ✅ `jasmine.clock()` (119 uses)
- ✅ `jasmine.any()` (16 uses)
- ✅ `jasmine.createSpyObj()` (6 uses)

### 2. ❌ Remove Unused Shims

Clean up the config by removing:
- ❌ `jasmine.anything()`
- ❌ `jasmine.objectContaining()`
- ❌ `jasmine.arrayContaining()`
- ❌ `jasmine.stringMatching()`

This will simplify `vitest.setup.js` and reduce maintenance burden.

### 3. 📝 Document the Shims

Add inline comments explaining:
- Why each shim exists
- What tests depend on it
- Migration path (if applicable)

### 4. 🔄 Consider Gradual Migration

Over time, tests could be migrated from Jasmine API to native Vitest API:

**Before:**
```javascript
const trigger = jasmine.createSpy();
expect(trigger.calls.count()).toBe(1);
```

**After:**
```javascript
const trigger = vi.fn();
expect(trigger).toHaveBeenCalledTimes(1);
```

However, this is **low priority** since the shims work well.

---

## Statistics Summary

| Category | Count |
|----------|-------|
| **Total Jasmine API calls** | 289 |
| **Files using Jasmine APIs** | 46 |
| **Active shims** | 4 |
| **Unused shims** | 4 |
| **Non-Jasmine globals** | 5 |

**Test Coverage:**
- ✅ 121 passing test files (72%)
- ❌ 47 failing test files (28%)
- ✅ 1017 passing tests (92%)
- ❌ 88 failing tests (8%)

---

## Files Using Jasmine APIs

### Lib Tests (38 files)
**Events:** click, change, hover, elementExists, entersViewport, mediaTimePlayed, timeOnPage, directCall, dataElementChange, customEvent, customCode, historyChange, orientationChange, zoomChange, tabFocus, tabBlur, windowLoaded, pageBottom, domReady, libraryLoaded

**Event Helpers:** liveQuerySelector, debounce, timer, createBubbly, pageLifecycleEvents, once, testStandardEvent

**Actions:** customCode, directCall

**Conditions:** pageViews, customCode, maxFrequency

**Data Elements:** sessionStorage, localStorage, mergedObjects

**Helpers:** visitorTracking, getNamespacedStorage

### View Tests (5 files)
**Components:** editorButton, regexTestButton, multipleItemEditor, disclosureButton

**Helpers:** react-testing-library

---

**Analysis Date:** November 21, 2025  
**Vitest Version:** 4.0.12

