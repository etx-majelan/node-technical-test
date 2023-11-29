
import { Controller, DELETE, ErrorHandler, GET, POST } from 'fastify-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';

import ProgramService from "@domain/services/program.service";

import extractPaginationParamsHook from '@application/hooks/paginationParams.hook';
import { extractSortProgramParamsHook } from '@application/hooks/sortParams.hook';

import CreateProgramDTO from '@application/dtos/program/createProgram.dto';
import QueryProgramDTO from "@application/dtos/program/queryProgram.dto";
import PaginationDTO from "@application/dtos/pagination.dto";
import SortDTO from "@application/dtos/sort.dto";

import {
  CreateProgramSchema,
  DeleteProgramSchema,
  GetAllProgramSchema,
  GetProgramSchema,
  UpdateProgramSchema,
} from "@application/schemas/program.schema";
import { NotFoundException } from '@application/exeptions/http.exception';
import Program from '@domain/entities/program.entity';
import PaginatedResultDTO from '@application/dtos/paginatedResult.dto';
import { instanceToPlain } from 'class-transformer';

declare module 'fastify' {
  interface FastifyRequest {
    sort: any;
    pagination: any;
  }
}

/**
 * Controller class for managing programs.
 */
@Controller('/program')
export default class ProgramController {
  constructor(private _programService: ProgramService) {}

  @POST('/', {
    schema: CreateProgramSchema
  })
  public async createProgram(request: FastifyRequest<{Body: CreateProgramDTO}>, reply: FastifyReply): Promise<void> {
      const createdProgram = await this._programService.createProgram(request.body);
      reply.status(201).send(createdProgram);
  }

  @GET('/:id', {
    schema: GetProgramSchema
  })
  public async getProgram(req: FastifyRequest<{
    Params: { id: number },
  }>, res: FastifyReply): Promise<void> {
      const program = await this._programService.getProgramById(req.params.id);
      
      if (!program) {
        res.status(404).send({ error: 'Program not found' });
        return;
      }
      res.status(200).send(instanceToPlain(program));

  }

  
  @GET('/', {
    preHandler: [
      extractSortProgramParamsHook,
      extractPaginationParamsHook
    ],
    schema: GetAllProgramSchema
  })
  public async getAllProgram(req: FastifyRequest<{
    Querystring: QueryProgramDTO
  }>, res: FastifyReply): Promise<void> {
      const query: QueryProgramDTO = new QueryProgramDTO({
        name: req.query.name,
        description: req.query.description,
        coverImage: req.query.coverImage
      });
      const pagination: PaginationDTO = req.pagination;
      const sort: SortDTO = req.sort;
  
      const programs: PaginatedResultDTO<Program> = await this._programService.getProgram(query, pagination, sort);
      res.status(200).send(instanceToPlain(programs));
  }

  @POST('/:id', {
    schema: UpdateProgramSchema
  })
  public async updateProgram(request: FastifyRequest<{Params: {id: number}, Body: Partial<CreateProgramDTO>}>, reply: FastifyReply): Promise<void> {
    try {
      const updatedProgram = await this._programService.updateProgram(request.params.id, request.body);
      reply.status(200).send(updatedProgram);
    } catch (error) {
      if (error instanceof NotFoundException)
        reply.status(error.httpStatusCode).send({ error: error.message });
      else
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @DELETE('/:id', {
    schema: DeleteProgramSchema
  })
  public async deleteProgram(request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<void> {
    const deletedProgram = await this._programService.deleteProgram(request.params.id);
    if (deletedProgram) {
      reply.status(204).send();
    } else {
      throw new NotFoundException('Program not found');
    }
  }

  @ErrorHandler(NotFoundException)
  handleTokenNotFound(error: NotFoundException, request, reply) {
    reply.status(404).send({ error: error.message });
  }
}