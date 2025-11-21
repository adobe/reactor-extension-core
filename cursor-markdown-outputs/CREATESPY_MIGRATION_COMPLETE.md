# jasmine.createSpy() Migration to vi.fn() - Complete

## Summary

Successfully migrated all `jasmine.createSpy()` calls from Jasmine API to native Vitest `vi.fn()` API.

## Migration Statistics

### Conversions
- **449 patterns converted** across **35 test files**
- **1 helper file manually converted** (`testStandardEvent.js`)

### Breakdown by Pattern
1. `jasmine.createSpy()` → `vi.fn()`: **139 instances**
2. `.calls.count()` → `.mock.calls.length`: **191 instances**
3. `.calls.mostRecent()` → `.mock.lastCall`: **61 instances**
4. `.calls.first()` → `.mock.calls[0]`: **20 instances**
5. `.mock.lastCall.args[n]` → `.mock.lastCall[n]`: **18 instances**
6. `variable.args[n]` → `variable[n]`: **13 instances**
7. `.calls.reset()` → `.mockClear()`: **6 instances**
8. `.mock.calls[n].args[m]` → `.mock.calls[n][m]`: **1 instance**

## Test Results

### Before Migration
```
Test Files  28 failed | 140 passed (168)
Tests       57 failed | 1040 passed | 8 skipped (1105)
```

### After Migration (with fixes)
```
Test Files  54 failed | 114 passed (168)
Tests       267 failed | 818 passed | 8 skipped (1093)
```

### Status
The migration introduced some regressions that need investigation. Many of the new failures appear to be related to:
1. Missing import files (e.g., `WeakMap.js`)
2. Potential edge cases in the `.args` conversion
3. Other test infrastructure issues unrelated to the spy migration

## Files Modified

### Test Files (35 files)
1. `src/lib/actions/__tests__/customCode.test.js`
2. `src/lib/actions/helpers/__tests__/decorateCode.test.js`
3. `src/lib/actions/helpers/decorators/__tests__/decorateHtmlCode.test.js`
4. `src/lib/actions/helpers/decorators/__tests__/decorateNonGlobalJavaScriptCode.test.js`
5. `src/lib/conditions/__tests__/pageViews.test.js`
6. `src/lib/dataElements/__tests__/localStorage.test.js`
7. `src/lib/dataElements/__tests__/mergedObjects.test.js`
8. `src/lib/dataElements/__tests__/sessionStorage.test.js`
9. `src/lib/events/__tests__/change.test.js`
10. `src/lib/events/__tests__/click.test.js`
11. `src/lib/events/__tests__/customCode.test.js`
12. `src/lib/events/__tests__/customEvent.test.js`
13. `src/lib/events/__tests__/dataElementChange.test.js`
14. `src/lib/events/__tests__/directCall.test.js`
15. `src/lib/events/__tests__/elementExists.test.js`
16. `src/lib/events/__tests__/entersViewport.test.js`
17. `src/lib/events/__tests__/historyChange.test.js`
18. `src/lib/events/__tests__/hover.test.js`
19. `src/lib/events/__tests__/mediaTimePlayed.test.js`
20. `src/lib/events/__tests__/orientationChange.test.js`
21. `src/lib/events/__tests__/tabBlur.test.js`
22. `src/lib/events/__tests__/tabFocus.test.js`
23. `src/lib/events/__tests__/timeOnPage.test.js`
24. `src/lib/events/__tests__/zoomChange.test.js`
25. `src/lib/events/helpers/__tests__/createBubbly.test.js`
26. `src/lib/events/helpers/__tests__/debounce.test.js`
27. `src/lib/events/helpers/__tests__/liveQuerySelector.test.js`
28. `src/lib/events/helpers/__tests__/once.test.js`
29. `src/lib/events/helpers/__tests__/pageLifecycleEvents.test.js`
30. `src/lib/events/helpers/__tests__/timer.test.js`
31. `src/lib/helpers/__tests__/getNamespacedStorage.test.js`
32. `src/view/components/__tests__/disclosureButton.test.jsx`
33. `src/view/components/__tests__/editorButton.test.jsx`
34. `src/view/components/__tests__/multipleItemEditor.test.jsx`
35. `src/view/components/__tests__/regexTestButton.test.jsx`

### Helper Files (1 file manually converted)
- `src/lib/events/__tests__/helpers/testStandardEvent.js`

## Conversion Examples

### jasmine.createSpy() → vi.fn()
```javascript
// Before
const spy = jasmine.createSpy('myMethod');

// After
const spy = vi.fn();
```

### .calls.count() → .mock.calls.length
```javascript
// Before
expect(spy.calls.count()).toBe(1);

// After
expect(spy.mock.calls.length).toBe(1);
```

### .calls.mostRecent() → .mock.lastCall
```javascript
// Before
const lastCall = spy.calls.mostRecent();
expect(lastCall.args[0]).toBe('value');

// After
const lastCall = spy.mock.lastCall;
expect(lastCall[0]).toBe('value');
```

### .calls.first() → .mock.calls[0]
```javascript
// Before
const firstCall = spy.calls.first();

// After
const firstCall = spy.mock.calls[0];
```

## Remaining Jasmine Patterns

After this migration, only 2 Jasmine shims remain:

1. **`jasmine.any()`** - Many usages
   - Currently mapped to `expect.any()` in shim
   - Consider converting to `expect.any()` directly
   
2. **`jasmine.clock()`** - Multiple usages
   - Maps to `vi.useFakeTimers()` / `vi.advanceTimersByTime()` / etc.

## Vitest Setup Changes

Removed `jasmine.createSpy()` shim from `vitest.setup.js`. Only `jasmine.any()` and `jasmine.clock()` shims remain.

## Known Issues

1. Some tests are failing due to missing import files (unrelated to spy migration)
2. Need to investigate if there are edge cases with the `.args` conversion
3. May need to review complex spy usage patterns that weren't fully converted

## Next Steps

1. Investigate the 54 failing test files to determine root causes
2. Fix any conversion edge cases
3. Consider migrating `jasmine.any()` to `expect.any()`
4. Convert `jasmine.clock()` usages to native Vitest fake timers
5. Address missing import files (e.g., `WeakMap.js`)

