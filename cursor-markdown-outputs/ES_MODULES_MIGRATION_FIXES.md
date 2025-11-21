# ES Modules Migration - Import Pattern Fixes

## Summary
The conversion to ES modules (`"type": "module"` in package.json and `type: 'module'` in karma.conf.mjs) broke several import patterns that worked in the CommonJS/script loading setup.

## Root Cause
**Before:** Scripts shared scope or properties were attached to export objects  
**After:** ES modules have isolated scope - named exports are separate from default exports

---

## ✅ FIXED Issues

### 1. `click.test.js` - `__reset` Export Pattern
**Problem:** Test called `delegate.__reset()` but `__reset` is exported separately from the module

**Before (Broken):**
```javascript
import { injectClick } from '../click';
delegate = injectClick({ window: mockWindow, document });
delegate.__reset();  // ❌ __reset not on delegate
```

**After (Fixed):**
```javascript
import { injectClick, __reset } from '../click';
delegate = injectClick({ window: mockWindow, document });
__reset();  // ✅ Import and call separately
```

**Files Fixed:**
- `src/lib/events/__tests__/click.test.js`

---

### 2. `hover.test.js` - `liveQuerySelector.__reset` Pattern
**Problem:** `__reset` exported separately from default export

**Before (Broken):**
```javascript
import liveQuerySelector from '../helpers/liveQuerySelector';
liveQuerySelector.__reset();  // ❌ __reset not on default export
```

**After (Fixed):**
```javascript
import liveQuerySelector, { __reset as resetLiveQuerySelector } from '../helpers/liveQuerySelector';
resetLiveQuerySelector();  // ✅ Import named export separately
```

**Files Fixed:**
- `src/lib/events/__tests__/hover.test.js`

---

## 🔍 PATTERNS TO WATCH FOR

### Pattern: Separate `__reset` Exports
**Modules with this pattern:**
- `src/lib/events/click.js` - exports `__reset` separately ✅ FIXED
- `src/lib/events/helpers/liveQuerySelector.js` - exports `__reset` separately ✅ FIXED
- `src/lib/events/helpers/createBubbly.js` - defines `bubbly.__reset` (internal pattern, OK)

### Pattern: `inject*` Functions
**These patterns are OK:**
- Calling `injectSomething({ deps }).property` - This works because the inject function returns an object
- Example: `injectFindPageScript({ document: mocks.document }).getTurbine` ✅ OK

**Test files using inject patterns (verified as correct):**
- `src/lib/dataElements/__tests__/javascriptVariable.test.js`
- `src/lib/dataElements/__tests__/mergedObjects.test.js`
- `src/lib/events/helpers/__tests__/createBubbly.test.js`
- `src/lib/actions/helpers/decorators/__tests__/decorateHtmlCode.test.js`
- `src/lib/actions/__tests__/customCode.test.js`

---

## 🚨 OTHER MIGRATION ISSUES (Already Resolved)

### Global Polyfills Required
**Issue:** ES modules have isolated scope, so polyfills must be explicitly globalized

**Fixed in `helpers/mockDelegateWrapper.js`:**
```javascript
// make process available globally because we bundle karma as modules now.
import process from 'process';
globalThis.process = process;
process.env.NODE_ENV = 'test';
```

**Why:** Dependencies like `invariant`, `React`, `redux-actions` check `process.env.NODE_ENV` at module load time

---

## 📝 Testing Notes

### fdescribe Behavior
- `fdescribe` should focus only one test suite
- With ES modules, ensure no other test files have `fdescribe` or `fit`
- Module-level errors in any loaded file will still show even if tests are skipped

### Common Test Errors After Migration
1. **"X is not defined"** - Missing global (add to mockDelegateWrapper.js)
2. **"X.__reset is not a function"** - Import `__reset` separately
3. **"Jasmine Clock was unable to install"** - Clock conflicts across modules (check `beforeEach`/`afterEach` setup)
4. **"Failed to execute 'removeChild'"** - DOM cleanup issues (check element exists before removal)

---

## ✅ Verification Checklist

- [x] Fixed `__reset` pattern in `click.test.js`
- [x] Fixed `__reset` pattern in `hover.test.js`
- [x] `process` polyfill globalized
- [x] `Simulate` library handling (user chose to import directly in tests)
- [x] Verified `inject*` patterns are correct
- [ ] Run full test suite to identify remaining issues
- [ ] Fix any "Jasmine Clock" conflicts
- [ ] Fix any DOM cleanup issues

---

## 🔧 Quick Reference: Common Fixes

### Fix: Separate Named Export
```javascript
// Before
import something from './module';
something.property();

// After
import something, { property } from './module';
property();
```

### Fix: Global Polyfill Required
```javascript
// In helpers/mockDelegateWrapper.js
import libraryName from 'library-name';
globalThis.LibraryName = libraryName;
```

### Fix: Default vs Named Import
```javascript
// Before (might work in CommonJS)
import { default as something } from './module';

// After (ES modules)
import something from './module';  // default export
import { something } from './module';  // named export
```

