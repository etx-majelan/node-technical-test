import { Type, Static } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

const CreateProgramBodySchema = Type.Object({
    name: Type.String(),
    coverImage: Type.String(),
    description: Type.Optional(Type.String())
});
export type CreateProgramType = Static<typeof CreateProgramBodySchema>;

const UpdateProgramBodySchema = Type.Object({
    name: Type.Optional(Type.String()),
    coverImage: Type.Optional(Type.String()),
    description: Type.Optional(Type.String())
});
export type UpdateProgramType = Static<typeof UpdateProgramBodySchema>;

const GetProgramQueryStringSchema = Type.Object({
    name: Type.Optional(Type.String()),
    coverImage: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    page: Type.Optional(Type.Number()),
    size: Type.Optional(Type.Number()),
    orderBy: Type.Optional(Type.String()),
    orderDirection: Type.Optional(Type.String({pattern: '^(ASC|DESC)$'}))
});
export type QueryProgramType = Static<typeof GetProgramQueryStringSchema>;

export const ProgramSchema = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    coverImage: Type.String(),
    description: Type.String()
});
export type ProgramType = Static<typeof ProgramSchema>;

const PaginatedProgramSchema = Type.Object({
    items: Type.Array(ProgramSchema),
    totalItems: Type.Number(),
    totalPages: Type.Number(),
    page: Type.Number(),
    size: Type.Number()
});
export type PaginatedProgramType = Static<typeof PaginatedProgramSchema>;


const ServerErrorSchema = {
    description: 'Internal Server Error',
    type: 'object',
    properties: {
        error: { type: 'string' }
    }
}

const ProgramNotFoundErrorSchema = {
    description: 'Program not found',
    type: 'object',
    properties: {
        error: { type: 'string' }
    }
}

export const CreateProgramSchema: FastifySchema = {
    tags: ['Program'],
    description: 'Create a new Program',
    summary: 'Create a new Program',
    body: CreateProgramBodySchema,
    response: {
        201: {
            description: 'The created Program',
            ...ProgramSchema
        }
    }
}

export const GetProgramSchema: FastifySchema = {
    tags: ['Program'],
    description: 'Get a Program by id',
    summary: 'Get a Program by id',
    params: { id: { type: 'number' } },
    response: {
        200: {
            description: 'The requested Program',
            ...ProgramSchema
        },
        404: ProgramNotFoundErrorSchema,
        500: ServerErrorSchema
    }
}

export const GetAllProgramSchema: FastifySchema = {
    tags: ['Program'],
    summary: 'Query Program',
    description: 'Query Program with pagination, sorting and filtering',
    querystring: GetProgramQueryStringSchema,
    response: {
        200: {
            description: 'The requested Program',
            ...PaginatedProgramSchema
        },
        500: ServerErrorSchema
    }
}

export const UpdateProgramSchema: FastifySchema = {
    tags: ['Program'],
    description: 'Update a Program by id',
    summary: 'Update a Program by id',
    params: { id: { type: 'number' } },
    body: UpdateProgramBodySchema,
    response: {
        200: {
            description: 'The updated Program',
            ...ProgramSchema
        },
        404: ProgramNotFoundErrorSchema,
        500: ServerErrorSchema
    }
}

export const DeleteProgramSchema: FastifySchema = {
    tags: ['Program'],
    summary: 'Delete a Program by id',
    description: 'If the deleted Program has associated Media, they will be updated as well.',
    params: { id: { type: 'number' } },
    response: {
        204: {
            type: 'object',
            properties: {}
        },
        404: ProgramNotFoundErrorSchema,
        500: ServerErrorSchema
    }
}