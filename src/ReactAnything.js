/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. 
 *
 */
'use strict';

var ReactPerf = require('react/lib/ReactPerf');
var ReactVersion = require('react/lib/ReactVersion');

var ReactAnythingMount = require('./ReactAnythingMount');
var ReactAnythingInjection = require('./ReactAnythingInjection');

var warning = require('warning');

var render = ReactPerf.measure('React', 'render', ReactAnythingMount.render);


var createReactAnything = function (React, nativeImplementation) {
    ReactAnythingInjection.inject(nativeImplementation);

    var ReactAnything = {
        React: React,
        render: render,
        version: ReactVersion,
        components: (nativeImplementation.components.types || []).reduce(function (acc, tag) {
            acc[tag] = tag;
            return acc;
        }, {})
    };

    return ReactAnything;
};

module.exports = createReactAnything;
