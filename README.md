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

Maple is a seamless module that allows you to organise your [React](https://facebook.github.io/react/) project in terms of [webcomponents](http://webcomponents.org/) &mdash; with HTML Imports, Shadow DOM, and Custom Elements &mdash; allowing you to implement any [F](https://github.com/addthis/fluxthis)[l](https://github.com/spoike/refluxjs)[u](https://github.com/martyjs/marty)[x](https://github.com/BinaryMuse/fluxxor) architecture you choose.

Given the typical Flux architecture where components reside in their respective `components` directory, we continue that trend in Maple, where **one** component can register **one or many** custom elements.

Within the directory `my-app/components` we create our component's index that will be imported &mdash; `date-time.html` &mdash; which will import its associated JavaScript and CSS documents:

```html
<template>
    <script type="text/maple" src="date-time.js"></script>
    <script type="text/javascript" src="../../../vendor/moment/moment.js"></script>
    <link rel="stylesheet" type="text/css" href="date-time.css" />
</template>
```

**Note:** When we import the `date-time.js` file we use the type `text/maple`, whereas for the third-party library our component depends on &mdash; `moment.js` &mdash; we specify this as a regular JavaScript file with the `text/javascript` type. It's important to remember that components added with the type `text/maple` will be entirely handled by Maple, and those imported as `text/javascript` will be imported into the global scope of the document.

Within our CSS file, we can be as loose as we like, because the `date-time.js` component will be imported under its own shadow boundary, preventing the styles from bleeding over into other components &mdash; even components that are children of our component.

We next need to add [some standard ES6 React code](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html) to our `date-time.js` to make it return a date and time when rendered:

```javascript
export default class MyDateTime extends React.Component {

    render() {
        let dateTime = moment().format(this.props.format || 'YYYY-MM-DD');
        return React.createElement('datetime', null, dateTime);
    }

}
```

By looking at the above React component, we can immediately deduce that the *eventual* custom element will be called `my-date-time`. For those eagle-eyed individuals amongst us, you'll have noticed we use `this.props.format` to specify the date/time format &ndash; and this is something we'll pass into our component when adding the custom element to the DOM.

Next all we need to do is add a little CSS to our `date-time.css` document:

```css
datetime {
    color: rebeccapurple;
    font-family: Arial, Tahoma, Helvetica, san-serif;
}
```

And finally import the component into our main `index.html` document that includes the `maple.js` and `react.js` imports:

```html
<link rel="import" type="text/html" href="app/components/time-date/index.html" />
```

**Note:** You may have noticed that the component's directory name is largely irrelevant &ndash; and it is, in most cases. However, there are certain circumstances where the component's directory matters &ndash; such as when registering a `WebWorker` &mdash; In this case Maple provides the component directory as `this.props.path`.

Once the HTML document has been imported, Maple will register our custom element and it will be then usable in our application &ndash; although don't forget that we need to pass in the `format` attribute:

```javascript
<my-date-time data-format="YYYY-MM-DD HH:mm"></my-date-time>
```

**Note:** In the above example we use `data-format`, whereas our React component expects `format` &mdash; you'll be glad to know that in these cases, Maple strips the `data-` segment from the attribute, which allows you to write perfectly valid HTML5 syntax.

### Ignore Import

Importing a HTML file may not require Maple at all, and therefore if the imports were left to be processed by Maple this would be a waste of resources &ndash; as no components would be contained within the import. For these cases you can add the `data-ignore` attribute to the HTML import, and Maple will leave them unprocessed:

```html
<link rel="import" type="text/html" href="example.html" data-ignore />
```