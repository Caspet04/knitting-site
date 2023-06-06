export enum Stitch {
	KNIT = 0,
	NO_STITCH = 1,
	YO = 2,
	SSK = 3,
	K2TOG = 4,
	SL1_K2TOG_PSSO = 5,
	KFB = 6,
	SL1 = 7
}

// @ts-expect-error An error occurs since this is an automatic filter
export const stitch_list: Array<Stitch> = Object.values(Stitch).filter(
	(value) => typeof value === 'number'
);
