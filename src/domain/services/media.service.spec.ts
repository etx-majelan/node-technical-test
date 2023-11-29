/* globals describe, expect, it */ 
import {describe, expect, it} from '@jest/globals'
import MediaService from "./media.service";
import MediaRepository from "@infrastructure/repositories/media.repository";
import ProgramRepository from "@infrastructure/repositories/program.repository";
import QueryMediaDTO from "@application/dtos/media/queryMedia.dto";
import UpdateMediaDTO from "@application/dtos/media/updateMedia.dto";
import { NotFoundError } from "@infrastructure/errors/NotFoundError.error";
import { configureServiceTest } from "fastify-decorators/testing";
import { NotFoundException } from '@application/exeptions/http.exception';


describe("Service: Media Service", () => {
    let mediaService: MediaService;
    let mediaRepository: Record<keyof MediaRepository, jest.Mock>;
    let programRepository: Record<keyof ProgramRepository, jest.Mock>;

    beforeEach(() => {
        mediaRepository = {
            create: jest.fn(),
            findPaginated: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            delete: jest.fn(),
          } as Record<keyof MediaRepository, jest.Mock>;

        programRepository = {
            exists: jest.fn(),
        } as Record<keyof ProgramRepository, jest.Mock>;

        mediaService = configureServiceTest({
            service: MediaService,
            mocks: [
              {
                provide: MediaRepository,
                useValue: mediaRepository
              },
              {
                provide: ProgramRepository,
                useValue: programRepository
              },
            ],
          })
    });

    describe("createMedia", () => {
        it("should create a new media item", async () => {
            // Arrange
            mediaRepository.create.mockResolvedValueOnce({});
            const createMediaDto = {
                name: 'test',
                description: 'ceci est un test',
                file: 'test.mp4',
                duration: 123,
                programId: 1
            };

            // Act
            const createdMedia = await mediaService.createMedia(createMediaDto);

            // Assert
            expect(createdMedia).toBeDefined();
            expect(mediaRepository.create).toHaveBeenCalledWith(createMediaDto);
        });
    });

    describe("getMedia", () => {
        it("should get a list of media items", async () => {
            // Arrange
            mediaRepository.findPaginated.mockResolvedValueOnce({});
            const query: QueryMediaDTO = {
                name: 'test',
                description: 'ceci est un test',
                minDuration: 123,
                maxDuration: 456,
                program: 1
            };
            const pagination = {
                page: 1,
                limit: 10,
                skip: 0
            };

            // Act
            const mediaList = await mediaService.getMedia(query, pagination);

            // Assert
            expect(mediaList).toBeDefined();
            expect(mediaRepository.findPaginated).toHaveBeenCalledWith(query, pagination, undefined);
        });
    });

    describe("getMediaById", () => {
        it("should get a media item by ID", async () => {
            // Arrange
            const mediaId = 1;
            mediaRepository.findById.mockResolvedValueOnce({});

            // Act
            const mediaItem = await mediaService.getMediaById(mediaId);

            // Assert
            expect(mediaItem).toBeDefined();
            expect(mediaRepository.findById).toHaveBeenCalledWith(mediaId);
        });
    });

    describe("updateMedia", () => {
        it("should update a media item", async () => {
            // Arrange
            const mediaId = 1;
            const updateMediaDto: UpdateMediaDTO = {
                name: 'test'
            };
            programRepository.exists.mockResolvedValueOnce(true);
            mediaRepository.findOneAndUpdate.mockResolvedValueOnce({});

            // Act
            const updatedMedia = await mediaService.updateMedia(mediaId, updateMediaDto);

            // Assert
            expect(updatedMedia).toBeDefined();
            expect(mediaRepository.findOneAndUpdate).toHaveBeenCalledWith(mediaId, updateMediaDto);
        });

        it("should update a media item with a program ID", async () => {
            // Arrange
            const mediaId = 1;
            const updateMediaDto: UpdateMediaDTO = {
                program: 1
            };
            programRepository.exists.mockResolvedValueOnce(true);
            mediaRepository.findOneAndUpdate.mockResolvedValueOnce({});

            // Act
            const updatedMedia = await mediaService.updateMedia(mediaId, updateMediaDto);

            // Assert
            expect(updatedMedia).toBeDefined();
            expect(mediaRepository.findOneAndUpdate).toHaveBeenCalledWith(mediaId, updateMediaDto);
        });

        it("should throw NotFoundError if the provided media ID does not exist", async () => {
            // Arrange
            const mediaId = 1;
            const updateMediaDto: UpdateMediaDTO = {
                name: 'test'
            };
            programRepository.exists.mockResolvedValueOnce(true);
            mediaRepository.findOneAndUpdate.mockRejectedValueOnce(new NotFoundError(`Media with id ${mediaId} does not exist`));

            // Act / Assert
            await expect(mediaService.updateMedia(mediaId, updateMediaDto)).rejects.toThrow(NotFoundException);
        });

        it("should throw NotFoundError if the provided program ID does not exist", async () => {
            // Arrange
            const mediaId = 1;
            const updateMediaDto: UpdateMediaDTO = {
                program: 1
            };
            programRepository.exists.mockResolvedValueOnce(false);

            // Act / Assert
            await expect(mediaService.updateMedia(mediaId, updateMediaDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe("deleteMedia", () => {
        it("should delete a media item", async () => {
            // Arrange
            const mediaId = 1;
            mediaRepository.delete.mockResolvedValueOnce(true);

            // Act
            const isDeleted = await mediaService.deleteMedia(mediaId);

            // Assert
            expect(isDeleted).toBe(true);
        });
    });
});
