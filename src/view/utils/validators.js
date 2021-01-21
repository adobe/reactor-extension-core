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

/*eslint no-restricted-globals: 0*/
/*eslint object-curly-newline: 0*/
/*eslint implicit-arrow-linebreak: 0*/
export const isNumberLike = (value) =>
  !isNaN(value) && (typeof value !== 'string' || value.trim().length > 0);

export const isNumberLikeInRange = (value, options) => {
  const { min, minInclusive = true, max, maxInclusive = true } = options;

  return (
    isNumberLike(value) &&
    (min === undefined ||
      (minInclusive ? Number(value) >= min : Number(value) > min)) &&
    (max === undefined ||
      (maxInclusive ? Number(value) <= max : Number(value) < max))
  );
};

export const isInteger =
  Number.isInteger ||
  ((value) =>
    typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value);

export const isDataElementToken = (value) => /^%([^%]+)%$/.test(value);
