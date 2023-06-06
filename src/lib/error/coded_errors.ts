import { type StandardError, standard_error } from '.';

type TCodedError = Readonly<{
	[key: string]: Readonly<StandardError>;
}>;
export const CODED_ERROR: TCodedError = {
	database_error: standard_error(
		500,
		'An internal error occured with error code 0x01'
	)
};
