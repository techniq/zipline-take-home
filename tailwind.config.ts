import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import layerstack from '@layerstack/tailwind/plugin';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/svelte-ux/**/*.{svelte,js}',
		'./node_modules/layerchart/**/*.{svelte,js}'
	],

	theme: {
		extend: {}
	},

	// See customization docs: https://svelte-ux.techniq.dev/customization
	ux: {
		themes: {
			light: {
				primary: colors['violet']['500'],
				'primary-content': 'white',
				secondary: colors['cyan']['500'],
				'surface-100': 'white',
				'surface-200': colors['gray']['100'],
				'surface-300': colors['gray']['300'],
				'surface-content': colors['gray']['900'],
				'color-scheme': 'light'
			},
			dark: {
				primary: colors['violet']['500'],
				'primary-content': 'white',
				secondary: colors['cyan']['500'],
				'surface-100': colors['zinc']['800'],
				'surface-200': colors['zinc']['900'],
				'surface-300': colors['zinc']['950'],
				'surface-content': colors['zinc']['100'],
				'color-scheme': 'dark'
			}
		}
	},

	plugins: [layerstack]
} as Config;
