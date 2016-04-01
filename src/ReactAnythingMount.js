/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is a modified version of:
 *  react/lib/ReactMount.js
 *  Copyright (c) 2013-present, Facebook, Inc.
 *  All rights reserved.
 *  
 */
'use strict';

var ReactElement = require('react/lib/ReactElement');
var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
var ReactUpdateQueue = require('react/lib/ReactUpdateQueue');
var ReactUpdates = require('react/lib/ReactUpdates');
var ReactReconciler = require('react/lib/ReactReconciler');
var ReactInstrumentation = require('react/lib/ReactInstrumentation');

var instantiateReactComponent = require('react/lib/instantiateReactComponent');

var invariant = require('fbjs/lib/invariant');
var warning = require('warning');

var ReactAnythingContainerInfo = require('./ReactAnythingContainerInfo');

var mountedRootComponents = {};
var mountedImages = {};
var __DEV__ = true;


function batchedMountComponentIntoNode(componentInstance, containerName, context) {
    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled(false);
    transaction.perform(
        mountComponentIntoNode,
        null,
        componentInstance,
        containerName,
        transaction,
        context
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);
}


function mountComponentIntoNode(componentInstance, containerName, transaction, context) {
    var markerName;
    if (false) {
        var element = componentInstance._currentElement;
        var type = element.type;
        markerName = 'React mount: ' + (
                typeof type === 'string' ? type :
                type.displayName || type.name
            );
        console.time(markerName);
    }

    var markup = ReactReconciler.mountComponent(
        componentInstance,
        transaction,
        null,
        ReactAnythingContainerInfo(componentInstance, containerName),
        context
    );

    if (markerName) {
        console.timeEnd(markerName);
    }

    ReactAnythingMount._mountImageIntoNode(
        markup,
        containerName,
        componentInstance,
        transaction,
        context
    );
}


var ReactAnythingMount = {
    render: function (nextElement, containerName, callback) {
        invariant(
            ReactElement.isValidElement(nextElement),
            'ReactAnyting.render(): Invalid component element.%s',
            (
                typeof nextElement === 'string' ?
                ' Instead of passing a string like \'div\', pass ' +
                'React.createElement(\'div\') or <div />.' :
                    typeof nextElement === 'function' ?
                    ' Instead of passing a class like Foo, pass ' +
                    'React.createElement(Foo) or <Foo />.' :
                        // Check if it quacks like an element
                        nextElement != null && nextElement.props !== undefined ?
                        ' This may be caused by unintentionally loading two independent ' +
                        'copies of React.' :
                            ''
            )
        );

        warning(
            containerName && typeof containerName === 'string',
            'render(): containerName must be a string'
        );

        var prevComponent = mountedRootComponents[containerName];

        if (prevComponent) {
            var prevElement = prevComponent._currentElement;

            if (shouldUpdateReactComponent(prevElement, nextElement)) {
                var publicInst = prevComponent._renderedComponent.getPublicInstance();
                var updatedCallback = callback && function () {
                        callback.call(publicInst);
                    };
                ReactAnythingMount._updateRootComponent(
                    prevComponent,
                    nextElement,
                    containerName,
                    updatedCallback
                );
                return publicInst;
            } else {
                ReactAnythingMount._unmountRootComponent(container);
            }
        }

        var component = ReactAnythingMount._renderNewRootComponent(nextElement, containerName);

        if (callback) {
            callback.call(component);
        }
        return component;
    },

    _updateRootComponent: function () {
    },

    _unmountRootComponent: function (containerName) {
    },
    
    _renderNewRootComponent: function (nextElement, containerName) {
        // Various parts of our code (such as ReactCompositeComponent's
        // _renderValidatedComponent) assume that calls to render aren't nested;
        // verify that that's the case.
        warning(
            ReactCurrentOwner.current == null,
            '_renderNewRootComponent(): Render methods should be a pure function ' +
            'of props and state; triggering nested component updates from ' +
            'render is not allowed. If necessary, trigger nested updates in ' +
            'componentDidUpdate. Check the render method of %s.',
            ReactCurrentOwner.current && ReactCurrentOwner.current.getName() ||
            'ReactCompositeComponent'
        );

        invariant(
            containerName && typeof containerName === 'string',
            '_registerComponent(...): Target containerName is not a string.'
        );

        var componentInstance = instantiateReactComponent(nextElement);

        // The initial render is synchronous but any updates that happen during
        // rendering, in componentWillMount or componentDidMount, will be batched
        // according to the current batching strategy.

        ReactUpdates.batchedUpdates(
            batchedMountComponentIntoNode,
            componentInstance,
            containerName,
            null
        );

        mountedRootComponents[containerName] = componentInstance;

        if (__DEV__) {
            ReactInstrumentation.debugTool.onMountRootComponent(componentInstance);
        }

        return componentInstance;
    },


    _mountImageIntoNode: function (markup, containerName, image, transaction, context) {
        invariant(
            typeof containerName === 'string',
            'mountComponentIntoNode(...): Target container is not valid.'
        );

        mountedImages[containerName] = image;
    }
};

module.exports = ReactAnythingMount;
