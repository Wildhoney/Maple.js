<img alt="Maple.js" src="media/logo.png" width="400" />

![Travis](http://img.shields.io/travis/Wildhoney/Maple.js.svg?style=flat)
&nbsp;
![npm](http://img.shields.io/npm/v/maple.js.svg?style=flat)
&nbsp;
![License MIT](http://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat)

* **Heroku**: [http://maple-app.herokuapp.com/](http://maple-app.herokuapp.com/)
* **npm:** `npm install maple.js`
* **Bower:** `bower install maple.js`

---

## Getting Started

We'll begin by creating our very first Maple component. In the Maple framework, all components are associated with a custom element, therefore we first need to decide what that's going to be &ndash; in this example we're going to create a `<local-time>` element which is often cited as a [typical example of a web component](http://webcomponents.org/articles/interview-with-joshua-peek/) used by GitHub.com.

In the main `index.html` we'll add the custom element, and import our component's `index.html`:

```html
<link rel="import" resource="component" type="text/html" href="app/components/first-module/index.html" />
<!-- ... -->
<local-time></local-time>
```

**Note:** In the above example, the `resource` attribute is essential, as this distinguishes it from other non-Maple HTML imports. Currently Maple supports two constants for the `resource` attribute: `component` for a custom element, and `view` for a collection of custom elements and other HTML used by Maple's router &ndash; [Director](https://github.com/flatiron/director).

We'll then create our `local-time.js` file inside of `app/components/first-module` and create a standard React.js component using ES6 syntax that extends `React.Component` &mdash; we don't yet need the added benefits of extending `Maple.Component`:

```javascript
export default class LocalTime extends React.Component {

    /**
     * @method render
     * @return {Object}
     */
    render() {
        return React.createElement('div', null, Date.now());
    }

}
```

**Note:** It's important to remember that in all we've created, the file names are **irrelevant**, however the above class name (`LocalTime`) determines what our custom element is going to be (`local-time`).

Finally we merely need to include the `local-time.js` to our `app/components/first-module/index.html` document:

```html
<template>
    <script type="text/javascript" src="local-time.js"></script>
</template>
```

**Voila!**

By the way, adding a CSS document to our component is also very easy:

```html
<template>
    <script type="text/javascript" src="local-time.js"></script>
    <link rel="stylesheet" type="text/css" href="local-time.css" />
</template>
```

And since Maple uses the shadow root we can be as loose as we like in that CSS document, because the only HTML we're going to affect is our `local-time` element. Clever, right?

```css
div {
    box-shadow: 0 0 5px rgba(0, 0, 0, .25);
    padding: 5px 8px;
    font-size: 11px;
    color: rebeccapurple;
}
```

## HTML Imports

HTML imports in Maple are intended to be **much** simpler than Polymer by having zero inline JavaScript and CSS documents:

```html
<template>
    <script type="text/javascript" src="module.js"></script>
    <link rel="stylesheet" type="text/css" href="module.css" />
</template>
```

**Note:** Components can define one or **more** custom HTML elements (one-to-many relationship), and therefore may rely upon one or more JavaScript/CSS documents.

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

### Loading Messages

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

### Component Path

Maple also helpfully registers the `this.props.path` property for you, which is a `string` that points to your component's root &ndash; if you're working on a file in `app/components/people-list/people.js` then `this.props.path` will helpfully point to `app/components/people-list` which should be used for referencing other files &ndash; for example a `WebWorker` that resides in your component directory.

```javascript
let webWorker = new WebWorker(`${this.props.path}/An-Intensive-Process.js`);
```

### Properties as HTML Attributes

When you define your custom HTML element, you can pass in properties as normal HTML attributes that will be registered as `this.props.x` &ndash; where `x` is your attribute's name:

```html
<animal-enumeration data-animals="Cat,Dog,Sheep,Horse,Elephant"></animal-enumeration>
```

**Note:** `data` prefix will be removed from any attributes that have it, yielding `this.props.animals` in the above case as a `string`.