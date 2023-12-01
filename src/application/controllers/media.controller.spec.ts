import { configureControllerTest } from "fastify-decorators/testing";
import { FastifyInstance } from 'fastify';
import MediaService from '@domain/services/media.service';
import MediaController from './media.controller';
import PaginatedResultDTO from '@application/dtos/paginatedResult.dto';
import Media from '@domain/entities/media.entity';
import { NotFoundException } from "@application/exeptions/http.exception";

describe('Controller: Media Controller', () => {
  let instance: FastifyInstance;
  let mediaService: Record<keyof MediaService, jest.Mock>;

  beforeEach(async () => {
    mediaService = {
      createMedia: jest.fn(),
      deleteMedia: jest.fn(),
      getMedia: jest.fn(),
      getMediaById: jest.fn(),
      updateMedia: jest.fn(),
    } as Record<keyof MediaService, jest.Mock>;

    instance = await configureControllerTest({
      controller: MediaController,
      mocks: [
        {
          provide: MediaService,
          useValue: mediaService,
        },
      ],
    });
  });

  describe('POST /media', () => {
    it('should create a new media item', async () => {
      const request = {
        body: {
          name: 'Test Media',
          duration: 123,
          file: 'test.mp4',
        },
      };

      const returnedMedia = {
        id: 1,
        name: 'Test Media',
        duration: 123,
        file: 'test.mp4'
      };

      mediaService.createMedia.mockResolvedValue(returnedMedia);

      const result = await instance.inject({
        method: 'POST',
        url: '/media',
        payload: request.body,
      });

      expect(result.statusCode).toBe(201);
      expect(result.json()).toEqual(returnedMedia);
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        body: {
          name: 'Test Media',
          duration: 123,
          file: 'test.mp4',
        },
      };
      const reply = {
        status: jest.fn(),
        send: jest.fn(),
      };

      mediaService.createMedia.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'POST',
        url: '/media',
        payload: request.body,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ statusCode: 500, error: 'Internal Server Error', message: 'Some error' });
    });
  })

  describe('GET /media/:id', () => {
    it('should return a media item by its ID', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      const returnedMedia = {
        id: 1,
        name: 'Test Media',
        duration: 123,
        file: 'test.mp4'
      };

      mediaService.getMediaById.mockResolvedValue(returnedMedia);

      const result = await instance.inject({
        method: 'GET',
        url: `/media/${request.params.id}`,
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()).toEqual(returnedMedia);
    });

    it('should return 404 when media item is not found', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      mediaService.getMediaById.mockResolvedValue(null);

      const result = await instance.inject({
        method: 'GET',
        url: `/media/${request.params.id}`,
      });

      expect(result.statusCode).toBe(404);
      expect(result.json()).toEqual({ error: 'Media not found' });
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      mediaService.getMediaById.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'GET',
        url: `/media/${request.params.id}`,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('GET /media', () => {
    it('should return a list of media items', async () => {
      const request = {
        query: {
          page: "1",
          size: "10",
        },
      };

      const paginatedResult: PaginatedResultDTO<Media> = {
        items: [{
          id: 1,
          name: 'Test Media',
          duration: 123,
          file: 'test.mp4'
        }],
        totalItems: 1,
        totalPages: 1,
        page: 1,
        size: 10
      };

      mediaService.getMedia.mockResolvedValue(paginatedResult);

      const result = await instance.inject({
        method: 'GET',
        url: '/media',
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

      mediaService.getMedia.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'GET',
        url: '/media',
        query: request.query,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('POST /media/:id', () => {
    it('should update a media item', async () => {
      const request = {
        params: {
          id: 1,
        },
        body: {
          name: 'Test Media',
          duration: 123,
          file: 'test.mp4',
        },
      };
      const reply = {
        status: jest.fn(),
        send: jest.fn(),
      };

      const returnedMedia = {
        id: 1,
        name: 'Test Media',
        duration: 123,
        file: 'test.mp4'
      };

      mediaService.updateMedia.mockResolvedValue(returnedMedia);

      const result = await instance.inject({
        method: 'POST',
        url: `/media/${request.params.id}`,
        payload: request.body,
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()).toEqual(returnedMedia);
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        params: {
          id: 1,
        },
        body: {
          name: 'Test Media',
          duration: 123,
          file: 'test.mp4',
        },
      };

      mediaService.updateMedia.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'POST',
        url: `/media/${request.params.id}`,
        payload: request.body,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ error: 'Internal Server Error' });
    });

    it('should return 404 when media item is not found', async () => {
      const request = {
        params: {
          id: 1,
        },
        body: {
          name: 'Test Media',
          duration: 123,
          file: 'test.mp4',
        },
      };

      mediaService.updateMedia.mockRejectedValue(new NotFoundException('Media not found'));

      const result = await instance.inject({
        method: 'POST',
        url: `/media/${request.params.id}`,
        payload: request.body,
      });

      expect(result.statusCode).toBe(404);
      expect(result.json()).toEqual({ error: 'Media not found' });
    });
  });

  describe('DELETE /media/:id', () => {
    it('should delete a media item', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      mediaService.deleteMedia.mockResolvedValue(true);

      const result = await instance.inject({
        method: 'DELETE',
        url: `/media/${request.params.id}`,
      });

      expect(result.statusCode).toBe(204);
    });

    it('should return 500 when an error occurs', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      mediaService.deleteMedia.mockRejectedValue(new Error('Some error'));

      const result = await instance.inject({
        method: 'DELETE',
        url: `/media/${request.params.id}`,
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ error: 'Internal Server Error' });
    });

    it('should return 404 when media item is not found', async () => {
      const request = {
        params: {
          id: 1,
        },
      };

      mediaService.deleteMedia.mockResolvedValue(false);

      const result = await instance.inject({
        method: 'DELETE',
        url: `/media/${request.params.id}`,
      });

      expect(result.statusCode).toBe(404);
      expect(result.json()).toEqual({ error: 'Media not found' });
    });
  });
});