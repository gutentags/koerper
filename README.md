
# Koerper

> Körper, from Middle High German, from Latin *corpus*, meaning *body*.

Koerper provides a virtual DOM interface, based on [Wizdom][], that implements
an additional "body" node type and proxies attributes and event listeners
through the actual document.
Body nodes enable encapsulation of a region within a document without
necessitating a container element.
This enables [Gutentag][] to farm out portions of its actual document to
components, giving those components great flexibility to determine the shape of
their content, simultanously allowing components to be composed with any
structure.
This is particularly useful for components that do not need a container element,
like repeat and reveal tags, as well as components that need to be peers in the
flex-box model.

[Wizdom]: https://github.com/gutentags/wizdom
[Gutentag]: https://github.com/gutentags/gutentag

## Installation

```
npm install --save koerper
```

## Examples

Koerper provides a Document constructor that accepts an element from the actual
document.
The virtual document will control the content of the actual node.

```js
var Document = require("koeper");
var document = new Document(window.document.body);
```

The document has a `createBody()` method that will return an instance of the new
body node type.

```js
var body = document.createBody();
```

Body elements can be added and removed from the virtual document, and their
content will be added or removed from their corresponding position in the actual
document.

```js
body.appendChild(document.createTextNode("Guten Tag, Welt!"));
var em = document.createElement("em");
em.appendChild(body);
document.documentElement.appendChild(em);
```

Body elements can contain deeply nested body elements and retain the ability to
add and remove their children from the actual document.

```js
var subBody = document.createBody();
body.appendChild(subBody);
```

Because body nodes do not introduce container elements, you can even interpolate
text on the actual document.

```js
var body = document.createBody();
var greet = document.createTextNode("Guten Tag");
var who = document.createTextNode("Welt");
body.appendChild(greet);
body.appendChild(document.createTextNode(", ");
body.appendChild(who);
body.appendChild(document.createTextNode("!");
document.documentElement.appendChild(body);
```

And you can insert or remove the body within another body.

```js
var quoted = document.createBody();
quoted.appendChild(document.createTextNode("\\""));
quoted.appendChild(body);
quoted.appendChild(document.createTextNode("\\""));

// later ...
quoted.removeChild(body);
```

## Copyright and License

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License.

