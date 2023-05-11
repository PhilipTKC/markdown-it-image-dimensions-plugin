import MarkdownIt, { PluginWithOptions } from "markdown-it";
import Renderer from "markdown-it/lib/renderer";
import Token from "markdown-it/lib/token";

export interface ImagePluginOptions {
    container: string;
    image: string;
    loading: 'lazy' | 'eager' | 'auto';
    decode: boolean;
    removeSource: boolean;
}

const pluginDefaults: ImagePluginOptions = {
    container: '',
    image: '',
    loading: 'lazy',
    decode: false,
    removeSource: false,
}

export const imageDimensionsPlugin: PluginWithOptions<ImagePluginOptions> = (md: MarkdownIt, pluginOpts: ImagePluginOptions = pluginDefaults) => {
    /*
    * Add class to paragraph_open token if the next token is an image
    * Only add the class if the container option is set
    */
    if (pluginOpts && pluginOpts.container && pluginOpts.container.length > 0) {
        md.renderer.rules.paragraph_open = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => {
            const currentToken = tokens[idx];
            const nextToken = tokens[idx + 1];

            if (tokens[idx + 1].type === 'inline' && nextToken.children && nextToken.children.some(child => child.type === 'image')) {
                currentToken.attrSet('class', pluginOpts.container);
                return self.renderToken(tokens, idx, options);
            }

            return self.renderToken(tokens, idx, options);
        };
    }

    md.renderer.rules.image = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => {
        const token = tokens[idx];
        const attrs = token.attrs ?? [];
        const alt = token.content;
        const srcAttr = attrs.find(attr => attr[0] === 'src');
        const titleAttr = attrs.find(attr => attr[0] === 'title');

        const src = srcAttr?.[1] ?? '';
        const title = titleAttr?.[1] ?? '';

        // Get width and height from query params
        const params = new URLSearchParams(src.split('?')[1] ?? '');

        // Retrieve the width and height from the query params
        // Example src: https://example.com/image.png
        // Example src: https://example.com/image.png?width=100&height=100
        // Example src: https://example.com/image.png?width=100%&height=100%
        // Example src: https://example.com/image.png?width=100%&height=100
        // If no width or height is provided, default to 100%
        const width = params.get('width') ?? '100%';
        const height = params.get('height') ?? '100%';

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
        token.attrs = attributes.filter(attribute => attribute[1] !== '') as [string, string][];

        return self.renderToken(tokens, idx, options);
    };
};