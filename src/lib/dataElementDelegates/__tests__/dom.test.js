'use strict';

var dataElementDelegate = require('../dom');

describe('dom data element delegate', function() {
  var testElement;

  beforeAll(function() {
    testElement = document.createElement('div');
    testElement.id = 'domDataElement';
    testElement.innerHTML = 'Foo Content';
    testElement.setAttribute('data-cake', 'delish');
    document.body.appendChild(testElement);
  });

  afterAll(function() {
    document.body.removeChild(testElement);
  });

  it('should return the text value of the first matching element', function() {
    var settings = {
      elementSelector: '#domDataElement',
      elementProperty: 'text'
    };

    expect(dataElementDelegate(settings)).toBe('Foo Content');
  });

  it('should return an attribute of the first matching element', function() {
    var settings = {
      elementSelector: '#domDataElement',
      elementProperty: 'data-cake'
    };

    expect(dataElementDelegate(settings)).toBe('delish');
  });
});
