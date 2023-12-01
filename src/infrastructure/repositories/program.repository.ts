import { Initializer, Service } from "fastify-decorators";

import ConnectionService from "@infrastructure/databases/connection.service";

import Program from "@domain/entities/program.entity";

import PaginationDTO from "@application/dtos/pagination.dto";
import PaginatedResultDTO from "@application/dtos/paginatedResult.dto";
import SortDTO from "@application/dtos/sort.dto";
import QueryProgramDTO from "@application/dtos/program/queryProgram.dto";

import { Repository, Like, DeleteResult, UpdateResult } from "typeorm";
import { NotFoundError } from "@infrastructure/errors/NotFoundError.error";

@Service()
export default class ProgramRepository {
  private repository!: Repository<Program>;

  constructor(private _connectionService: ConnectionService) { }

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    this.repository = this._connectionService.DataSource.getRepository(Program);
  }

  async exists(id: number): Promise<boolean> {
    return await this.repository.exist({where: {id}});
  }

  async create(program: Partial<Program>): Promise<Program> {
    const createdProgram = await this.repository.create(program);
    return await this.repository.save(createdProgram);
  }

  async findById(id: number): Promise<Program | null> {
    return await this.repository.findOneBy({ id });
  }

  async findPaginated(query: QueryProgramDTO, pagination: PaginationDTO, sort?: SortDTO): Promise<PaginatedResultDTO<Program>> {
    const where: any = {
      name: query.name ? Like(query.name) : undefined,
      description: query.description ? Like(query.description) : undefined,
      coverImage: query.coverImage ? query.coverImage : undefined
    }

    const order = sort ? { [sort.property]: sort.direction } : undefined;

    const [programs, totalItems] = await this.repository.findAndCount({
      where,
      order,
      skip: pagination.skip,
      take: pagination.limit
    });

    const totalPages = Math.ceil(totalItems / pagination.limit);
 
    return new PaginatedResultDTO<Program>({ items: programs, totalItems, totalPages, page: pagination.page, size: pagination.limit });
  }

  async findOneAndUpdate(id: number, update: Partial<Program>): Promise<Program> {
    const program = await this.repository.findOneBy({id});
    
    if (!program) throw new NotFoundError(`Program with id ${id} does not exist`);

    const updatedProgram = {...program, ...update};

    await this.repository.update({id}, updatedProgram);

    return updatedProgram;
  }

  async delete(id: number): Promise<boolean> {
    const result: DeleteResult = await this.repository.delete(id);

    return !!(result.affected && result.affected > 0);
  }
}