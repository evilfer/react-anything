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

describe('ReactAnything native component management', function () {

    var render, hooks, React;

    beforeEach(function () {
        var ReactAnything = require('./helpers/native-react-anything-test');
        React = ReactAnything.React;
        hooks = ReactAnything.hooks;
        render = ReactAnything.render;
    });

    it('should manage empty components', function () {
        var Leaf = createClass({
            render: false,
            componentDidMount: null
        });

        render(React.createElement(Leaf), 'root');
        expect(hooks.mount.mock.calls.length).toBe(0);
        expect(hooks.unmount.mock.calls.length).toBe(0);
        expect(hooks.update.mock.calls.length).toBe(0);
    });

    describe('mounting', function () {


        it('should mount simple native component', function () {
            var Leaf = createClass({
                render: React.createElement('simple'),
                componentDidMount: null
            });


            render(React.createElement(Leaf), 'root');
            expect(hooks.mount.mock.calls.length).toBe(1);
            expect(hooks.mount.mock.calls[0]).toEqual([1, 'simple', {}, null]);
            expect(hooks.unmount.mock.calls.length).toBe(0);
            expect(hooks.update.mock.calls.length).toBe(0);
        });

        it('should not pass key or children props to native impl', function () {
            var Leaf = createClass({
                render: false
            });

            var Root = createClass({
                render: React.createElement('simple', {
                    key: 1,
                    children: React.createElement(Leaf),
                    a: 'a'
                })
            });


            render(React.createElement(Root), 'root');
            expect(hooks.mount.mock.calls.length).toBe(1);
            expect(hooks.mount.mock.calls[0]).toEqual([1, 'simple', {a: 'a'}, null]);
        });

        it('should mount child native component', function () {
            var Root = createClass({
                render: React.createElement('parent', {
                    children: React.createElement('child')
                }),
                componentDidMount: null
            });

            render(React.createElement(Root), 'root');
            expect(hooks.mount.mock.calls.length).toBe(2);
            expect(hooks.mount.mock.calls[0]).toEqual([1, 'parent', {}, null]);
            expect(hooks.mount.mock.calls[1]).toEqual([2, 'child', {}, {id: 1, tag: 'parent', parent: null}]);
        });

        it('should notify after children mounted', function () {
            var Root = createClass({
                render: React.createElement('parent', {
                    children: React.createElement('child')
                }),
                componentDidMount: null
            });

            render(React.createElement(Root), 'root');
            expect(hooks.childrenMount.mock.calls.length).toBe(1);
            expect(hooks.childrenMount.mock.calls[0]).toEqual([
                {id: 1, tag: 'parent', parent: null},
                [{id: 2, tag: 'child', parent: 1}]
            ]);
        });

        it('should mount non-direct native child', function () {
            var Leaf = createClass({
                render: React.createElement('child')
            });

            var Root = createClass({
                render: React.createElement('parent', {
                    children: React.createElement(Leaf)
                })
            });

            render(React.createElement(Root), 'root');
            expect(hooks.mount.mock.calls.length).toBe(2);
            expect(hooks.mount.mock.calls[0]).toEqual([1, 'parent', {}, null]);
            expect(hooks.mount.mock.calls[1]).toEqual([2, 'child', {}, {id: 1, tag: 'parent', parent: null}]);
        });
    });

    describe('updating', function () {
        it('should update component', function (done) {
            var Root = createClass({
                    getInitialState: {s: 0},
                    render: function (props, state) {
                        return React.createElement('parent', {s: state.s});
                    },
                    componentDidMount: function () {
                        this.setState({s: 1}, onUpdate);
                    }
                }),

                onUpdate = function () {
                    expect(hooks.mount.mock.calls.length).toBe(1);
                    expect(hooks.update.mock.calls.length).toBe(1);
                    expect(hooks.update.mock.calls[0]).toEqual([{id: 1, tag: 'parent', parent: null}, {s: 1}, {s: 0}]);
                    done();
                };

            render(React.createElement(Root), 'root');
        });
    });

    describe('unmounting', function () {
        it('should unmount component', function (done) {
            var Root = createClass({
                    getInitialState: {s: 0},
                    render: function (props, state) {
                        return state.s === 0 ? React.createElement('parent', {s: state.s}) : false;
                    },
                    componentDidMount: function () {
                        this.setState({s: 1}, onUpdate);
                    }
                }),

                onUpdate = function () {
                    expect(hooks.mount.mock.calls.length).toBe(1);
                    expect(hooks.unmount.mock.calls.length).toBe(1);
                    expect(hooks.unmount.mock.calls[0]).toEqual([{id: 1, tag: 'parent', parent: null}]);
                    expect(hooks.update.mock.calls.length).toBe(0);
                    done();
                };

            render(React.createElement(Root), 'root');
        });

        it('should unmount component on new key', function (done) {
            var Root = createClass({
                    getInitialState: {s: 0},
                    render: function (props, state) {
                        return React.createElement('parent', {key: state.s});
                    },
                    componentDidMount: function () {
                        this.setState({s: 1}, onUpdate);
                    }
                }),

                onUpdate = function () {
                    expect(hooks.mount.mock.calls.length).toBe(2);
                    expect(hooks.mount.mock.calls[0]).toEqual([1, 'parent', {}, null]);
                    expect(hooks.mount.mock.calls[1]).toEqual([2, 'parent', {}, null]);
                    expect(hooks.unmount.mock.calls.length).toBe(1);
                    expect(hooks.unmount.mock.calls[0]).toEqual([{id: 1, tag: 'parent', parent: null}]);
                    expect(hooks.update.mock.calls.length).toBe(0);
                    done();
                };

            render(React.createElement(Root), 'root');
        });


        it('should replace component', function (done) {
            var Root = createClass({
                    getInitialState: {s: 0},
                    render: function (props, state) {
                        return React.createElement(state.s === 0 ? 'a' : 'b', {s: state.s});
                    },
                    componentDidMount: function () {
                        this.setState({s: 1}, onUpdate);
                    }
                }),

                onUpdate = function () {
                    expect(hooks.mount.mock.calls.length).toBe(2);
                    expect(hooks.mount.mock.calls[0]).toEqual([1, 'a', {s: 0}, null]);
                    expect(hooks.mount.mock.calls[1]).toEqual([2, 'b', {s: 1}, null]);
                    expect(hooks.unmount.mock.calls.length).toBe(1);
                    expect(hooks.unmount.mock.calls[0]).toEqual([{id: 1, tag: 'a', parent: null}]);
                    expect(hooks.update.mock.calls.length).toBe(0);
                    done();
                };

            render(React.createElement(Root), 'root');
        });
    });

});
