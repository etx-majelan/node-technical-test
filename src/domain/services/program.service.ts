import { Inject, Service } from "fastify-decorators";

import ProgramRepository from "@infrastructure/repositories/program.repository";

import Program from "@domain/entities/program.entity";
import PaginationDTO from "@application/dtos/pagination.dto";
import PaginatedResultDTO from "@application/dtos/paginatedResult.dto";
import SortDTO from "@application/dtos/sort.dto";
import CreateProgramDTO from "@application/dtos/program/createProgram.dto";
import QueryProgramDTO from "@application/dtos/program/queryProgram.dto";
import UpdateProgramDTO from "@application/dtos/program/updateProgram.dto";
import { NotFoundError } from "@infrastructure/errors/NotFoundError.error";
import { NotFoundException } from "@application/exeptions/http.exception";

@Service()
export default class ProgramService {
  @Inject(ProgramRepository)
  programRepository!: ProgramRepository;
  
  async createProgram(program: CreateProgramDTO): Promise<Program> {
    const createdProgram = await this.programRepository.create(program);

    return createdProgram;
  }

  async getProgramById(id: number): Promise<Program | null> {
    const program = await this.programRepository.findById(id);

    return program;
  }

  async getProgram(query: QueryProgramDTO, pagination: PaginationDTO, sort?: SortDTO): Promise<PaginatedResultDTO<Program>> {
    return await this.programRepository.findPaginated(query, pagination, sort);
  }

  async updateProgram(id: number, data: UpdateProgramDTO): Promise<Program | null> {
    try {
      const updatedProgram = await this.programRepository.findOneAndUpdate(id, data);
      return updatedProgram;
    } catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(`Program with id ${id} does not exist`);
      else throw error;
    }
  }

  async deleteProgram(id: number): Promise<boolean> {
    const deleted = await this.programRepository.delete(id);

    return deleted;
  }
}