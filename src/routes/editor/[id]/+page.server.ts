import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const stitches: number[] = new Array(100).fill(0);

	return {
		chart: {
			id: params.id,
			name: 'Chart Name ' + params.id,
			width: 56,
			height: 8,
			stitches
		}
	};
};
