/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

var React = require('react');
var ReactAnythingInjection = require('./ReactAnythingInjection');
var createReactAnything = require('./ReactAnything');

ReactAnythingInjection.clear();

var createNativeReactAnything = function (nativeImplementation) {
    return createReactAnything(React, nativeImplementation);
};

module.exports = createNativeReactAnything;
