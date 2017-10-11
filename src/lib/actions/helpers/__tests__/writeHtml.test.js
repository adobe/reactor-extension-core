/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

describe('writeHtml', function() {
  var injectWriteHtml = require('inject-loader!../writeHtml');

  it('should write content in the page before DOMContentLoaded was fired', function() {
    var documentWriteSpy = jasmine.createSpy();
    var writeHtml = injectWriteHtml({
      './hasDomContentLoaded': jasmine.createSpy().and.returnValue(false),
      '@adobe/reactor-document': {
        write: documentWriteSpy
      }
    });

    writeHtml('<span></span>');
    expect(documentWriteSpy).toHaveBeenCalledWith('<span></span>');
  });

  it('should throw an error after DOMContentLoaded was fired', function() {
    var writeHtml = injectWriteHtml({
      './hasDomContentLoaded': jasmine.createSpy().and.returnValue(true)
    });

    expect(function() {
      writeHtml('<span></span>');
    }).toThrowError('Cannot call `document.write` after `DOMContentloaded` has fired.');
  });

  it('should throw an error when `document.write` method is missing', function() {
    var writeHtml = injectWriteHtml({
      '@adobe/reactor-document': {}
    });

    expect(function() {
      writeHtml('<span></span>');
    }).toThrowError('Cannot write HTML to the page. `document.write` is unavailable.');
  });
});
