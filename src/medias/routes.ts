import { FastifyInstance, RouteShorthandOptions } from 'fastify';

export default function (fastify: FastifyInstance, options: any, done: () => void) {

    // List des medias
    fastify.get("/", async (req, res) => {
        res.send({ message: "get /medias" });
    });

    // Creation d'un media
    fastify.post("/", async (req, res) => {
        res.send({ message: "post /medias" });
    });

    // Lecture d'un media
    fastify.get("/:id", async (req, res) => {
        const params = req.params as {id: string};
        res.send({ message: "get /medias/" + params.id});
    });

    // Mise a jour d'un media
    fastify.put("/:id", async (req, res) => {
        const params = req.params as {id: string};
        res.send({ message: "put /medias/" });
    });
    
    // Suppression d'un media
    fastify.delete("/:id", async (req, res) => {
        const params = req.params as {id: string};
        res.send({ message: "delete /medias/" });
    });

    done();
}
