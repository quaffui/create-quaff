// Inofficial type definitions for "sveltekit-autoimport"
// See https://github.com/yuanchuan/sveltekit-autoimport for the original project

declare module 'sveltekit-autoimport' {
	import { Plugin } from 'vite';

	type Component = (
		| { value: string }
		| { name: string }
		| { component: string }
		| { directory: string }
	) & {
		flat?: boolean;
		prefix?: string;
	};

	type Module = Record<string, string | string[]>;

	type Mapping = Record<string, string | (() => string)>;

	type IncludeExclude = string | string[];

	type SveltekitAutoImportOptions = {
		/**
		 * Glob patterns for included files.
		 */
		include?: IncludeExclude;

		/**
		 * Glob patterns for excluded files.
		 */
		exclude?: IncludeExclude;

		/**
		 * Component paths or a mapping of components to modules.
		 */
		components?: string | string[] | Component[];

		/**
		 * Module to import components from.
		 */
		module?: Module;

		/**
		 * Mapping of specific variables to import statements (not just paths).
		 */
		mapping?: Mapping;

		/**
		 * Whether to read the preprocess configuration from svelte.config.js.
		 * Defaults to true.
		 */
		configFile?: boolean;
	};

	/**
	 * A Vite plugin for automatically importing Sveltekit components.
	 *
	 * @param options - Configuration options for the plugin.
	 * @returns A configured Vite plugin.
	 */
	export default function autoImport(options?: SveltekitAutoImportOptions): Plugin;
}
