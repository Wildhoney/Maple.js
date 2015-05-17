# Maple.js

![Travis](http://img.shields.io/travis/Wildhoney/Maple.js.svg?style=flat)
&nbsp;
![npm](http://img.shields.io/npm/v/maple.js.svg?style=flat)
&nbsp;
![License MIT](http://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat)

* **Heroku**: [http://maple-app.herokuapp.com/](http://maple-app.herokuapp.com/)
* **npm:** `npm install maple.js`
* **Bower:** `bower install maple.js`

---

Maple is a seamless module that allows you to organise your [React](https://facebook.github.io/react/) project in terms of [webcomponents](http://webcomponents.org/) &mdash; with HTML Imports, Shadow DOM, and Custom Elements &mdash; allowing you to implement any [F](https://github.com/addthis/fluxthis)[l](https://github.com/spoike/refluxjs)[u](https://github.com/martyjs/marty)[x](https://github.com/BinaryMuse/fluxxor) architecture you choose, and then compile with [`Mapleify`](#mapleify-vulcanization) for production.

![Screenshot](media/Screenshot%232.png)

## Getting Started

> :maple_leaf: Watch "Getting Started with Maple": [https://vimeo.com/127515471](https://vimeo.com/127515471)

Given the typical Flux architecture where components reside in their respective `components` directory, we continue that trend in Maple, where **one** component can register **one or many** custom elements &ndash; but each HTML document can only have **one** `template` element.

Within the directory `my-app/components` we create our component's index that will be imported &mdash; `date-time.html` &mdash; which will import its associated JavaScript and CSS documents:

```html
<template>
    <script type="text/jsx" src="date-time.js"></script>
    <script type="text/javascript" src="../../../vendor/moment/moment.js"></script>
    <link rel="stylesheet" type="text/css" href="date-time.css" />
</template>
```

**Note:** When we import the `date-time.js` file we use the local path, which Maple.js understands as being a part of the module &ndash; whereas our third-party module &mdash; `moment.js` &mdash; resides outside of the component's directory and is therefore imported into the `window` scope.

Within our CSS file, we can be as loose as we like, because the `date-time.js` component will be imported under its own shadow boundary, preventing the styles from bleeding over into other components &mdash; even components that are children of our component.

We next need to add [some standard ES6 React code](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html) to our `date-time.js` to make it return a date and time when rendered:

```javascript
export default class MyDateTime extends React.Component {

    render() {
        let dateTime = moment().format(this.props.format || 'YYYY-MM-DD');
        return <time>{dateTime}</time>
    }

}
```

**Note:** You could use the `React.createElement('datetime', null, dateTime)` approach as well &ndash; the `System.import` we use recognises when it's a JSX file and will transpile it automatically for you.

By looking at the above React component, we can immediately deduce that the *eventual* custom element will be called `my-date-time`. For those eagle-eyed individuals amongst us, you'll have noticed we use `this.props.format` to specify the date/time format &ndash; and this is something we'll pass into our component when adding the custom element to the DOM.

Next all we need to do is add a little CSS to our `date-time.css` document:

```css
time {
    color: rebeccapurple;
    font-family: Arial, Tahoma, Helvetica, sans-serif;
}
```

And finally import the component into our main `index.html` document that includes the `maple.js` and `react.js` imports:

```html
<link rel="import" type="text/html" href="my-app/components/time-date/index.html" />
```

**Note:** You may have noticed that the component's directory name is largely irrelevant &ndash; and it is, in most cases. However, there are certain circumstances where the component's directory matters &ndash; such as when registering a `WebWorker` &mdash; In this case Maple provides the component directory as `this.props.path`.

Once the HTML document has been imported, Maple will register our custom element and it will be then usable in our application &ndash; although don't forget that we should pass in the *optional* `format` attribute to override `YYYY-MM-DD`:

```javascript
<my-date-time data-format="YYYY-MM-DD HH:mm"></my-date-time>
```

**Note:** In the above example we use `data-format`, whereas our React component expects `format` &mdash; you'll be glad to know that in these cases, Maple strips the `data-` segment from the attribute, which allows you to write perfectly valid HTML5 syntax.

### Ignore Import

Importing a HTML file may not require Maple at all, and therefore if the imports were left to be processed by Maple this would be a waste of resources &ndash; as no components would be contained within the import. For these cases you can add the `data-ignore` attribute to the HTML import, and Maple will leave them unprocessed:

```html
<link rel="import" type="text/html" href="example.html" data-ignore />
```

### Multiple Elements

Each HTML document can have **exactly** one `template` element registering components. In cases where you want to register multiple components, you **must** split them into their individual HTML documents for developers to import separately. For instance, a `DateTime` component could yield `date-time-gmt`, `date-time-bst`, etc... Each element can have its own associated CSS documents as well. There are two approaches for this:

 1. Create two HTML documents: `index-gmt.html` and `index-bst.html` and require them to be imported separately;
 2. Create one HTML import with one `template` node and import both JS documents with a shared CSS document:
 
```html
<template>
    <script type="text/javascript" src="datetime-gmt.js"></script>
    <script type="text/javascript" src="datetime-bst.js"></script>
    <link rel="stylesheet" type="text/css" href="shared.css" />
</template>
```

Choosing between the two approaches should be evident &ndash; if you want to apply custom CSS documents to each component individually &mdash; **datetime-gmt.css** to one, and **datetime-bst.css** to the other &mdash; then you should have two HTML documents. Otherwise if the two are directly related, and share the same CSS and JS documents, then they can be kept together in one HTML document.

### JSX Compilation

In development environments it is often useful to compile JSX documents &mdash; Maple supports JSX compilation. All you have to do is import JSX the usual JSX way using the `text/jsx` type:
 
 ```html
 <template>
     <script type="text/jsx" src="my-jsx-document.js"></script>
 </template>
 ```
 
**Note:** When using [`Mapleify`](#mapleify-vulcanization) to render your app &ndash; Mapleify merely changes the type of your `script` elements from `text/jsx` to `text/javascript` and changes the extensions from **.jsx** to **.js** (pre `v1.2.0` when JSX files were included with JSX extensions) &ndash; it's left entirely up to the developer to write their Gulp/Grunt scripts to convert their JSX &mdash; and SASS &mdash; documents prior to `Mapleify` compilation.
 
**Also Note:** Since the release of [`v1.2.0`](https://github.com/Wildhoney/Maple.js/tree/v1.2.0) JSX files **must** have a JS extension &ndash; also JSX files will import just fine using a `text/javascript` type, too.
 
### Nested Shadow Boundaries

As Maple uses Custom Elements to create the components, it's straightforward to have components within components &ndash; you only need to place your Custom Element node into your React component:


```javascript
render() {
    return <li><date-time data-unix={model.date}></date-time></li>
}
```

### Resolved Components (FOUC)

Maple uses the same mechanism as Polymer when it comes to preventing FOUC. Place the `unresolved` attribute on each element, and then once they're upgraded by Maple, the `unresolved` attribute will be replaced with the `resolved` attribute:

```html
<date-time unresolved></date-time>
```

With the following styles the `date-time` element will fade in gradually once upgraded:

```css
date-time {
    opacity: 0;
    display: block;
    transition: opacity 3s;
}

date-time[resolved] {
    opacity: 1;
}
```
 
## Mapleify (Vulcanization)

For development purposes the HTML Imports are an acceptable design implementation &ndash; however when pushing to production &mdash; as you do with Polymer &mdash; you'll want to minify and concatenate your resources. In Polymer you would use [`vulcanize`](https://github.com/polymer/vulcanize) &ndash; `Maple` utilises `vulcanize` to create [`Mapleify`](https://github.com/Wildhoney/Mapleify) which compiles your HTML document.

You can install `Mapleify` globally with [npm](https://www.npmjs.com/): `npm install mapleify -g` &ndash; it can then be used from your terminal:

> `mapleify -i index.html` (default renders to `mapleify.html` &ndash; change with `-o rendered.html`)

## Browser Support

![Chrome](https://github.com/alrra/browser-logos/raw/master/chrome/chrome_64x64.png)
![Firefox](https://github.com/alrra/browser-logos/raw/master/firefox/firefox_64x64.png)
![Firefox](https://github.com/alrra/browser-logos/raw/master/opera/opera_64x64.png)
![Safari](https://github.com/alrra/browser-logos/raw/master/safari/safari_64x64.png)

Maple also comes distributed with a **dist/maple-with-polyfills.js** file that includes all necessary polyfills for the widest possible support in modern browsers.

## Example Todo

We have a typical [todo example on Heroku](http://maple-app.herokuapp.com/) which uses Maple along with the [Alt.js](https://github.com/goatslacker/alt) Flux library. Everything should look familiar to a seasoned React.js developer &ndash; with the customary stores and actions &ndash; where the codebase differs is in the **components** directory, where each of the three components are written in ES6 and exported using `export default`.

## Testing

`Maple` uses Polymer's [`wct` testing tool](https://github.com/Polymer/web-component-tester) &ndash; which relies on the [Chai](http://chaijs.com/) assertion library.

* `npm install`
* `bower install`
* `gulp test`

Optionally you may also invoke the `wct` testing yourself by issuing the `wct` command in your terminal.

![Screenshot](media/Screenshot%233.png)