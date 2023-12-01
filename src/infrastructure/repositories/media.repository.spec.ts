import { Between, Like, Repository } from "typeorm";
import Media from "@domain/entities/media.entity";
import MediaRepository from "./media.repository";
import ConnectionService from "@infrastructure/databases/connection.service";
import { configureServiceTest } from "fastify-decorators/testing";
import SortDTO from "@application/dtos/sort.dto";
import PaginatedResultDTO from '@application/dtos/paginatedResult.dto';
import QueryMediaDTO from '@application/dtos/media/queryMedia.dto';

describe("Repository: Media Repository", () => {
  let mediaRepository: MediaRepository;
  let repositoryMock: Record<keyof Repository<Media>, jest.Mock>;

  beforeEach(async () => {
    repositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as Record<keyof Repository<Media>, jest.Mock>;

    mediaRepository = configureServiceTest({
      service: MediaRepository,
      mocks: [
        {
          provide: ConnectionService,
          useValue: {
            init: jest.fn(),
            destroy: jest.fn(),
            DataSource: {
              getRepository: jest.fn().mockReturnValue(repositoryMock)
            },
          } as unknown as Record<keyof ConnectionService, jest.Mock>,
        }
      ],
    });

    await mediaRepository.init();
  });

  describe("create", () => {
    it("should create a new media entity", async () => {
      const media: Partial<Media> = { name: "Test Media", duration: 123, file: "test.mp4" };
      const createdMedia: Media = {
        id: 1,
        name: "Test Media",
        duration: 123,
        file: "test.mp4"
      };

      repositoryMock.create.mockReturnValue(createdMedia);
      repositoryMock.save.mockResolvedValue(createdMedia);

      const result = await mediaRepository.create(media);

      expect(repositoryMock.create).toHaveBeenCalledWith(media);
      expect(repositoryMock.save).toHaveBeenCalledWith(createdMedia);
      expect(result).toEqual(createdMedia);
    });
  });

  describe("findById", () => {
    it("should find a media item by its ID", async () => {
      const id = 1;
      const foundMedia: Media = {
        id,
        name: "Test Media",
        duration: 123,
        file: "test.mp4"
      };

      repositoryMock.findOneBy.mockResolvedValue(foundMedia);

      const result = await mediaRepository.findById(id);

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({id});
      expect(result).toEqual(foundMedia);
    });

    it("should return null if media item is not found", async () => {
      const id = 1;

      repositoryMock.findOneBy.mockResolvedValue(null);

      const result = await mediaRepository.findById(id);

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({id});
      expect(result).toBeNull();
    });
  });

  describe("findPaginated", () => {
    it("should find paginated media items", async () => {
      const query: QueryMediaDTO = { name: "Test Media", minDuration: 123, maxDuration: 456, program: 1 };
      const pagination = { page: 3, skip: 4, limit: 2 };
      const sort: SortDTO = { property: "name", direction: "ASC" };
      const foundMedia: PaginatedResultDTO<Media> = {
        "items": [
          {
            id: 1,
            name: "Test Media",
            duration: 123,
            file: "test.mp4"
          },
          {
            id: 2,
            name: "Test Media 2",
            duration: 456,
            file: "test2.mp4"
          }
        ],
        "totalItems": 50,
        "totalPages": 25,
        "page": 3,
        "size": 2
      };

      repositoryMock.findAndCount.mockResolvedValue([foundMedia.items, 50]);

      const result = await mediaRepository.findPaginated(query, pagination, sort);

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: { 
          name: Like(query.name),
          duration: Between(query.minDuration, query.maxDuration),
          program: query.program
        },
        order: {
          name: "ASC"
        },
        skip: 4,
        take: 2
      });
      expect(result).toEqual(foundMedia);
    });
  });

  describe("findOneAndUpdate", () => { 
    it("should find a media item by its ID and update it", async () => {
      const id = 1;
      const update = { name: "Test Media Updated" };
      const foundMedia: Media = {
        id,
        name: "Test Media",
        duration: 123,
        file: "test.mp4"
      };
      const updatedMedia: Media = {
        id,
        name: "Test Media Updated",
        duration: 123,
        file: "test.mp4"
      };

      repositoryMock.findOneBy.mockResolvedValue(foundMedia);
      repositoryMock.update.mockResolvedValue(updatedMedia);

      const result = await mediaRepository.findOneAndUpdate(id, update);

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({id});
      expect(repositoryMock.update).toHaveBeenCalledWith({ id }, updatedMedia);
      expect(result).toEqual(updatedMedia);
    });

    it("should throw an error if media item is not found", async () => {
      const id = 1;
      const update = { name: "Test Media Updated" };

      repositoryMock.findOneBy.mockResolvedValue(null);

      await expect(mediaRepository.findOneAndUpdate(id, update)).rejects.toThrow("Media with id 1 does not exist");
    });
  });

  describe("delete", () => {
    it("should return false if program item is not found", async () => {
      const id = 1;

      repositoryMock.delete.mockResolvedValue({affected: 0});

      const result = await mediaRepository.delete(id);

      expect(repositoryMock.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(false);
    });

    it("should return true if program item is deleted", async () => {
      const id = 1;

      repositoryMock.delete.mockResolvedValue({affected: 1});

      const result = await mediaRepository.delete(id);

      expect(repositoryMock.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(true);
    });
  });
});