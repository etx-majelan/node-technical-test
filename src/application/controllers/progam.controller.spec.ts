import { configureControllerTest } from 'fastify-decorators/testing';
import { FastifyInstance } from 'fastify';
import ProgramService from '@domain/services/program.service';
import ProgramController from './program.controller';
import { NotFoundError } from '@infrastructure/errors/NotFoundError.error';
import PaginatedResultDTO from '@application/dtos/paginatedResult.dto';
import Program from '@domain/entities/program.entity';
import { NotFoundException } from '@application/exeptions/http.exception';

describe('Controller: Program Controller', () => {
  let instance: FastifyInstance;
  let programService: Record<keyof ProgramService, jest.Mock>;

  beforeEach(async () => {
    programService = {
      createProgram: jest.fn(),
      deleteProgram: jest.fn(),
      getProgram: jest.fn(),
      getProgramById: jest.fn(),
      updateProgram: jest.fn(),
    } as Record<keyof ProgramService, jest.Mock>;

    instance = await configureControllerTest({
      controller: ProgramController,
      mocks: [
        {
          provide: ProgramService,
          useValue: programService,
        },
      ],
    });
  });

  describe('POST /program', () => {
    it('should create a new program item', async () => {
      const request = {
        body: {
          name: 'Test Program',
          description: 'test description',
          coverImage: 'file.jpeg',
        },
      };

      const returnedProgram = {
        id: 1,
        name: 'Test Program',
        description: 'test description',
        coverImage: 'file.jpeg'
      };

      programService.createProgram.mockResolvedValue(returnedProgram);

      const result = await instance.inject({
        method: 'POST',
        url: '/program',
        payload: request.body,
      });

      expect(result.statusCode).toBe(201);
      expect(result.json()).toEqual(returnedProgram);
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        body: {
          name: 'Test Program',
          description: 'test description',
          coverImage: 'file.jpeg',
        },
      };

      programService.createProgram.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'POST',
        url: '/program',
        payload: request.body,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ statusCode: 500, error: 'Internal Server Error', message: 'Some error' });
    });
  })

  describe('GET /program/:id', () => {
    it('should return a program item by its ID', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      const returnedProgram = {
        id: 1,
        name: 'Test Program',
        description: 'test description',
        coverImage: 'file.jpeg'
      };

      programService.getProgramById.mockResolvedValue(returnedProgram);

      const result = await instance.inject({
        method: 'GET',
        url: `/program/${request.params.id}`,
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()).toEqual(returnedProgram);
    });

    it('should return 404 when program item is not found', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      programService.getProgramById.mockResolvedValue(null);

      const result = await instance.inject({
        method: 'GET',
        url: `/program/${request.params.id}`,
      });

      expect(result.statusCode).toBe(404);
      expect(result.json()).toEqual({ error: 'Program not found' });
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      programService.getProgramById.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'GET',
        url: `/program/${request.params.id}`,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /program', () => {
    it('should return a list of program items', async () => {
      const request = {
        query: {
          page: "1",
          size: "10",
        },
      };
      const reply = {
        status: jest.fn(),
        send: jest.fn(),
      };

      const paginatedResult = {
        items: [{
          id: 1,
          name: 'Test Program',
          description: 'test description',
          coverImage: 'file.jpeg'
        }],
        totalItems: 1,
        totalPages: 1,
        page: 1,
        size: 10
      };

      programService.getProgram.mockResolvedValue(paginatedResult);

      const result = await instance.inject({
        method: 'GET',
        url: '/program',
        query: request.query,
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()).toEqual(paginatedResult);
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        query: {
          page: "1",
          size: "10",
        },
      };

      programService.getProgram.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'GET',
        url: '/program',
        query: request.query,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('POST /program/:id', () => {
    it('should update a program item', async () => {
      const request = {
        params: {
          id: 1,
        },
        body: {
          name: 'Test Program',
          description: 'test description',
          coverImage: 'file.jpeg',
        },
      };

      const returnedProgram = {
        id: 1,
        name: 'Test Program',
        description: 'test description',
        coverImage: 'file.jpeg'
      };

      programService.updateProgram.mockResolvedValue(returnedProgram);

      const result = await instance.inject({
        method: 'POST',
        url: `/program/${request.params.id}`,
        payload: request.body,
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()).toEqual(returnedProgram);
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        params: {
          id: 1,
        },
        body: {
          name: 'Test Program',
          description: 'test description',
          coverImage: 'file.jpeg',
        },
      };

      programService.updateProgram.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'POST',
        url: `/program/${request.params.id}`,
        payload: request.body,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ error: 'Internal Server Error' });
    });

    it('should return 404 when program item is not found', async () => {
      const request = {
        params: {
          id: 1,
        },
        body: {
          name: 'Test Program',
          description: 'test description',
          coverImage: 'file.jpeg',
        },
      };

      programService.updateProgram.mockRejectedValue(new NotFoundException('Program not found'));

      const result = await instance.inject({
        method: 'POST',
        url: `/program/${request.params.id}`,
        payload: request.body,
      });

      expect(result.statusCode).toBe(404);
      expect(result.json()).toEqual({ error: 'Program not found' });
    });
  });

  describe('DELETE /program/:id', () => {
    it('should delete a program item', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      programService.deleteProgram.mockResolvedValue(true);

      const result = await instance.inject({
        method: 'DELETE',
        url: `/program/${request.params.id}`,
      });

      expect(result.statusCode).toBe(204);
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      programService.deleteProgram.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'DELETE',
        url: `/program/${request.params.id}`,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ error: 'Internal Server Error' });
    });

    it('should return 404 when program item is not found', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      programService.deleteProgram.mockResolvedValue(false);

      const result = await instance.inject({
        method: 'DELETE',
        url: `/program/${request.params.id}`,
      });

      expect(result.statusCode).toBe(404);
      expect(result.json()).toEqual({ error: 'Program not found' });
    });
  });
});