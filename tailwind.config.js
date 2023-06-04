import colors from './src/lib/assets/colors.json';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				stitch: {
					0: colors.stitches.filled['0']
				}
			}
		}
	},
	plugins: [],
	safelist: [
		{
			pattern: /(bg|fg)-stitch-(0)/
		}
	]
};
