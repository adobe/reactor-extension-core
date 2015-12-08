'use strict';
import { Map } from 'immutable';
import { applyMiddleware, createStore } from 'gleedux';
import logger from './middleware/logger';

let createStoreWithMiddleware = applyMiddleware(logger)(createStore);
let initialState = Map();

export default createStoreWithMiddleware(initialState);
