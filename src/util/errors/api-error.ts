import httpStatusCodes from 'http-status-codes';

export interface APIError {
  message: string;
  code: number;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface APIErrorResponse extends Omit<APIError, 'codeAsString'> {
  error: string;
}

export default class ApiError {
  public static format(error: APIError): APIErrorResponse {
    const { message, code, codeAsString, documentation, description } = error;

    return {
      ...{
        message,
        code,
        error: codeAsString
          ? codeAsString
          : httpStatusCodes.getStatusText(code),
      },
      ...(documentation && { documentation }),
      ...(description && { description }),
    };
  }
}
