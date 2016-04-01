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

var assign = require('object-assign');
var invariant = require('invariant');
var warning = require('warning');


var ReactAnythingEmptyComponent = function (element) {
    this._currentElement = element;
    this._rootNodeID = null;
    this._nativeNode = null;
    this._nativeParent = null;
    this._nativeContainerInfo = null;
    this._wrapperState = null;
    this._topLevelWrapper = null;
};

ReactAnythingEmptyComponent.displayName = 'ReactAnythingEmptyComponent';

ReactAnythingEmptyComponent.Mixin = {
    mountComponent: function (transaction,
                              nativeParent,
                              nativeContainerInfo,
                              context) {
        this._nativeParent = nativeParent;
        this._nativeContainerInfo = nativeContainerInfo;

        this._nativeNode = {empty: true};
        return '';
    },

    receiveComponent: function (nextElement, transaction, context) {
        var prevElement = this._currentElement;
        this._currentElement = nextElement;
        this.updateComponent(transaction, prevElement, nextElement, context);
    },

    updateComponent: function (transaction, prevElement, nextElement, context) {
    },

    getNativeNode: function () {
        return this._nativeNode;
    },

    unmountComponent: function (safely) {
        this._rootNodeID = null;
    },

    getPublicInstance: function () {
        return this._currentElement;
    }
};


assign(
    ReactAnythingEmptyComponent.prototype,
    ReactAnythingEmptyComponent.Mixin
);

module.exports = ReactAnythingEmptyComponent;
