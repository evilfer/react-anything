/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * This file is a modified version of:
 *  react/lib/ReactDOMComponent.js
 *  Copyright (c) 2013-present, Facebook, Inc.
 *  All rights reserved.
 *
 */
'use strict';

var ReactMultiChild = require('react/lib/ReactMultiChild');
var ReactPerf = require('react/lib/ReactPerf');

var assign = require('object-assign');
var invariant = require('invariant');
var warning = require('warning');


var globalIdCounter = 1;

var createImplementation = function (nativeImplementation) {

    var ReactAnythingComponent = function (element) {
        var tag = element.type;
        this._currentElement = element;
        this._tag = tag.toLowerCase();
        this._rootNodeID = null;
        this._renderedChildren = null;
        this._nativeNode = null;
        this._nativeParent = null;
        this._nativeContainerInfo = null;
        this._wrapperState = null;
        this._topLevelWrapper = null;
    };

    ReactAnythingComponent.displayName = 'ReactAnythingComponent';

    ReactAnythingComponent.Mixin = {
        mountComponent: function (transaction,
                                  nativeParent,
                                  nativeContainerInfo,
                                  context) {
            this._rootNodeID = globalIdCounter++;
            this._nativeParent = nativeParent;
            this._nativeContainerInfo = nativeContainerInfo;

            var props = this._currentElement.props;

            this._nativeNode = nativeImplementation.mount(this._rootNodeID, this._tag, props, nativeParent && nativeParent._nativeNode);
            var childrenImages = this.mountChildren(props.children, transaction, context);
            if (nativeImplementation.childrenMount && childrenImages.length > 0) {
                nativeImplementation.childrenMount(this._nativeNode, childrenImages);
            }
            return this._nativeNode;
        },

        receiveComponent: function (nextElement, transaction, context) {
            var prevElement = this._currentElement;
            this._currentElement = nextElement;
            this.updateComponent(transaction, prevElement, nextElement, context);
        },

        updateComponent: function (transaction, prevElement, nextElement, context) {
            var lastProps = prevElement.props;
            var nextProps = this._currentElement.props;

            nativeImplementation.update(this._nativeNode, nextProps, lastProps);

            this.updateChildren(nextProps.children, transaction, context);
        },

        getNativeNode: function () {
            return this._nativeNode;
        },

        unmountComponent: function (safely) {
            this.unmountChildren(safely);
            this._rootNodeID = null;
            nativeImplementation.unmount(this._nativeNode);
        },

        getPublicInstance: function () {
            return this._currentElement;
        }
    };

    ReactPerf.measureMethods(ReactAnythingComponent.Mixin, 'ReactAnythingComponent', {
        mountComponent: 'mountComponent',
        receiveComponent: 'receiveComponent',
    });

    assign(
        ReactAnythingComponent.prototype,
        ReactAnythingComponent.Mixin,
        ReactMultiChild.Mixin
    );

    return ReactAnythingComponent;
}

module.exports = createImplementation;
