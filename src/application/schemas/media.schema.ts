import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

const CreateMediaBodySchema = Type.Object({
    name: Type.String(),
    file: Type.String(),
    duration: Type.Number(),
    description: Type.Optional(Type.String()),
    program: Type.Optional(Type.Number())
});
// export type CreateMediaDtoType = Static<typeof CreateMediaBodySchema>;

export const MediaSchema = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    file: Type.String(),
    duration: Type.Number(),
    description: Type.Optional(Type.String()),
    program: Type.Optional(Type.Number())
});
// export type MediaType = Static<typeof mediaSchema>;

const PaginatedMediaSchema = Type.Object({
    items: Type.Array(MediaSchema),
    totalItems: Type.Number(),
    totalPages: Type.Number(),
    page: Type.Number(),
    size: Type.Number()
});
// export type PaginatedMediaType<T> = Static<typeof PaginatedMediaSchema>;

const GetMediaQueryStringSchema = Type.Object({
    name: Type.Optional(Type.String()),
    maxDuration: Type.Optional(Type.Number()),
    minDuration: Type.Optional(Type.Number()),
    description: Type.Optional(Type.String()),
    program: Type.Optional(Type.Number()),
    page: Type.Optional(Type.Number()),
    size: Type.Optional(Type.Number()),
    orderBy: Type.Optional(Type.String({pattern: '^(ASC|DESC)$'})),
});
// export type GetMediaQueryStringType = Static<typeof GetMediaQueryStringSchema>;

const UpdateMediaBodySchema = Type.Object({
    name: Type.Optional(Type.String()),
    file: Type.Optional(Type.String()),
    duration: Type.Optional(Type.Number()),
    description: Type.Optional(Type.String()),
    program: Type.Optional(Type.Number())
});
// export type UpdateMediaBodyType = Static<typeof UpdateMediaBodySchema>;


const ServerErrorSchema = {
    description: 'Internal Server Error',
    type: 'object',
    properties: {
        error: { type: 'string' }
    }
}

const MediaNotFoundErrorSchema = {
    description: 'Media not found',
    type: 'object',
    properties: {
        error: { type: 'string' }
    }
}

export const CreateMediaSchema: FastifySchema = {
    tags: ['Media'],
    description: 'Create a new Media',
    summary: 'Create a new Media',
    body: CreateMediaBodySchema,
    response: {
        201: {
            description: 'The created Media',
            ...MediaSchema
        }
    }
}

export const GetMediaSchema: FastifySchema = {
    tags: ['Media'],
    summary: 'Get a Media by id',
    description: 'Get a Media by id',
    params: { id: { type: 'number' } },
    response: {
        200: {
            description: 'The requested Media',
            ...MediaSchema
        },
        404: MediaNotFoundErrorSchema,
        500: ServerErrorSchema
    }
}

export const GetAllMediaSchema: FastifySchema = {
    tags: ['Media'],
    summary: 'Query Media',
    description: 'Query Media with pagination, sorting and filtering',
    querystring: GetMediaQueryStringSchema,
    response: {
        200: {
            description: 'The requested Media',
            ...PaginatedMediaSchema
        },
        500: ServerErrorSchema
    }
}

export const UpdateMediaSchema: FastifySchema = {
    tags: ['Media'],
    summary: 'Update a Media by id',
    description: 'Update a Media by id with the given parameters.\n\
        If a programId is given, the server will check if the program exists and update the Media with the given program or reject the request with a 404 error.\n\
        Returns the updated Media.',
    params: { id: { type: 'number' } },
    body: UpdateMediaBodySchema,
    response: {
        200: {
            description: 'The updated Media',
            ...MediaSchema
        },
        404: MediaNotFoundErrorSchema,
        500: ServerErrorSchema
    }
}

export const DeleteMediaSchema: FastifySchema = {
    tags: ['Media'],
    summary: 'Delete a Media by id',
    description: 'Delete a Media by id.',
    params: { id: { type: 'number' } },
    response: {
        204: {
            type: 'object',
            properties: {}
        },
        404: MediaNotFoundErrorSchema,
        500: ServerErrorSchema
    }
}