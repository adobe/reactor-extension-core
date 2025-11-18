/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { injectDecorateCode } from '../decorateCode.js';

describe('decorate code', function () {
  let decorateNonGlobalJavaScriptCodeSpy;
  let decorateGlobalJavaScriptCodeSpy;
  let decorateHtmlCodeSpy;
  let decorateCode;
  beforeEach(() => {
    decorateNonGlobalJavaScriptCodeSpy = jasmine.createSpy(
      'decorateNonGlobalJavaScriptCode'
    );
    decorateGlobalJavaScriptCodeSpy = jasmine.createSpy(
      'decorateGlobalJavaScriptCode'
    );
    decorateHtmlCodeSpy = jasmine.createSpy('decorateHtmlCode');
    decorateCode = injectDecorateCode({
      decorateNonGlobalJavaScriptCode: decorateNonGlobalJavaScriptCodeSpy,
      decorateGlobalJavaScriptCode: decorateGlobalJavaScriptCodeSpy,
      decorateHtmlCode: decorateHtmlCodeSpy
    })
  });

  it('decorates javascript action', function () {
    const settings = {
      language: 'javascript',
      source: 'console.log("logging")'
    };

    decorateCode(
      {
        settings: settings
      },
      settings.source
    );

    expect(decorateNonGlobalJavaScriptCodeSpy).toHaveBeenCalledWith(
      {
        settings: {
          language: 'javascript',
          source: 'console.log("logging")'
        }
      },
      'console.log("logging")'
    );
  });

  it('decorates global javascript action', function () {
    const settings = {
      language: 'javascript',
      global: true,
      source: 'console.log("logging")'
    };

    decorateCode(
      {
        settings: settings
      },
      settings.source
    );

    expect(decorateGlobalJavaScriptCodeSpy).toHaveBeenCalledWith(
      {
        settings: {
          language: 'javascript',
          global: true,
          source: 'console.log("logging")'
        }
      },
      'console.log("logging")'
    );
  });

  it('decorates html action', function () {
    const settings = {
      language: 'html',
      global: true,
      source: '<script>console.log("logging")</script>'
    };

    decorateCode(
      {
        settings: settings
      },
      settings.source
    );

    expect(decorateHtmlCodeSpy).toHaveBeenCalledWith(
      {
        settings: {
          language: 'html',
          global: true,
          source: '<script>console.log("logging")</script>'
        }
      },
      '<script>console.log("logging")</script>'
    );
  });
});
