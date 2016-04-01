/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

module.exports = {
    mount: jest.genMockFunction(),
    childrenMount: jest.genMockFunction(),
    unmount: jest.genMockFunction(),
    update: jest.genMockFunction(),
    initialize: jest.genMockFunction(),
    close: jest.genMockFunction()
};
