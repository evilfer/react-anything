/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

var ReactUpdates = require('react/lib/ReactUpdates');
var ReactNativeComponent = require('react/lib/ReactNativeComponent');
var ReactEmptyComponent = require('react/lib/ReactEmptyComponent');
var ReactDefaultBatchingStrategy = require('react/lib/ReactDefaultBatchingStrategy');
var ReactComponentEnvironment = require('react/lib/ReactComponentEnvironment');

var createReactAnythingReconcileTransaction = require('./ReactAnythingReconcileTransaction');
var createReactAnythingComponent = require('./ReactAnythingComponent');
var ReactAnythingEmptyComponent = require('./ReactAnythingEmptyComponent');
var ReactAnythingComponentEnvironment = require('./ReactAnythingComponentEnvironment');

var inject = function (nativeImplementation) {
    ReactUpdates.injection.injectReconcileTransaction(createReactAnythingReconcileTransaction(nativeImplementation.transaction));
    ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy);

    ReactNativeComponent.injection.injectGenericComponentClass(createReactAnythingComponent(nativeImplementation.components));

    ReactEmptyComponent.injection.injectEmptyComponentFactory(function (instantiate) {
        return new ReactAnythingEmptyComponent(instantiate);
    });

    if (ReactComponentEnvironment.unmountIDFromEnvironment ||
        ReactComponentEnvironment.unmountIDFromEnvironment ||
        ReactComponentEnvironment.processChildrenUpdates) {

        ReactComponentEnvironment.unmountIDFromEnvironment = ReactAnythingComponentEnvironment.unmountIDFromEnvironment;
        ReactComponentEnvironment.replaceNodeWithMarkup = ReactAnythingComponentEnvironment.replaceNodeWithMarkup;
        ReactComponentEnvironment.processChildrenUpdates = ReactAnythingComponentEnvironment.processChildrenUpdates;
    } else {
        ReactComponentEnvironment.injection.injectEnvironment(ReactAnythingComponentEnvironment);
    }
};

var clear = function () {
    ReactUpdates.ReactReconcileTransaction = null;
};

module.exports = {
    inject: inject,
    clear: clear
};
