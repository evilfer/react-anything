/**
 * Copyright 2016-present, Eloy Villasclaras
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * Tests whether ReactAnything manages correctly composite components.
 */
'use strict';

jest.autoMockOff();

var createClass = require('./helpers/composite-helper');

describe('ReactAnything composite component management', function () {

    var React, render;

    beforeEach(function () {
        var ReactAnything = require('./helpers/native-react-anything-test');
        React = ReactAnything.React;
        render = ReactAnything.render;
    });

    it('should render Leaf and empty component', function () {
        var Leaf = createClass({
            render: React.createElement('empty'),
            componentDidMount: null
        });

        render(React.createElement(Leaf), 'root');
        expect(Leaf.hooks.render.mock.calls.length).toBe(1);
        expect(Leaf.hooks.componentDidMount.mock.calls.length).toBe(1);
    });

    it('should render Node and child Leaf', function () {
        var Leaf = createClass({
                render: React.createElement('empty'),
                componentDidMount: null
            }),
            Branch = createClass({
                render: function (props) {
                    return React.createElement('group', {
                        children: props.children
                    });
                },
                componentDidMount: null
            }),
            Root = createClass({
                render: React.createElement(Branch, {
                    children: [React.createElement(Leaf), React.createElement(Leaf)]
                }),
                componentDidMount: null
            });

        render(React.createElement(Root), 'root');

        expect(Root.hooks.render.mock.calls.length).toBe(1);
        expect(Root.hooks.componentDidMount.mock.calls.length).toBe(1);
        expect(Branch.hooks.render.mock.calls.length).toBe(1);
        expect(Branch.hooks.componentDidMount.mock.calls.length).toBe(1);
        expect(Leaf.hooks.render.mock.calls.length).toBe(2);
        expect(Leaf.hooks.componentDidMount.mock.calls.length).toBe(2);
    });

    it('should receive props', function () {
        var Leaf = createClass({
            render: React.createElement('empty'),
            componentWillMount: null,
            componentDidMount: null
        });

        render(React.createElement(Leaf, {a: 1, b: 2}), 'root');

        expect(Leaf.hooks.render.mock.calls.length).toBe(1);
        expect(Leaf.hooks.render.mock.calls[0][0]).toEqual({a: 1, b: 2});
        expect(Leaf.hooks.componentWillMount.mock.calls.length).toBe(1);
        expect(Leaf.hooks.componentWillMount.mock.calls[0][0]).toEqual({a: 1, b: 2});
        expect(Leaf.hooks.componentDidMount.mock.calls.length).toBe(1);
        expect(Leaf.hooks.componentDidMount.mock.calls[0][0]).toEqual({a: 1, b: 2});
    });

    it('should receive initial state', function () {
        var Leaf = createClass({
            render: React.createElement('empty'),
            getInitialState: {s: 0},
            componentWillMount: null,
            componentDidMount: null
        });

        render(React.createElement(Leaf, {a: 1, b: 2}), 'root');

        expect(Leaf.hooks.getInitialState.mock.calls.length).toBe(1);
        expect(Leaf.hooks.getInitialState.mock.calls[0][0]).toEqual({a: 1, b: 2});

        expect(Leaf.hooks.render.mock.calls.length).toBe(1);
        expect(Leaf.hooks.render.mock.calls[0][1]).toEqual({s: 0});
        expect(Leaf.hooks.componentWillMount.mock.calls.length).toBe(1);
        expect(Leaf.hooks.componentWillMount.mock.calls[0][1]).toEqual({s: 0});
        expect(Leaf.hooks.componentDidMount.mock.calls.length).toBe(1);
        expect(Leaf.hooks.componentDidMount.mock.calls[0][1]).toEqual({s: 0});
    });

    it('should update component', function (done) {
        var onComponentMounted = function () {
                expect(Leaf.hooks.getInitialState.mock.calls.length).toBe(1);
                expect(Leaf.hooks.render.mock.calls[0][0]).toEqual({a: 1, b: 2});
                expect(Leaf.hooks.render.mock.calls.length).toBe(2);
                expect(Leaf.hooks.render.mock.calls[0][1]).toEqual({s: 0});
                expect(Leaf.hooks.render.mock.calls[1][1]).toEqual({s: 1});
                expect(Leaf.hooks.componentWillMount.mock.calls.length).toBe(1);
                expect(Leaf.hooks.componentDidMount.mock.calls.length).toBe(1);
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

        render(React.createElement(Leaf, {a: 1, b: 2}), 'root');
    });

    it('should update children', function (done) {
        var onComponentMounted = function () {
                expect(Parent.hooks.getInitialState.mock.calls.length).toBe(1);
                expect(Parent.hooks.render.mock.calls.length).toBe(2);

                expect(Leaf.hooks.render.mock.calls.length).toBe(2);
                expect(Leaf.hooks.render.mock.calls[1][0]).toEqual({a: 1, b: 2, s: 1});

                expect(Leaf.hooks.componentWillReceiveProps.mock.calls.length).toBe(1);
                expect(Leaf.hooks.componentWillReceiveProps.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 0});
                expect(Leaf.hooks.componentWillReceiveProps.mock.calls[0][2][0]).toEqual({a: 1, b: 2, s: 1});

                expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(1);
                expect(Leaf.hooks.componentWillUpdate.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 0});
                expect(Leaf.hooks.componentWillUpdate.mock.calls[0][2][0]).toEqual({a: 1, b: 2, s: 1});

                expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(1);
                expect(Leaf.hooks.componentDidUpdate.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 1});
                expect(Leaf.hooks.componentDidUpdate.mock.calls[0][2][0]).toEqual({a: 1, b: 2, s: 0});

                done();
            },

            Leaf = createClass({
                render: React.createElement('empty'),
                componentWillMount: null,
                componentDidMount: null,
                componentWillReceiveProps: null,
                componentWillUpdate: null,
                componentDidUpdate: null
            }),
            Parent = createClass({
                render: function (props, state) {
                    return React.createElement(Leaf, {a: props.a, b: props.b, s: state.s});
                },
                getInitialState: {s: 0},
                componentDidMount: function () {
                    this.setState({s: 1}, onComponentMounted);
                }
            });

        render(React.createElement(Parent, {a: 1, b: 2}), 'root');

        expect(Parent.hooks.getInitialState.mock.calls.length).toBe(1);
        expect(Parent.hooks.render.mock.calls.length).toBe(1);

        expect(Leaf.hooks.render.mock.calls.length).toBe(1);
        expect(Leaf.hooks.render.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 0});
        expect(Leaf.hooks.componentWillReceiveProps.mock.calls.length).toBe(0);
        expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(0);
        expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(0);
    });

    it('should unmount children', function (done) {
        var onComponentMounted = function () {
                expect(Leaf.hooks.render.mock.calls.length).toBe(1);

                expect(Leaf.hooks.componentWillReceiveProps.mock.calls.length).toBe(0);
                expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(0);
                expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(0);
                expect(Leaf.hooks.componentWillUnmount.mock.calls.length).toBe(1);
                expect(Leaf.hooks.componentWillUnmount.mock.calls[0][0]).toEqual({s: 0});
                done();
            },

            Leaf = createClass({
                render: React.createElement('empty'),
                componentWillReceiveProps: null,
                componentWillUpdate: null,
                componentDidUpdate: null,
                componentWillUnmount: null
            }),
            Parent = createClass({
                render: function (props, state) {
                    return state.s === 0 ? React.createElement(Leaf, {s: state.s}) : React.createElement('empty');
                },
                getInitialState: {s: 0},
                componentDidMount: function () {
                    this.setState({s: 1}, onComponentMounted);
                }
            });

        render(React.createElement(Parent, {a: 1, b: 2}), 'root');

        expect(Leaf.hooks.render.mock.calls.length).toBe(1);
        expect(Leaf.hooks.componentWillUnmount.mock.calls.length).toBe(0);
    });

    it('should update children depending on shouldComponentUpdate = true', function (done) {
        var onComponentMounted = function () {
                expect(Leaf.hooks.render.mock.calls.length).toBe(2);
                expect(Leaf.hooks.render.mock.calls[1][0]).toEqual({a: 1, b: 2, s: 1});

                expect(Leaf.hooks.shouldComponentUpdate.mock.calls.length).toBe(1);
                expect(Leaf.hooks.shouldComponentUpdate.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 0});
                expect(Leaf.hooks.shouldComponentUpdate.mock.calls[0][2][0]).toEqual({a: 1, b: 2, s: 1});

                expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(1);
                expect(Leaf.hooks.componentWillUpdate.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 0});
                expect(Leaf.hooks.componentWillUpdate.mock.calls[0][2][0]).toEqual({a: 1, b: 2, s: 1});

                expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(1);
                expect(Leaf.hooks.componentDidUpdate.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 1});
                expect(Leaf.hooks.componentDidUpdate.mock.calls[0][2][0]).toEqual({a: 1, b: 2, s: 0});

                done();
            },


            Leaf = createClass({
                render: React.createElement('empty'),
                shouldComponentUpdate: true,
                componentWillUpdate: null,
                componentDidUpdate: null
            }),
            Parent = createClass({
                render: function (props, state) {
                    return React.createElement(Leaf, {a: props.a, b: props.b, s: state.s});
                },
                getInitialState: {s: 0},
                componentDidMount: function () {
                    this.setState({s: 1}, onComponentMounted);
                }
            });

        render(React.createElement(Parent, {a: 1, b: 2}), 'root');

        expect(Leaf.hooks.render.mock.calls.length).toBe(1);
        expect(Leaf.hooks.shouldComponentUpdate.mock.calls.length).toBe(0);
        expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(0);
        expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(0);
    });

    it('should not update children depending on shouldComponentUpdate = false', function (done) {
        var onComponentMounted = function () {
                expect(Leaf.hooks.render.mock.calls.length).toBe(1);

                expect(Leaf.hooks.shouldComponentUpdate.mock.calls.length).toBe(1);
                expect(Leaf.hooks.shouldComponentUpdate.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 0});
                expect(Leaf.hooks.shouldComponentUpdate.mock.calls[0][2][0]).toEqual({a: 1, b: 2, s: 1});

                expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(0);
                expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(0);

                done();
            },


            Leaf = createClass({
                render: React.createElement('empty'),
                shouldComponentUpdate: false,
                componentWillUpdate: null,
                componentDidUpdate: null
            }),
            Parent = createClass({
                render: function (props, state) {
                    return React.createElement(Leaf, {a: props.a, b: props.b, s: state.s});
                },
                getInitialState: {s: 0},
                componentDidMount: function () {
                    this.setState({s: 1}, onComponentMounted);
                }
            });

        render(React.createElement(Parent, {a: 1, b: 2}), 'root');

        expect(Leaf.hooks.render.mock.calls.length).toBe(1);
        expect(Leaf.hooks.shouldComponentUpdate.mock.calls.length).toBe(0);
        expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(0);
        expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(0);
    });

    it('should not update children depending on shouldComponentUpdate = false', function (done) {
        var onComponentMounted = function () {
                expect(Leaf.hooks.render.mock.calls.length).toBe(1);

                expect(Leaf.hooks.shouldComponentUpdate.mock.calls.length).toBe(1);
                expect(Leaf.hooks.shouldComponentUpdate.mock.calls[0][0]).toEqual({a: 1, b: 2, s: 0});
                expect(Leaf.hooks.shouldComponentUpdate.mock.calls[0][2][0]).toEqual({a: 1, b: 2, s: 1});

                expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(0);
                expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(0);

                done();
            },

            Leaf = createClass({
                render: React.createElement('empty'),
                shouldComponentUpdate: false,
                componentWillUpdate: null,
                componentDidUpdate: null
            }),
            Parent = createClass({
                render: function (props, state) {
                    return React.createElement(Leaf, {a: props.a, b: props.b, s: state.s});
                },
                getInitialState: {s: 0},
                componentDidMount: function () {
                    this.setState({s: 1}, onComponentMounted);
                }
            });

        render(React.createElement(Parent, {a: 1, b: 2}), 'root');

        expect(Leaf.hooks.render.mock.calls.length).toBe(1);
        expect(Leaf.hooks.shouldComponentUpdate.mock.calls.length).toBe(0);
        expect(Leaf.hooks.componentWillUpdate.mock.calls.length).toBe(0);
        expect(Leaf.hooks.componentDidUpdate.mock.calls.length).toBe(0);
    });
});
