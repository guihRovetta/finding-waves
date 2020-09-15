import { Response } from 'express';
import mongoose from 'mongoose';

import { CUSTOM_VALIDATION } from '@src/models/user';
import logger from '@src/logger';
import ApiError, { APIError } from '@src/util/errors/api-error';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    res: Response,
    err: mongoose.Error.ValidationError | Error
  ): void {
    if (err instanceof mongoose.Error.ValidationError) {
      const { code, error } = this.handleClientErrors(err);
      res.status(code).send(ApiError.format({ code, message: error }));
    } else {
      logger.error(err);
      res
        .status(500)
        .send(ApiError.format({ code: 500, message: 'Something went wrong' }));
    }
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }
    return { code: 400, error: error.message };
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}
