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

// The MIT License (MIT)
//
// Copyright (c) 2014 Mike Marcacci
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
//   The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


// Code extracted from https://github.com/mike-marcacci/objectpath/pull/12

/*eslint-disable*/
var r = {
  '\'': /\\\'/g,
  '"': /\\\"/g,
};

module.exports = function(str) {
  var i = 0;
  var parts = [];
  var d, b, q, c;
  while (i < str.length){
    d = str.indexOf('.', i);
    b = str.indexOf('[', i);

    // we've reached the end
    if (d === -1 && b === -1){
      parts.push(str.slice(i, str.length));
      i = str.length;
    }

    // dots
    else if (b === -1 || (d !== -1 && d < b)) {
      parts.push(str.slice(i, d));
      i = d + 1;
    }

    // brackets
    else {
      if (b > i){
        parts.push(str.slice(i, b));
        i = b;
      }
      q = str.slice(b+1, b+2);
      if (q !== '"' && q !=='\'') {
        c = str.indexOf(']', b);
        if (c === -1) c = str.length;
        parts.push(str.slice(i + 1, c));
        i = (str.slice(c + 1, c + 2) === '.') ? c + 2 : c + 1;
      } else {
        c = str.indexOf(q+']', b);
        if (c === -1) c = str.length;
        while (str.slice(c - 1, c) === '\\' && b < str.length){
          b++;
          c = str.indexOf(q+']', b);
        }
        parts.push(str.slice(i + 2, c).replace(r[q], q));
        i = (str.slice(c + 2, c + 3) === '.') ? c + 3 : c + 2;
      }
    }
  }
  return parts;
};
/*eslint-enable*/
