/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is a modified version of:
 *  react/lib/ReactReconcileTransaction.js
 *  Copyright (c) 2013-present, Facebook, Inc.
 *  All rights reserved.
 *  
 */
'use strict';

var CallbackQueue = require('react/lib/CallbackQueue');
var PooledClass = require('react/lib/PooledClass');
var Transaction = require('react/lib/Transaction');

var assign = require('object-assign');

var ON_READY_QUEUEING = {
    initialize: function () {
        this.reactMountReady.reset();
    },

    close: function () {
        this.reactMountReady.notifyAll();
    }
};

var createTransactionType = function (nativeImplementation) {
    var TRANSACTION_WRAPPERS = [ON_READY_QUEUEING];

    if (nativeImplementation) {
        TRANSACTION_WRAPPERS.push(nativeImplementation);
    }

    var ReactAnythingReconcileTransaction = function () {
        this.reinitializeTransaction();
        // Only server-side rendering really needs this option (see
        // `ReactServerRendering`), but server-side uses
        // `ReactServerRenderingTransaction` instead. This option is here so that it's
        // accessible and defaults to false when `ReactDOMComponent` and
        // `ReactTextComponent` checks it in `mountComponent`.`
        this.reactMountReady = CallbackQueue.getPooled(null);
    };

    var Mixin = {
        getTransactionWrappers: function () {
            return TRANSACTION_WRAPPERS;
        },

        getReactMountReady: function () {
            return this.reactMountReady;
        },

        checkpoint: function () {
            // reactMountReady is the our only stateful wrapper
            return this.reactMountReady.checkpoint();
        },

        rollback: function (checkpoint) {
            this.reactMountReady.rollback(checkpoint);
        },

        destructor: function () {
            CallbackQueue.release(this.reactMountReady);
            this.reactMountReady = null;
        }
    };


    assign(ReactAnythingReconcileTransaction.prototype, Transaction.Mixin, Mixin);

    PooledClass.addPoolingTo(ReactAnythingReconcileTransaction);

    return ReactAnythingReconcileTransaction;
};

module.exports = createTransactionType;
