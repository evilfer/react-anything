/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * This file is a modified version of:
 *  react/lib/ReactComponentEnvironment.js
 *  Copyright (c) 2013-present, Facebook, Inc.
 *  All rights reserved.
 *  
 */
'use strict';

var ReactPerf = require('react/lib/ReactPerf');

var ReactAnythingComponentEnvironment = {
    processChildrenUpdates: function (a, b, c) {
    },
    replaceNodeWithMarkup: function (a, b, c) {
    }
};

ReactPerf.measureMethods(
    ReactAnythingComponentEnvironment,
    'ReactAnythingComponentEnvironment',
    {
        replaceNodeWithMarkup: 'replaceNodeWithMarkup',
    }
);

module.exports = ReactAnythingComponentEnvironment;
