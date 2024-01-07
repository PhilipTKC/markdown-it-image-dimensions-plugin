# Markdown It Image Dimensions Plugin

Plugin created for [Quick Start](https://github.com/PhilipTKC/quick-start)

## Description

This plugin provides additional functionality to Markdown by allowing you to specify the height and width of images using the following syntax. Additionally, it allows you to set the loading and decode attributes on images and add classes to the container and image element.

## Markdown Input

```md
![alt text](image.png?height=100&width=200 "SomeTitle")
```

## Example Inputs

```md
![alt text](image.png?height=100 "SomeTitle")

![alt text](image.png?width=200 "SomeTitle")

![alt text](image.png?width=100% "SomeTitle")

![alt text](image.png?width=100%&height=50% "SomeTitle")

![alt text](image.png?height=50% "SomeTitle")

![alt text](image.png "SomeTitle")
```

## Plugin

```ts
import { imageDimensionsPlugin, ImagePluginOptions } from '';

const imageDimensionsPluginOptions: ImagePluginOptions = {
    container: "image-container",
    image: "my-image",
    loading: "lazy",
    decode: true,
    removeSource: false
}

md.use<ImagePluginOptions>(imageDimensionsPlugin, imageDimensionsPluginOptions)
```

Note that removeSource should only be used if you have a way to set src from data-src in your application. Eg. using IntersectionObserver.

## CSS when removeSource is true

```css
img:not([src]) {
    visibility: hidden;
}
```

## Rendered Output

```html
<p class="image-container">
    <img src="image.png" loading="lazy" decoding="async" data-src="image.png" alt="alt text" title="SomeTitle" style="display: block; width: 100px; height: 200px; background-color: #ccc;" class="my-image" height="100" width="200" />
</p>
```
