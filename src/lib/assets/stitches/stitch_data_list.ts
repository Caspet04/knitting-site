import k2tog from '$lib/assets/stitches/normal/k2tog.svg';
import kfb from '$lib/assets/stitches/normal/kfb.svg';
import sl1 from '$lib/assets/stitches/normal/sl1.svg';
import sl1_k2tog_psso from '$lib/assets/stitches/normal/sl1-k2tog-psso.svg';
import ssk from '$lib/assets/stitches/normal/ssk.svg';
import yo from '$lib/assets/stitches/normal/yo.svg';
import type { Stitch, StitchData } from '.';

export type StitchDataList = Array<StitchData>;

export const stitch_data_list: StitchDataList = [
	{
		name: 'Knit',
		identifier: 'knit',
		type: 'empty'
	},
	{
		name: 'No stitch',
		identifier: 'no-stitch',
		type: 'filled',
		filled: 0
	},
	{
		name: 'Yo',
		identifier: 'yo',
		type: 'image',
		image: yo
	},
	{
		name: 'Ssk',
		identifier: 'ssk',
		type: 'image',
		image: ssk
	},
	{
		name: 'K2tog',
		identifier: 'k2tog',
		type: 'image',
		image: k2tog
	},
	{
		name: 'Sl1, K2tog, Psso',
		identifier: 'sl1-k2tog-psso',
		type: 'image',
		image: sl1_k2tog_psso
	},
	{
		name: 'Kfb',
		identifier: 'kfb',
		type: 'image',
		image: kfb
	},
	{
		name: 'Sl1',
		identifier: 'sl1',
		type: 'image',
		image: sl1
	}
];
