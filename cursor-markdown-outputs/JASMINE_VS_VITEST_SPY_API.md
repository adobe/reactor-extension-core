# Jasmine vs Vitest Spy API Comparison

## Direct Replacement: `jasmine.createSpy()` → `vi.fn()`

Yes, there is a direct replacement! **`vi.fn()`** is Vitest's equivalent to `jasmine.createSpy()`.

However, the APIs differ, which is why we shim it. Here's the comparison:

---

## Creating a Spy

### Jasmine
```javascript
const spy = jasmine.createSpy('mySpyName');
```

### Vitest
```javascript
import { vi } from 'vitest';
const spy = vi.fn();
```

---

## Checking Call Count

### Jasmine
```javascript
expect(spy.calls.count()).toBe(1);
```

### Vitest (Option 1 - Direct)
```javascript
expect(spy.mock.calls.length).toBe(1);
```

### Vitest (Option 2 - Matcher) ✅ **Better!**
```javascript
expect(spy).toHaveBeenCalledTimes(1);
// or
expect(spy).toHaveBeenCalled();
```

---

## Getting Call Arguments

### Jasmine
```javascript
const call = spy.calls.mostRecent();
expect(call.args[0]).toBe('value');
```

### Vitest (Option 1 - Direct)
```javascript
const lastCall = spy.mock.calls[spy.mock.calls.length - 1];
expect(lastCall[0]).toBe('value');
```

### Vitest (Option 2 - Matcher) ✅ **Better!**
```javascript
expect(spy).toHaveBeenCalledWith('value');
// or get last call args
expect(spy.mock.lastCall[0]).toBe('value');
```

---

## Getting First Call

### Jasmine
```javascript
const call = spy.calls.first();
expect(call.args[0]).toBe('value');
```

### Vitest
```javascript
const firstCall = spy.mock.calls[0];
expect(firstCall[0]).toBe('value');
```

---

## Getting All Calls

### Jasmine
```javascript
const allCalls = spy.calls.all();
// Returns: [{ args: [...], returnValue: ... }, ...]
```

### Vitest
```javascript
const allCalls = spy.mock.calls;
// Returns: [[...args], [...args], ...]

// For results:
const allResults = spy.mock.results;
// Returns: [{ type: 'return', value: ... }, ...]
```

---

## Configuring Return Value

### Jasmine
```javascript
spy.and.returnValue('result');
```

### Vitest
```javascript
spy.mockReturnValue('result');

// One-time return:
spy.mockReturnValueOnce('result1')
   .mockReturnValueOnce('result2');
```

---

## Configuring Implementation

### Jasmine
```javascript
spy.and.callFake((arg) => {
  return arg * 2;
});
```

### Vitest
```javascript
spy.mockImplementation((arg) => {
  return arg * 2;
});

// One-time implementation:
spy.mockImplementationOnce((arg) => arg * 2);
```

---

## Throwing Errors

### Jasmine
```javascript
spy.and.throwError('Error message');
// or
spy.and.throwError(new Error('Error message'));
```

### Vitest
```javascript
spy.mockImplementation(() => {
  throw new Error('Error message');
});
```

---

## Resetting/Clearing

### Jasmine
```javascript
spy.calls.reset();
```

### Vitest
```javascript
spy.mockClear();      // Clear call history
spy.mockReset();      // Clear + remove implementation
spy.mockRestore();    // Restore original (for spyOn)
```

---

## Complete Real-World Example

### Jasmine Style (Current)
```javascript
import { injectCustomEvent } from '../customEvent.js';

describe('custom event', () => {
  it('triggers rule when event is dispatched', function() {
    const trigger = jasmine.createSpy('trigger');
    const delegate = injectCustomEvent({ window });
    
    delegate({ type: 'foo' }, trigger);
    
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('foo', true, true, { data: 'bar' });
    element.dispatchEvent(event);
    
    expect(trigger.calls.count()).toBe(1);
    const call = trigger.calls.mostRecent();
    expect(call.args[0]).toEqual({
      element: outerElement,
      target: innerElement,
      nativeEvent: jasmine.any(Object),
      detail: { data: 'bar' }
    });
  });
});
```

### Vitest Style (Migrated) ✅
```javascript
import { injectCustomEvent } from '../customEvent.js';
import { vi, expect } from 'vitest';

describe('custom event', () => {
  it('triggers rule when event is dispatched', function() {
    const trigger = vi.fn();
    const delegate = injectCustomEvent({ window });
    
    delegate({ type: 'foo' }, trigger);
    
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('foo', true, true, { data: 'bar' });
    element.dispatchEvent(event);
    
    // Better matchers!
    expect(trigger).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveBeenCalledWith({
      element: outerElement,
      target: innerElement,
      nativeEvent: expect.any(Object),
      detail: { data: 'bar' }
    });
    
    // Or access directly if needed:
    const lastCall = trigger.mock.lastCall;
    expect(lastCall[0].detail).toEqual({ data: 'bar' });
  });
});
```

---

## Vitest Matcher Advantages

Vitest provides **better matchers** than Jasmine:

| Matcher | Description |
|---------|-------------|
| `expect(spy).toHaveBeenCalled()` | Called at least once |
| `expect(spy).toHaveBeenCalledTimes(n)` | Called exactly n times |
| `expect(spy).toHaveBeenCalledWith(args)` | Called with specific args |
| `expect(spy).toHaveBeenLastCalledWith(args)` | Last call had specific args |
| `expect(spy).toHaveBeenNthCalledWith(n, args)` | Nth call had specific args |
| `expect(spy).toHaveReturned()` | Returned successfully |
| `expect(spy).toHaveReturnedTimes(n)` | Returned n times |
| `expect(spy).toHaveReturnedWith(value)` | Returned specific value |
| `expect(spy).toHaveLastReturnedWith(value)` | Last return was value |

---

## Why We Shim

**Pros of keeping the shim:**
- ✅ No need to rewrite 148 spy usages across 37 files
- ✅ Tests continue to work as-is
- ✅ Can migrate gradually over time

**Pros of migrating to `vi.fn()`:**
- ✅ Simpler, more idiomatic Vitest code
- ✅ Better matcher support
- ✅ One less abstraction layer
- ✅ Better TypeScript support
- ✅ More powerful API

---

## Migration Effort

To migrate all `jasmine.createSpy()` to `vi.fn()`:

**Files to update:** 37 files
**Instances to change:** 148

**Estimated effort:** 
- Automated: Could write a codemod/script for simple cases (~70%)
- Manual: Complex cases with `.calls` and `.and` API (~30%)
- Testing: Verify each file still passes
- **Total:** ~4-6 hours

---

## Recommendation

**For now: Keep the shim** ✅
- Tests work fine
- Not blocking any features
- Can migrate incrementally

**Future: Gradual migration**
- Migrate new tests to `vi.fn()`
- Convert existing tests as they're modified
- No rush - shim is working well

---

## Quick Reference Card

| Task | Jasmine | Vitest |
|------|---------|--------|
| Create | `jasmine.createSpy()` | `vi.fn()` |
| Call count | `spy.calls.count()` | `spy.mock.calls.length` |
| Last call | `spy.calls.mostRecent()` | `spy.mock.lastCall` |
| First call | `spy.calls.first()` | `spy.mock.calls[0]` |
| All calls | `spy.calls.all()` | `spy.mock.calls` |
| Return value | `spy.and.returnValue(v)` | `spy.mockReturnValue(v)` |
| Implementation | `spy.and.callFake(fn)` | `spy.mockImplementation(fn)` |
| Reset | `spy.calls.reset()` | `spy.mockClear()` |
| **Better way** | N/A | `expect(spy).toHaveBeenCalledWith(...)` |

---

**Date:** November 21, 2025  
**Vitest Version:** 4.0.12

