<img alt="Maple.js" src="logo.png" width="400" />

![Travis](http://img.shields.io/travis/Wildhoney/Maple.js.svg?style=flat)
&nbsp;
![npm](http://img.shields.io/npm/v/maple.js.svg?style=flat)
&nbsp;
![License MIT](http://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat)

* **Heroku**: [http://maple-app.herokuapp.com/](http://maple-app.herokuapp.com/)
* **npm:** `npm install maple.js`
* **Bower:** `bower install maple.js`

---

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

### Dispatcher

By extending the `Maple.Component` object you gain access to the `addEventListener` and `removeEventListener` methods. With this you can listen for events dispatched by the `Dispatcher`:

```javascript
componentDidMount() {
    this.addEventListener('people');
}
```

Once the `people` event has been dispatched, its payload will be used to update the `state` of your React view-controller.

#### Extending `React.Component`

If you insist on extending the `React.Component` object directly &ndash; rather than `Maple.Component` &mdash; which is perfectly fine (we're not upset) &mdash; then you must handle the dispatcher yourself. For this we recommend [taking a look at `Maple.Component`](https://github.com/Wildhoney/Maple.js/blob/master/src/components/Dispatcher.js) and how that handles the `Dispatcher` &ndash; in particular the `addEventListener` method.

### FOUC

Maple uses the same mechanism as [Polymer](https://www.polymer-project.org/0.5/docs/polymer/styling.html) for the FOUC with the `unresolved` and `resolved` attributes. With this implementation you can hide elements that you define with the `unresolved` attribute:

```html
<my-element unresolved></my-element>
```

Once the element has been upgraded the `unresolved` attribute will be removed by Maple &ndash; and will instead be replaced with the `resolved` attribute.

### Loading

In Maple when you generate the custom element in your HTML, you can define children which will be replaced &ndash; this allows you to add *loading* content for your component:

```html
<people-list>
    Loading People...
</people-list>
```

Once the element has been *upgraded* and the view-controller's `render` method has updated the `people-list`'s content, you still have access to a cloned version of what was there previously:

```javascript
console.log(this.props.element);
```

### Path

Maple also helpfully registers the `this.props.path` property for you, which is a `string` that points to your component's root &ndash; if you're working on a file in `app/components/people-list/people.js` then `this.props.path` will helpfully point to `app/components/people-list` which should be used for referencing other files &ndash; for example a `WebWorker` that resides in your component directory.

```javascript
let webWorker = new WebWorker(`${this.props.path}/An-Intensive-Process.js`);
```