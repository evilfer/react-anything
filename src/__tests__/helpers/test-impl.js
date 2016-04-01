/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

jest.mock('./test-impl-hooks');

var hooks = require('./test-impl-hooks');

module.exports = {
    components: {
        mount: function (id, tag, props, parent) {
            hooks.mount.apply(this, arguments);
            return {
                id: id,
                tag: tag,
                parent: parent && parent.id
            }
        },
        childrenMount: function (node, children) {
            hooks.childrenMount.apply(this, arguments);
        },
        unmount: function () {
            hooks.unmount.apply(this, arguments);
        },
        update: function () {
            hooks.update.apply(this, arguments);
        }
    },
    transaction: {
        initialize: function () {
            hooks.initialize();
        },
        close: function () {
            hooks.close();
        }
    },
    hooks: hooks
};
