# Maple

## HTML Imports

Maple HTML imports are intended to be simpler than Polymer by having zero inline JavaScript and CSS documents:

```html
<template>
    <script type="text/javascript" src="module.js"></script>
    <link rel="stylesheet" type="text/css" href="module.css" />
</template>
```

In the above case your `module.js` document is a simple ES6 [React.js class](https://facebook.github.io/react/docs/tutorial.html):

```javascript
export default class MyModule extends React.Component {

}
```

Using introspection, Maple uses ES6's `System.import` to import the above module, and subsequently registering an element using `document.registerElement` and then transforming the `class` name to its underscore equivalent &ndash; in the code above `MyModule` will create a custom element `my-module` using your React.js class blueprint:

```html
<my-module></my-module>
```

## FOUC

Maple uses the same mechanism as [Polymer](https://www.polymer-project.org/0.5/docs/polymer/styling.html) for the FOUC with the `unresolved` and `resolved` attributes. With this implementation you can hide elements that you define with the `unresolved` attribute:

```html
<my-element unresolved></my-element>
```

Once the element has been upgraded the `unresolved` attribute will be removed by Maple &ndash; and will instead be replaced with the `resolved` attribute.