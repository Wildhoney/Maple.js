# Maple

## FOUC

Maple uses the same mechanism as [Polymer](https://www.polymer-project.org/0.5/docs/polymer/styling.html) for the FOUC with the `unresolved` and `resolved` attributes. With this implementation you can hide elements that you define with the `unresolved` attribute:

```html
<my-element unresolved></my-element>
```

Once the element has been upgraded the `unresolved` attribute will be removed by Maple &ndash; and will instead be replaced with the `resolved` attribute.