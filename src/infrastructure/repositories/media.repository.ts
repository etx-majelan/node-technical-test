import { Repository, Between, Like, DeleteResult, UpdateResult } from "typeorm";

import { Initializer, Service } from "fastify-decorators";

import Media from "@domain/entities/media.entity";

import PaginationDTO from "@application/dtos/pagination.dto";
import PaginatedResultDTO from "@application/dtos/paginatedResult.dto";
import SortDTO from "@application/dtos/sort.dto";
import QueryMediaDTO from "@application/dtos/media/queryMedia.dto";
import ConnectionService from "@infrastructure/databases/connection.service";
import { NotFoundError } from "@infrastructure/errors/NotFoundError.error";

@Service()
export default class MediaRepository {
  private repository!: Repository<Media>;

  constructor(private _connectionService: ConnectionService) {}

  @Initializer([ConnectionService])
  async init(): Promise<void> {
    this.repository = this._connectionService.DataSource.getRepository(Media);
  }

  /**
   * Creates a new media entity.
   * @param media - The partial media object to be created.
   * @returns A promise that resolves to the created media entity.
   */
  async create(media: Partial<Media>): Promise<Media> {
    const createdMedia = await this.repository.create(media);
    return await this.repository.save(createdMedia);
  }

  /**
   * Finds a media item by its ID.
   * @param id - The ID of the media item.
   * @returns A Promise that resolves to the found media item or null if not found.
   */
  async findById(id: number): Promise<Media | null> {
    return await this.repository.findOneBy({id});
  }

  /**
   * Finds paginated media based on the provided query, pagination, and sort options.
   * @param query - The query parameters for filtering the media.
   * @param pagination - The pagination options for retrieving a specific page of media.
   * @param sort - The sort options for ordering the media.
   * @returns A promise that resolves to a PaginatedResultDTO containing the paginated media.
   */
  async findPaginated(query: QueryMediaDTO, pagination: PaginationDTO, sort?: SortDTO): Promise<PaginatedResultDTO<Media>> {
    const where: any = {
      name: query.name ? Like(query.name) : undefined,
      duration: query.maxDuration ? Between(query.minDuration, query.maxDuration) : undefined,
      program: query.program ? query.program : undefined
    }

    const order = sort ? { [sort.property]: sort.direction } : undefined;

    const [medias, totalItems] = await this.repository.findAndCount({
      where,
      order,
      skip: pagination.skip,
      take: pagination.limit
    });

    const totalPages = Math.ceil(totalItems / pagination.limit);

    return new PaginatedResultDTO<Media>({ items: medias, totalItems, totalPages, page: pagination.page, size: pagination.limit });
  }

  /**
   * Finds a media by its ID and updates it with the provided partial update object.
   * @param id - The ID of the media to update.
   * @param update - The partial update object containing the fields to update.
   * @returns A Promise that resolves to the updated media.
   * @throws NotFoundError if the media with the given ID does not exist.
   */
  async findOneAndUpdate(id: number, update: Partial<Media>): Promise<Media> {
    const media = await this.repository.findOneBy({id});
    
    if (!media) throw new NotFoundError(`Media with id ${id} does not exist`);

    const updatedMedia = {...media, ...update};

    await this.repository.update({id}, updatedMedia);

    return updatedMedia;
  }

  /**
   * Finds a media by its ID and deletes it.
   * @param id - The ID of the media to delete.
   * @returns A Promise that resolves to true if the media was deleted, or false if the media with the given ID does not exist.
   */
  async delete(id: number): Promise<boolean> {
    const result: DeleteResult = await this.repository.delete(id);

    return !!(result.affected && result.affected > 0);
  }
}