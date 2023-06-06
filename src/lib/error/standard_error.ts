export interface StandardError {
	readonly code: number;
	readonly message: string;
}

export function standard_error(code: number, message: string): StandardError {
	return {
		code,
		message
	};
}
