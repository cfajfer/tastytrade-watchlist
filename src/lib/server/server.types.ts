export interface TastytradeGenericResponse<Error, T> {
	status: number;
	error: Error;
	data: T;
}

export interface TastytradeErrorResponse {
	response: {
		status: number;
		data: {
			error: {
				code?: string;
				message: string;
			};
		};
	};
}
