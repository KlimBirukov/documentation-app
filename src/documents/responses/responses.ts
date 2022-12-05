export class CommonResponse {
    readonly success: boolean;
    readonly message: string;
}

export class SuccessfulResponseWithData{
    readonly success: boolean;
    readonly data: any;
}