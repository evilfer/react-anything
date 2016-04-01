# react-anything

`react-anything` is a library to create easily native implementations
of React. Originall React was intended to manipulate DOM elements; React Native,
on the other hand, manipulates native mobile views. Similarly, `react-anything` is intended to
facilitate using React to manipulate any other elements.
In other words, it helps creating React applications where there is no DOM or mobile views.

This library was first developed to support `react-phaser`.

Most likely `react-anything` will be soon obsolete, since it seems that React
will eventually implement a complete DOM-free version.

### Default React vs React.native

As of version 0.15.rc2, the default React package loads the DOM manipulation code.
`react-anything` modifies the default React object to remove the DOM related code,
and links React with any other implementation.

As an alternative, it's possible to use `react-anything/src/native`, which loads a
a React version without any DOM related code.

`react-anything` and `react-anything/src/native` should behave exactly in the same way.
However, the later will compile to a smaller production file (~130KB using webpack).
On the other hand, if you want to use any other library that also requires React (e.g., react-redux),
the default `react-anything` should be used.
