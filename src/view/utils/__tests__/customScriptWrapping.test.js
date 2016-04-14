import customScriptWrapping from '../customScriptWrapping';

describe('custom script wrapping', () => {
  it('wraps', () => {
    expect(customScriptWrapping.wrap('foo', ['paramA', 'paramB']))
      .toBe('function(paramA, paramB) { foo }');
  });

  it('unwraps', () => {
    expect(customScriptWrapping.unwrap('function(paramA, paramB) { foo }', ['paramA', 'paramB']))
      .toBe('foo');
  });
});
