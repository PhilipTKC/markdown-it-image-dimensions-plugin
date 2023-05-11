import { PluginWithOptions } from "markdown-it";
export interface ImagePluginOptions {
    container: string;
    image: string;
    loading: 'lazy' | 'eager' | 'auto';
    decode: boolean;
    removeSource: boolean;
}
export declare const imageDimensionsPlugin: PluginWithOptions<ImagePluginOptions>;
