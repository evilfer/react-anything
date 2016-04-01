/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * Tests native implementation transaction callbacks.
 */

jest.autoMockOff();

var createClass = require('./helpers/composite-helper');

describe('ReactAnything transaction management', function () {

    var render, hooks, React;

    beforeEach(function () {
        var ReactAnything = require('./helpers/native-react-anything-test');
        React = ReactAnything.React;
        hooks = ReactAnything.hooks;
        render = ReactAnything.render;
    });

    it('should render Leaf and empty component', function () {
        var Leaf = createClass({
            render: React.createElement('empty'),
            componentDidMount: null
        });

        render(React.createElement(Leaf), 'root');
        expect(hooks.initialize.mock.calls.length).toBe(1);
        expect(hooks.close.mock.calls.length).toBe(1);
    });
    
    it('should run a second transaction on component update', function (done) {
        var onComponentMounted = function () {
                expect(hooks.initialize.mock.calls.length).toBe(2);
                expect(hooks.close.mock.calls.length).toBe(2);
                done();
            },

            Leaf = createClass({
                render: React.createElement('empty'),
                getInitialState: {s: 0},
                componentWillMount: null,
                componentDidMount: function () {
                    this.setState({s: 1}, onComponentMounted);
                }
            });

        render(React.createElement(Leaf), 'root');

        expect(hooks.initialize.mock.calls.length).toBe(1);
        expect(hooks.close.mock.calls.length).toBe(1);
    });
});
