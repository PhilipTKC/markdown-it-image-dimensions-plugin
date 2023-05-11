"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageDimensionsPlugin = void 0;
const pluginDefaults = {
    container: '',
    image: '',
    loading: 'lazy',
    decode: false,
    removeSource: false,
};
const imageDimensionsPlugin = (md, pluginOpts = pluginDefaults) => {
    /*
    * Add class to paragraph_open token if the next token is an image
    * Only add the class if the container option is set
    */
    if (pluginOpts && pluginOpts.container && pluginOpts.container.length > 0) {
        md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
            const currentToken = tokens[idx];
            const nextToken = tokens[idx + 1];
            if (tokens[idx + 1].type === 'inline' && nextToken.children && nextToken.children.some(child => child.type === 'image')) {
                currentToken.attrSet('class', pluginOpts.container);
                return self.renderToken(tokens, idx, options);
            }
            return self.renderToken(tokens, idx, options);
        };
    }
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        var _a, _b, _c, _d, _e, _f;
        const token = tokens[idx];
        const attrs = (_a = token.attrs) !== null && _a !== void 0 ? _a : [];
        const alt = token.content;
        const srcAttr = attrs.find(attr => attr[0] === 'src');
        const titleAttr = attrs.find(attr => attr[0] === 'title');
        const src = (_b = srcAttr === null || srcAttr === void 0 ? void 0 : srcAttr[1]) !== null && _b !== void 0 ? _b : '';
        const title = (_c = titleAttr === null || titleAttr === void 0 ? void 0 : titleAttr[1]) !== null && _c !== void 0 ? _c : '';
        // Get width and height from query params
        const params = new URLSearchParams((_d = src.split('?')[1]) !== null && _d !== void 0 ? _d : '');
        // Retrieve the width and height from the query params
        // Example src: https://example.com/image.png
        // Example src: https://example.com/image.png?width=100&height=100
        // Example src: https://example.com/image.png?width=100%&height=100%
        // Example src: https://example.com/image.png?width=100%&height=100
        // If no width or height is provided, default to 100%
        const width = (_e = params.get('width')) !== null && _e !== void 0 ? _e : '100%';
        const height = (_f = params.get('height')) !== null && _f !== void 0 ? _f : '100%';
        // Check if width and height contains a percentage
        const widthIsPercentage = width.includes('%');
        const heightIsPercentage = height.includes('%');
        // Remove width and height from src
        const replacedSrc = src.replace(/[\?&](width|height)=\S+&?/g, '');
        const attributes = [
            ['src', pluginOpts.removeSource ? '' : replacedSrc],
            ['loading', pluginOpts.loading],
            ['decoding', pluginOpts.decode ? 'async' : ''],
            ['data-src', replacedSrc],
            ['alt', alt],
            ['title', title],
            ['class', pluginOpts.image || ''],
            ['width', widthIsPercentage ? width : `${width}px`],
            ['height', heightIsPercentage ? height : `${height}px`],
        ];
        // When removeSource is true, the image will be replaced with a placeholder
        // This is needed to preserve the size of the image so the layout doesn't break
        // removeSource should only be used when there is a way to lazy load the image via IntersectionObserver using the data-src attribute
        if (pluginOpts.removeSource) {
            attributes.push(['style', `display: block; width: ${width === '100%' ? '100%' : (widthIsPercentage ? width : `${width}px`)}; height: ${height === '100%' ? '100%' : (heightIsPercentage ? height : `${height}px`)}; background-color: #ccc;`]);
        }
        // Remove empty attributes
        token.attrs = attributes.filter(attribute => attribute[1] !== '');
        return self.renderToken(tokens, idx, options);
    };
};
exports.imageDimensionsPlugin = imageDimensionsPlugin;
