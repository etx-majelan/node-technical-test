import { Inject, Service } from "fastify-decorators";

import MediaRepository from "@infrastructure/repositories/media.repository";
import ProgramRepository from "@infrastructure/repositories/program.repository";

import Media from "@domain/entities/media.entity";
import PaginationDTO from "@application/dtos/pagination.dto";
import PaginatedResultDTO from "@application/dtos/paginatedResult.dto";
import SortDTO from "@application/dtos/sort.dto";
import QueryMediaDTO from "@application/dtos/media/queryMedia.dto";
import CreateMediaDTO from "@application/dtos/media/createMedia.dto";
import UpdateMediaDTO from "@application/dtos/media/updateMedia.dto";
import { NotFoundError } from "@infrastructure/errors/NotFoundError.error";
import { NotFoundException } from "@application/exeptions/http.exception";


@Service()
export default class MediaService {
  @Inject(MediaRepository)
  mediaRepository!: MediaRepository;

  @Inject(ProgramRepository)
  programRepository!: ProgramRepository;

  async createMedia(media: CreateMediaDTO): Promise<Media> {
    const createdMedia = await this.mediaRepository.create(media);

    return createdMedia;
  }

  async getMedia(query: QueryMediaDTO, pagination: PaginationDTO, sort?: SortDTO): Promise<PaginatedResultDTO<Media>> {
    // Retrieve paginated media from repository
    return await this.mediaRepository.findPaginated(query, pagination, sort);
  }

  async getMediaById(id: number): Promise<Media | null> {
    // Retrieve media by id from repository
    const media = await this.mediaRepository.findById(id);

    return media;
  }


  /**
   * Updates a media item with the specified ID.
   * If the provided data includes a program ID, it checks if the program exists before updating the media item.
   * @param id - The ID of the media item to update.
   * @param data - The data to update the media item with.
   * @returns A Promise that resolves to the updated media item, or null if the media item does not exist.
   * @throws NotFoundException if the target media or the provided program ID does not exist.
   */
  async updateMedia(id: number, data: UpdateMediaDTO): Promise<Media | null> {
    if (data.program) {
      // Check if program exists
      const programExists = await this.programRepository.exists(data.program);
      if (!programExists) throw new NotFoundException(`Program with id ${data.program} does not exist`);
    }

    try {
      const updatedMedia = await this.mediaRepository.findOneAndUpdate(id, {program: <any>data.program, ...data});
      return updatedMedia;
    }
    catch (error) {
      if (error instanceof NotFoundError) throw new NotFoundException(`Media with id ${id} does not exist`);
      else throw error;
    }
  }

  async deleteMedia(id: number): Promise<boolean> {
    // Delete media by id
    const deleted = await this.mediaRepository.delete(id);

    return deleted;
  }
}
