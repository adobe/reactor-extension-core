/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import { injectGetNamespacedStorage } from '../getNamespacedStorage.js';
import { vi } from 'vitest';

describe('getNamespacedStorage', function () {
  function createMockStorage() {
    const storage = {};
    return {
      setItem: function (key, value) {
        storage[key] = value;
      },
      getItem: function (key) {
        return storage[key];
      },
      removeItem: function (key) {
        storage[key] = null;
      }
    };
  }

  const createMockWindowUnavailableStorage = function () {
    return {
      get sessionStorage() {
        throw new Error('Storage unavailable.');
      },
      get localStorage() {
        throw new Error('Storage unavailable.');
      }
    };
  };

  ['sessionStorage', 'localStorage'].forEach(function (storageType) {
    describe('using ' + storageType, function () {
      const itemKey = 'com.adobe.reactor.core.featurex.foo';

      describe('getItem', function () {
        it('returns item', function () {
          // Mocking window because Safari throws an error when setting a storage item in
          // Private Browser Mode.
          const mockWindow = {};

          mockWindow[storageType] = createMockStorage();

          const getNamespacedStorage = injectGetNamespacedStorage({
            window: mockWindow
          });

          const storage = getNamespacedStorage(storageType, 'featurex');

          mockWindow[storageType].setItem(itemKey, 'something');
          expect(storage.getItem('foo')).toEqual('something');
        });

        it('proper error handling if storage is disabled', function () {
          mockTurbineVariable({
            logger: {
              warn: vi.fn()
            }
          });
          const mockWindow = createMockWindowUnavailableStorage();

          const getNamespacedStorage = injectGetNamespacedStorage({
            window: mockWindow
          });

          const storage = getNamespacedStorage(storageType, 'featurex');

          expect(storage.getItem('foo')).toBeNull();
          expect(turbine.logger.warn).toHaveBeenCalledTimes(1);
        });
      });

      describe('setItem', function () {
        it('sets item', function () {
          // Mocking window because Safari throws an error when setting a storage item in
          // Private Browser Mode.
          const mockWindow = {};
          mockWindow[storageType] = createMockStorage();

          const getNamespacedStorage = injectGetNamespacedStorage({
            window: mockWindow
          });

          const storage = getNamespacedStorage(storageType, 'featurex');

          storage.setItem('foo', 'something');
          expect(mockWindow[storageType].getItem(itemKey)).toEqual('something');
        });

        it('proper error handling if storage is disabled', function () {
          mockTurbineVariable({
            logger: {
              warn: vi.fn()
            }
          });
          const mockWindow = createMockWindowUnavailableStorage();

          const getNamespacedStorage = injectGetNamespacedStorage({
            window: mockWindow
          });

          const storage = getNamespacedStorage(storageType, 'featurex');

          storage.setItem('thing', 'something');

          expect(window.localStorage.getItem('thing')).toBeNull();
        });
      });
    });
  });
});
