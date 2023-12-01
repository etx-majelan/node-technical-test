
import { Controller, DELETE, ErrorHandler, GET, POST } from 'fastify-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';

import MediaService from "@domain/services/media.service";

import extractPaginationParamsHook from '@application/hooks/paginationParams.hook';
import { extractSortMediaParamsHook } from '@application/hooks/sortParams.hook';

import CreateMediaDTO from '@application/dtos/media/createMedia.dto';
import QueryMediaDTO from "@application/dtos/media/queryMedia.dto";
import PaginationDTO from "@application/dtos/pagination.dto";
import SortDTO from "@application/dtos/sort.dto";

import {
  GetMediaSchema,
  GetAllMediaSchema,
  UpdateMediaSchema,
  DeleteMediaSchema,
  CreateMediaSchema
} from "@application/schemas/media.schema";
import UpdateMediaDTO from '@application/dtos/media/updateMedia.dto';
import { NotFoundException } from '@application/exeptions/http.exception';
import { instanceToPlain } from 'class-transformer';

declare module 'fastify' {
  interface FastifyRequest {
    sort: any;
    pagination: any;
  }
}

@Controller('/media')
export default class MediaController {
  constructor(private _mediaService: MediaService) {}

  @POST('/', {
    schema: CreateMediaSchema
  })
  public async createMedia(request: FastifyRequest<{
    Body: CreateMediaDTO
  }>, reply: FastifyReply): Promise<void> {
    const createdMedia = await this._mediaService.createMedia(request.body);
    reply.status(201).send(createdMedia);
  }

  @GET('/:id', {
    schema: GetMediaSchema,
  })
  public async getMedia(req: FastifyRequest<{
    Params: { id: number },
  }>, res: FastifyReply): Promise<void> {
      const media = await this._mediaService.getMediaById(req.params.id);
      
      if (!media) {
        res.status(404).send({ error: 'Media not found' });
        return;
      }

      res.status(200).send(media);
  }

  @GET('/', {
    preHandler: [
      extractSortMediaParamsHook,
      extractPaginationParamsHook
    ],
    schema: GetAllMediaSchema
  })
  public async getAllMedia(req: FastifyRequest<{
    Querystring: QueryMediaDTO
  }>, res: FastifyReply): Promise<void> {
    const query: QueryMediaDTO = new QueryMediaDTO({
      name: req.query.name,
      description: req.query.description,
      maxDuration: req.query.maxDuration,
      minDuration: req.query.minDuration,
      program: req.query.program
    });
    const pagination: PaginationDTO = req.pagination;
    const sort: SortDTO = req.sort;

    const medias = await this._mediaService.getMedia(query, pagination, sort);
    res.status(200).send(instanceToPlain(medias));
  }

  @POST('/:id', {
    schema: UpdateMediaSchema
  })
  public async updateMedia(request: FastifyRequest<{
    Params: {id: number},
    Body: UpdateMediaDTO
  }>, reply: FastifyReply): Promise<void> {
    try {
      const updatedMedia = await this._mediaService.updateMedia(request.params.id, request.body);
      console.log(updatedMedia);
      reply.status(200).send(updatedMedia);
    }
    catch (error) {
      if (error instanceof NotFoundException)
        reply.status(error.httpStatusCode).send({ error: error.message });
      else
        reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @DELETE('/:id', {
    schema: DeleteMediaSchema
  })
  public async deleteMedia(request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply): Promise<void> {
    const deletedMedia = await this._mediaService.deleteMedia(request.params.id);
    if (deletedMedia) {
      reply.status(204).send();
    } else {
      reply.status(404).send({ error: 'Media not found' });
    }
  }

  @ErrorHandler(NotFoundException)
  handleTokenNotFound(error: NotFoundException, request, reply) {
    reply.status(404).send({ error: error.message });
  }
}