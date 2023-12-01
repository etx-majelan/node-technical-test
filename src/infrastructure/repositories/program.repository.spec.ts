import { Like, Repository } from "typeorm";
import Program from "@domain/entities/program.entity";
import ProgramRepository from "./program.repository";
import ConnectionService from "@infrastructure/databases/connection.service";
import { configureServiceTest } from "fastify-decorators/testing";

import SortDTO from "@application/dtos/sort.dto";
import PaginatedResultDTO from '@application/dtos/paginatedResult.dto';
import QueryProgramDTO from '@application/dtos/program/queryProgram.dto';
import PaginationDTO from '@application/dtos/pagination.dto';

describe("Repository: Program Repository", () => {
  let programRepository: ProgramRepository;
  let repositoryMock: Record<keyof Repository<Program>, jest.Mock>;

  beforeEach(async () => {
    repositoryMock = {
      exist: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as Record<keyof Repository<Program>, jest.Mock>;

    programRepository = configureServiceTest({
      service: ProgramRepository,
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
    await programRepository.init();
    console.log(programRepository);
  });

  describe("create", () => {
    it("should create a new program entity", async () => {
      const program: Partial<Program> = {
        name: "Test Program",
        description: "Test Description",
        coverImage: "test.jpg"
      };
      const createdProgram: Program = {
        id: 1,
        name: "Test Program",
        description: "Test Description",
        coverImage: "test.jpg",
        medias: null
      };
      repositoryMock.create.mockReturnValue(createdProgram);
      repositoryMock.save.mockResolvedValue(createdProgram);

      const result = await programRepository.create(program);

      expect(repositoryMock.create).toHaveBeenCalledWith(program);
      expect(repositoryMock.save).toHaveBeenCalledWith(createdProgram);
      expect(result).toEqual(createdProgram);
    });
  });

  describe("findById", () => {
    it("should find a program item by its ID", async () => {
      const id = 1;
      const foundProgram: Program = {
        id,
        name: "Test Program",
        description: "Test Description",
        coverImage: "test.mp4",
        medias: null
      };

      repositoryMock.findOneBy.mockResolvedValue(foundProgram);

      const result = await programRepository.findById(id);

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({id});
      expect(result).toEqual(foundProgram);
    });

    it("should return null if program item is not found", async () => {
      const id = 1;

      repositoryMock.findOneBy.mockResolvedValue(null);

      const result = await programRepository.findById(id);

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({id});
      expect(result).toBeNull();
    });
  });

  describe("findPaginated", () => {
    it("should find paginated program items", async () => {
      const query: QueryProgramDTO = { name: "Test Program", description: "test", coverImage: "test" };
      const pagination: PaginationDTO = { page: 3, skip: 4, limit: 2 };
      const sort: SortDTO = { property: "name", direction: "ASC" };
      const foundProgram: PaginatedResultDTO<Program> = {
        "items": [
          {
            id: 1,
            name: "Test Program",
            description: "Test Description",
            coverImage: "test.jpg",
            medias: null
          },
          {
            id: 2,
            name: "Test Program 2",
            description: "Test Description 2",
            coverImage: "test2.jpg",
            medias: null
          }
        ],
        "totalItems": 6,
        "totalPages": 3,
        "page": 3,
        "size": 2
      };

      repositoryMock.findAndCount.mockResolvedValue([foundProgram.items, 6]);

      const result = await programRepository.findPaginated(query, pagination, sort);

      expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
        where: { 
          name: Like(query.name),
          description: Like(query.description),
          coverImage: query.coverImage
         },
        order: {
          name: "ASC"
        },
        skip: 4,
        take: 2
      });
      expect(result).toEqual(foundProgram);
    });
  });

  describe("findOneAndUpdate", () => {
    it("should find a program item by its ID and update it", async () => {
      const id = 1;
      const update = { name: "Test Program Updated" };
      const foundProgram: Program = {
        id,
        name: "Test Program",
        description: "Test Description",
        coverImage: "test.jpg",
        medias: null
      };
      const updatedProgram: Program = {
        id,
        name: "Test Program Updated",
        description: "Test Description",
        coverImage: "test.jpg",
        medias: null
      };

      repositoryMock.findOneBy.mockResolvedValue(foundProgram);
      repositoryMock.update.mockResolvedValue(updatedProgram);

      const result = await programRepository.findOneAndUpdate(id, update);

      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({id});
      expect(repositoryMock.update).toHaveBeenCalledWith({ id }, updatedProgram);
      expect(result).toEqual(updatedProgram);
    });

    it("should throw an error if program item is not found", async () => {
      const id = 1;
      const update = { name: "Test Program Updated" };

      repositoryMock.findOneBy.mockResolvedValue(null);

      await expect(programRepository.findOneAndUpdate(id, update)).rejects.toThrow("Program with id 1 does not exist");
    });
  });

  describe("delete", () => {
    it("should return true if program item is deleted", async () => {
      const id = 1;

      repositoryMock.delete.mockResolvedValue({affected: 1});

      const result = await programRepository.delete(id);

      expect(repositoryMock.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(true);
    });

    it("should return false if program item is not found", async () => {
      const id = 1;

      repositoryMock.delete.mockResolvedValue({affected: 0});

      const result = await programRepository.delete(id);

      expect(repositoryMock.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(false);
    });
  });
});