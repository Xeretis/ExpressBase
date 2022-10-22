export interface GeneralError {
    code: string;
    message: string;
    path: string[];
}

export interface GeneralErrorResponse {
    message: string;
    errors: GeneralError[];
}

export interface ApiError {
    data: any;
    status: number;
}
