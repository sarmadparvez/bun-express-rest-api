import { describe, it, jest, expect, spyOn } from 'bun:test';
import { validateQueryParams, validateRequestBody } from './validation-middleware.ts';
import { CreateUserDto } from './users/dto/create-user.dto.ts';
import { Request, Response } from 'express';
import { GetUsersDto, SortDirection } from './users/dto/get-users.dto.ts';
import 'reflect-metadata';

const createRequest = (body?: Record<string, unknown>, query?: Record<string, unknown>) =>
  ({
    body,
    query,
  }) as Request;
const send = jest.fn();
const response = {
  status: () => ({
    send,
  }),
} as unknown as Response;

describe('Validation Middleware', () => {
  describe('validateRequestBody', () => {
    it('should pass validation for valid data', async () => {
      const request = createRequest({
        name: 'Max Mustermann',
        email: 'mm@test.com',
      });

      const next = jest.fn();

      await validateRequestBody(CreateUserDto)(request, response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation for invalid data', async () => {
      const request = createRequest({
        name: 'Max Mustermann',
        email: 'invalid email',
      });

      const next = jest.fn();
      const statusMock = spyOn(response, 'status');

      await validateRequestBody(CreateUserDto)(request, response, next);

      expect(statusMock.mock.calls[0]).toEqual([400]);
      expect(send.mock.calls[0]).toEqual([{ errors: expect.any(Array) }]);
    });
  });

  describe('validateQueryParams', () => {
    it('should pass validation for valid data', async () => {
      const request = createRequest(undefined, {
        created: SortDirection.DESC,
        skip: 10,
        limit: 100,
      });

      const next = jest.fn();

      await validateQueryParams(GetUsersDto)(request, response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail validation for invalid data', async () => {
      const request = createRequest(undefined, {
        created: 'invalid sort direction',
        skip: -1,
      });

      const next = jest.fn();
      const statusMock = spyOn(response, 'status');

      await validateQueryParams(GetUsersDto)(request, response, next);

      expect(statusMock.mock.calls[0]).toEqual([400]);
      expect(send.mock.calls[0]).toEqual([{ errors: expect.any(Array) }]);
    });
  });
});
