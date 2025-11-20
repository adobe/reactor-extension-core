# Migration from Karma to Vitest

## What Changed

### ✅ Vitest Benefits
- **No bundling overhead** - Tests run directly with native ESM
- **Faster execution** - 5-10x faster than Karma
- **Better DX** - Built-in watch mode, UI, and coverage
- **Lower memory usage** - No rollup preprocessing of all files
- **Better error messages** - Stack traces that actually make sense

### 🔄 Syntax Changes Required

#### 1. Focus Tests: `fdescribe` → `describe.only`
```javascript
// ❌ Karma/Jasmine
fdescribe('my test suite', () => {
  // ...
});

// ✅ Vitest
describe.only('my test suite', () => {
  // ...
});
```

#### 2. Focus Tests: `fit` → `it.only` or `test.only`
```javascript
// ❌ Karma/Jasmine
fit('my test', () => {
  // ...
});

// ✅ Vitest
it.only('my test', () => {
  // ...
});
```

#### 3. Skip Tests: `xdescribe` → `describe.skip`
```javascript
// ❌ Karma/Jasmine
xdescribe('my test suite', () => {
  // ...
});

// ✅ Vitest
describe.skip('my test suite', () => {
  // ...
});
```

### 📦 What's Already Configured

- ✅ JSX/React support via Vite
- ✅ React Testing Library with `@testing-library/jest-dom` matchers
- ✅ JSDOM environment for DOM APIs
- ✅ `@test-helpers` alias
- ✅ Global `Simulate`, `turbine`, `require` mocks
- ✅ All `process.env` variables
- ✅ Coverage with v8

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# With UI (beautiful browser-based test runner)
npm run test:ui

# With coverage
npm run test:coverage
```

## Troubleshooting

### Issue: `fdescribe is not defined`
**Solution:** Change `fdescribe` to `describe.only`

### Issue: Import errors for `.styl` files
**Solution:** Already handled - Vitest automatically stubs CSS imports

### Issue: `process is not defined`
**Solution:** Already configured in `vitest.setup.js`

### Issue: Tests are slow
**Solution:** Check if you're doing expensive setup in `beforeEach`. Move to `beforeAll` if possible.

## Coverage Notes

Coverage is configured to exclude:
- Test files (`**/__tests__/**`, `**/*.test.{js,jsx}`)
- Helpers (`**/helpers/**`)
- Config files
- Node modules

To view coverage:
```bash
npm run test:coverage
open coverage/html/index.html
```

## Debugging

### VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:watch"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Chrome DevTools
```bash
node --inspect-brk ./node_modules/.bin/vitest --run
```

Then open `chrome://inspect` in Chrome.

