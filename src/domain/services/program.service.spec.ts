import ProgramService from "./program.service";
import ProgramRepository from "@infrastructure/repositories/program.repository";
import CreateProgramDTO from "@application/dtos/program/createProgram.dto";
import QueryProgramDTO from "@application/dtos/program/queryProgram.dto";
import UpdateProgramDTO from "@application/dtos/program/updateProgram.dto";
import { configureServiceTest } from "fastify-decorators/testing";
import { NotFoundError } from "@infrastructure/errors/NotFoundError.error";
import { NotFoundException } from "@application/exeptions/http.exception";

describe("Service: Program Service", () => {
    let programService: ProgramService;
    let programRepository: Record<keyof ProgramRepository, jest.Mock>;

    beforeEach(() => {
        programRepository = {
            exists: jest.fn(),
            create: jest.fn(),
            findPaginated: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            delete: jest.fn(),
          } as Record<keyof ProgramRepository, jest.Mock>;

          programService = configureServiceTest({
            service: ProgramService,
            mocks: [
              {
                provide: ProgramRepository,
                useValue: programRepository
              },
            ],
          })
    });


    describe("createProgram", () => {
        it("should create a new program", async () => {
            // Arrange
            const programData: CreateProgramDTO = {
                name: "test",
                description: "ceci est un test",
                coverImage: "test.png"
            };
            programRepository.create.mockResolvedValueOnce({});

            // Act
            const createdProgram = await programService.createProgram(programData);

            // Assert
            expect(createdProgram).toBeDefined();
            expect(programRepository.create).toHaveBeenCalledWith(programData);
        });
    });

    describe("getProgramById", () => {
        it("should return a program by its ID", async () => {
            // Arrange
            const programId = 1;
            programRepository.findById.mockResolvedValueOnce({});

            // Act
            const program = await programService.getProgramById(programId);

            // Assert
            expect(program).toBeDefined();
            expect(programRepository.findById).toHaveBeenCalledWith(programId);
        });
    });

    describe("getProgram", () => {
        it("should return a paginated result of programs", async () => {
            // Arrange
            const query: QueryProgramDTO = {
                name: "test",
                description: "ceci est un test"
            };
            const pagination = {
                page: 1,
                limit: 10,
                skip: 0
            };
            programRepository.findPaginated.mockResolvedValueOnce({});

            // Act
            const result = await programService.getProgram(query, pagination);

            // Assert
            expect(result).toBeDefined();
            expect(programRepository.findPaginated).toHaveBeenCalledWith(query, pagination, undefined);
        });
    });

    describe("updateProgram", () => {
        it("should update a program by its ID", async () => {
            // Arrange
            const programId = 1;
            const updateData: UpdateProgramDTO = {
                name: "test"
            };
            programRepository.findOneAndUpdate.mockResolvedValueOnce({});

            // Act
            const updatedProgram = await programService.updateProgram(programId, updateData);

            // Assert
            expect(updatedProgram).toBeDefined();
            expect(programRepository.findOneAndUpdate).toHaveBeenCalledWith(programId, updateData);
        });

        it("should throw an error if program is not found", async () => {
            // Arrange
            const programId = 1;
            const updateData: UpdateProgramDTO = {
                name: "test"
            };
            programRepository.findOneAndUpdate.mockRejectedValueOnce(new NotFoundError("Program with id 1 does not exist"));

            // Act/Assert
            expect(programService.updateProgram(programId, updateData)).rejects.toThrow(NotFoundException);
        })
    });

    describe("deleteProgram", () => {
        it("should delete a program by its ID", async () => {
            // Arrange
            const programId = 1;
            programRepository.delete.mockResolvedValueOnce(true);

            // Act
            const isDeleted = await programService.deleteProgram(programId);

            // Assert
            expect(isDeleted).toBe(true);
            expect(programRepository.delete).toHaveBeenCalledWith(programId);
        });
    });
});
