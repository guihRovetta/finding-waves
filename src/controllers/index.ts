import { Response } from 'express';
import mongoose from 'mongoose';
import { CUSTOM_VALIDATION } from '@src/models/user';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    res: Response,
    err: mongoose.Error.ValidationError | Error
  ): void {
    if (err instanceof mongoose.Error.ValidationError) {
      const { code, error } = this.handleClientErrors(err);
      res.status(code).send({ code, error });
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong' });
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
    return { code: 422, error: error.message };
  }
}
