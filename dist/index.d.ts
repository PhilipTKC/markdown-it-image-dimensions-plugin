import { PluginWithOptions } from "markdown-it";
interface ImagePluginOptions {
    container: string;
    image: string;
    loading: 'lazy' | 'eager' | 'auto';
    decode: boolean;
    removeSource: boolean;
}
declare const imageDimensionsPlugin: PluginWithOptions<ImagePluginOptions>;
export { imageDimensionsPlugin, ImagePluginOptions };
