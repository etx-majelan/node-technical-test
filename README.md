# Majelan Node Technical Test

## Getting Started

This is my implementation of the Majelan Node Technical Test.

The project follows the Clean Architecture Rules.

You can find the 3 main layers: 
Application (Controllers) - Responsible to recieve calls from the clients and to send the result depending of the state fo the server

Domain (Services) - Contains all the Business logic and is not aware of any specificities of the technical aspects (Database, RestAPI/GraphQL, ...)

Infrastructure (Repositories) - Responsible for the database communications 

Some points can still be improved like making the env variable configurable for the project or having some base classes for the repositories,services and controllers.

### Running the thing

This test uses Yarn, along with Docker to get you running quickly with a MySQL Database. You can start the containers and get running with the following commands:

```bash
docker compose up -d
yarn start
```

The api service will run on port 8080.
A swagger will be presented at http://localhost:8080/docs

In order to run the unit tests you can use the following command:

```bash
yarn test
```