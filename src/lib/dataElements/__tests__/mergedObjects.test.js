/***************************************************************************************
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { injectMergedObjects } from '../mergedObjects.js';
import { vi } from 'vitest';

describe('merged objects data element delegate', function () {
  let deepMergeMock;
  let mergedObjects;

  beforeEach(function () {
    deepMergeMock = vi.fn().and.returnValue({
      a: 'b',
      c: 'd'
    });
    mergedObjects = injectMergedObjects({
      deepMerge: deepMergeMock
    });
  });

  it('calls deepMerge with objects and returns result', function () {
    const result = mergedObjects({
      objects: [
        {
          a: 'b'
        },
        {
          c: 'd'
        }
      ]
    });
    expect(deepMergeMock).toHaveBeenCalledWith(
      {},
      {
        a: 'b'
      },
      {
        c: 'd'
      }
    );
    expect(result).toEqual({
      a: 'b',
      c: 'd'
    });
  });
});
