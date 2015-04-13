# Maple

## HTML Imports

HTML imports in Maple are intended to be **much** simpler than Polymer by having zero inline JavaScript and CSS documents:

```html
<template>
    <script type="text/javascript" src="module.js"></script>
    <link rel="stylesheet" type="text/css" href="module.css" />
</template>
```

In the above case your `module.js` document is a simple ES6 [React.js class](https://facebook.github.io/react/docs/tutorial.html) that *optionally* extends `Maple.Component`:

```javascript
export default class MyModule extends Maple.Component {

}
```

**Note:** By extending `Maple.Component` you gain access to many utility methods, such as `addEventListener` for easily binding to the dispatcher.

Using introspection Maple uses ES6's `System.import` to import the above module, subsequently registering an element using `document.registerElement`, and then transforming the `class` name to its underscore equivalent &ndash; in the code above `MyModule` will create a custom element `my-module` using your React.js class blueprint:

```html
<my-module></my-module>
```

As an immediate child of the `my-element` element a [shadow root](https://w3c.github.io/webcomponents/spec/shadow/) will be created, and the CSS documents from your `template` element imported:

```css
div {
    border: 1px solid red;
}
```

Therefore in the above example, the `border` property will **only** be applied to the `my-module` children, rather than all `div` elements.

## FOUC

Maple uses the same mechanism as [Polymer](https://www.polymer-project.org/0.5/docs/polymer/styling.html) for the FOUC with the `unresolved` and `resolved` attributes. With this implementation you can hide elements that you define with the `unresolved` attribute:

```html
<my-element unresolved></my-element>
```

Once the element has been upgraded the `unresolved` attribute will be removed by Maple &ndash; and will instead be replaced with the `resolved` attribute.