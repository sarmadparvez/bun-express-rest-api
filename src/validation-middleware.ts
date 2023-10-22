import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

const validateRequest = async <T extends Record<string, unknown>>(data: T): Promise<string[] | null> => {
  try {
    const errors = await validate(data, {
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return errors.map((error: ValidationError) => {
        const constraints = error.constraints || {};
        return Object.values(constraints)[0];
      });
    }

    return null;
  } catch (error) {
    console.error('Validation middleware error:', error);
    return ['Internal Server Error'];
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequestBody = <T extends Record<string, any>>(dtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);

    const errors = await validateRequest(dto);

    if (errors) {
      return res.status(400).send({ errors });
    }
    req.body = dto;
    next();
  };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateQueryParams = <T extends Record<string, any>>(dtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.query, { enableImplicitConversion: true });

    const errors = await validateRequest(dto);

    if (errors) {
      return res.status(400).send({ errors });
    }
    req.query = dto;
    next();
  };
};
