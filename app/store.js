/*************************************************
 * SukraasLIS
 * Store.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
// import { createLogger } from 'redux-logger';

import reducers from './reducers/index';

// const logger = createLogger();

/**
 * Creates a store with given reducers
 */
export default createStore(reducers, applyMiddleware(thunk));
