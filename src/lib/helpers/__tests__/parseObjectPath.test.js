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

var parseObjectPath = require('../parseObjectPath');

describe('parseObjectPath', function() {
  it('parses simple paths in dot notation', function() {
    expect(parseObjectPath('a')).toEqual(['a']);
    expect(parseObjectPath('a.b.c')).toEqual(['a','b','c']);
  });

  it('parses simple paths in bracket notation', function() {
    expect(parseObjectPath('["c"]')).toEqual(['c']);
    expect(parseObjectPath('a["b"]["c"]')).toEqual(['a','b','c']);
    expect(parseObjectPath('["a"]["b"]["c"]')).toEqual(['a','b','c']);
  });

  it('parses numeric nodes in bracket notation', function() {
    expect(parseObjectPath('[5]')).toEqual(['5']);
    expect(parseObjectPath('[5]["a"][3][\'b\']')).toEqual(['5','a','3','b']);
  });

  it('parses a combination of dot and bracket notation', function() {
    expect(parseObjectPath('a[1].b.c.d["e"][\'f\'].g')).toEqual(['a','1','b','c','d','e','f','g']);
  });

  it('parses unicode characters', function() {
    expect(parseObjectPath('∑´ƒ©∫∆.ø')).toEqual(['∑´ƒ©∫∆','ø']);
    expect(parseObjectPath('["∑´ƒ©∫∆"]["ø"]')).toEqual(['∑´ƒ©∫∆','ø']);
  });

  it('parses nodes with control characters', function() {
    expect(parseObjectPath('["a.b."]')).toEqual(['a.b.']);
    expect(parseObjectPath('["\""][\'\\\'\']')).toEqual(['"','\'']);
    expect(parseObjectPath('["\'"][\'"\']')).toEqual(['\'','"']);
    expect(parseObjectPath('["\\""][\'\\\'\']')).toEqual(['"','\'']);
    expect(parseObjectPath('[\'\\"\']["\\\'"]')).toEqual(['\\"','\\\'']);
    expect(parseObjectPath('["\\"]"]["\\"]\\"]"]')).toEqual(['"]','"]"]']);
    expect(parseObjectPath('["[\'a\']"][\'[\\"a\\"]\']')).toEqual(['[\'a\']','[\\"a\\"]']);
  });
});
