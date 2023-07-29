const { Game } = require("../../../models/game/game");
const server = require("../../../index");
const request = require("supertest")(server);
const { Genre } = require("../../../models/genre");
const { Developer } = require("../../../models/developer");
const getAdminToken = require("../../utils/getAdminToken");
const mongoose = require("mongoose");
const { createNewGame, getNewGameObject } = require("./utils/createNewGame");
const decodeToken = require("../../../utils/decodeToken");
const dbDisconnection = require("../../../setup/dbDisconnection");
const getHexedObjectId = require("../../../utils/getHexedObjectId");
const getValidNewGameRequestBody = require("./utils/getValidNewGameRequestBody");

const route = "/api/games/";

describe(route, () => {
  afterAll(() => {
    dbDisconnection();
    server.close();
  });

  afterEach(async () => {
    await Game.deleteMany({});
    await Genre.deleteMany({});
    await Developer.deleteMany({});
  });

  describe("GET", () => {
    const exec = () => request.get(route);

    describe("/", () => {
      test("if valid request return 200", async () => {
        const res = await exec();

        expect(res.status).toBe(200);
      });

      test("if returned array of documents contain created game", async () => {
        const { gameId } = await createNewGame();

        const res = await exec();

        expect(res.body.some((game) => game._id === gameId)).toBe(true);
      });
    });

    describe("/:gameId", () => {
      const exec = (gameId) => request.get(route + gameId);

      test("if game doesnt exist, it will return 404", async () => {
        const gameId = getHexedObjectId();

        const res = await exec(gameId);

        expect(res.status).toEqual(404);
      });
      test("if valid request, it will return 200", async () => {
        const { gameId } = await createNewGame();

        const res = await exec(gameId);

        expect(res.status).toEqual(200);
      });
      test("if valid request, it will return game", async () => {
        const { gameId } = await createNewGame();

        const res = await exec(gameId);

        expect(res.body._id).toEqual(gameId);
      });
    });
  });

  describe("PUT", () => {
    const { token } = getAdminToken();

    describe("/:gameId", () => {
      const exec = (gameId, changedGame) =>
        request
          .put(route + gameId)
          .set("x-auth-token", token)
          .send(changedGame);

      test("if valid request, it will return 200", async () => {
        const { gameId } = await createNewGame();

        let changedGame = await getNewGameObject(
          {
            title: "New game title",
            price: 28,
            description: "b".repeat(26),
          },
          "New developer",
          "New genre"
        );

        changedGame = {
          ...changedGame,
          genreId: changedGame.genre._id,
          developerId: changedGame.developer._id,
        };

        delete changedGame.developer;
        delete changedGame.genre;

        const res = await exec(gameId, changedGame);
        expect(res.status).toBe(200);
      });

      test("if document was updated", async () => {
        const { gameId } = await createNewGame();

        let changedGame = await getNewGameObject(
          {
            title: "New game title",
            price: 28,
            description: "a".repeat(26),
          },
          "New developer",
          "New genre"
        );

        changedGame = {
          ...changedGame,
          genreId: changedGame.genre._id,
          developerId: changedGame.developer._id,
        };

        const developer = changedGame.developer;
        const genre = changedGame.genre;

        delete changedGame.developer;
        delete changedGame.genre;

        await exec(gameId, changedGame);

        changedGame.genre = genre;
        changedGame.developer = developer;

        delete changedGame.genreId;
        delete changedGame.developerId;

        const updatedGameInDB = await Game.findById(gameId);

        expect({
          price: updatedGameInDB.price,
          title: updatedGameInDB.title,
          description: updatedGameInDB.description,
          genre: updatedGameInDB.genre.name,
          developer: updatedGameInDB.developer.name,
        }).toMatchObject({
          price: changedGame.price,
          title: changedGame.title,
          description: changedGame.description,
          genre: changedGame.genre.name,
          developer: changedGame.developer.name,
        });
      });

      test("if developer for provided developerId doesnt exists", async () => {
        const { gameId } = await createNewGame();

        let changedGame = await getNewGameObject(
          {
            title: "New game title",
            price: 28,
            description: "a".repeat(26),
          },
          "New developer",
          "New genre"
        );

        const randomObjectId = getHexedObjectId();

        changedGame = {
          ...changedGame,
          genreId: changedGame.genre._id,
          developerId: randomObjectId,
        };

        delete changedGame.developer;
        delete changedGame.genre;

        const res = await exec(gameId, changedGame);

        expect(res.status).toEqual(404);
      });
      test("if genre for provided genreId doesnt exists", async () => {
        const { gameId } = await createNewGame();

        let changedGame = await getNewGameObject(
          {
            title: "New game title",
            price: 28,
            description: "a".repeat(26),
          },
          "New developer",
          "New genre"
        );

        const randomObjectId = getHexedObjectId();

        changedGame = {
          ...changedGame,
          genreId: randomObjectId,
          developerId: changedGame.developer._id,
        };

        delete changedGame.developer;
        delete changedGame.genre;

        const res = await exec(gameId, changedGame);

        expect(res.status).toEqual(404);
      });

      test("if valid request, it will return updated document", async () => {
        const { gameId, newGame } = await createNewGame();

        let changedGame = await getNewGameObject(
          {
            title: "New game title",
            price: 28,
            description: "b".repeat(26),
          },
          "New developer",
          "New genre"
        );

        changedGame = {
          ...changedGame,
          genreId: changedGame.genre._id,
          developerId: changedGame.developer._id,
        };

        delete changedGame.developer;
        delete changedGame.genre;

        const res = await exec(gameId, changedGame);

        expect(res.body).not.toEqual(newGame);
      });

      test("if we pass empty request body, it wont change document", async () => {
        const { gameId, newGame } = await createNewGame();

        let changedGame = {};

        await exec(gameId, changedGame);

        const updatedGameInDB = await Game.findById(gameId);

        expect({
          price: updatedGameInDB.price,
          title: updatedGameInDB.title,
          description: updatedGameInDB.description,
          genre: updatedGameInDB.genre.name,
          developer: updatedGameInDB.developer.name,
        }).toMatchObject({
          price: newGame.price,
          title: newGame.title,
          description: newGame.description,
          genre: newGame.genre.name,
          developer: newGame.developer.name,
        });
      });

      test("if valid request, it will set updatedDate", async () => {
        const { gameId } = await createNewGame();

        let changedGame = await getNewGameObject(
          {
            title: "New game title",
            price: 28,
            description: "b".repeat(26),
          },
          "New developer",
          "New genre"
        );

        changedGame = {
          ...changedGame,
          genreId: changedGame.genre._id,
          developerId: changedGame.developer._id,
        };

        delete changedGame.developer;
        delete changedGame.genre;

        await exec(gameId, changedGame);

        const updatedGameInDB = await Game.findById(gameId);

        expect(updatedGameInDB.updateDate).toBeDefined();
      });
    });
  });

  describe("POST", () => {
    const { token } = getAdminToken();

    describe("/", () => {
      const exec = (validGame) =>
        request.post(route).set("x-auth-token", token).send(validGame);

      test("if developer for provided developerId does not exist, it will return 404", async () => {
        const validNewGameParams = await getValidNewGameRequestBody();
        const res = await exec({
          ...validNewGameParams,
          developerId: new mongoose.Types.ObjectId(),
        });

        expect(res.status).toBe(404);
      });

      test("if genre for provided genreId does not exist, it will return 404", async () => {
        const validNewGameParams = await getValidNewGameRequestBody();
        const res = await exec({
          ...validNewGameParams,
          genreId: new mongoose.Types.ObjectId(),
        });

        expect(res.status).toBe(404);
      });

      test("if wrong date, it will return 400", async () => {
        const validNewGameParams = await getValidNewGameRequestBody();
        const res = await exec({
          ...validNewGameParams,
          releaseDate: "29 05 1995",
        });

        expect(res.status).toBe(400);
      });

      test("if valid request, it will return 200", async () => {
        const validNewGameParams = await getValidNewGameRequestBody();
        const res = await exec(validNewGameParams);

        expect(res.status).toBe(201);
      });

      test("if document contain addedBy property", async () => {
        const validNewGameParams = await getValidNewGameRequestBody();
        const res = await exec(validNewGameParams);

        const decodedJWT = decodeToken(token);

        expect(res.body.addedBy).toEqual(decodedJWT.name);
      });
    });
  });

  describe("DELETE", () => {
    const { token } = getAdminToken();
    describe("/:gameId", () => {
      const exec = (gameId) =>
        request.delete(route + gameId).set("x-auth-token", token);

      test("if valid request, it will send 200", async () => {
        const { gameId } = await createNewGame();

        const res = await exec(gameId);
        expect(res.status).toBe(200);
      });
      test("if valid request, it will send deleted document", async () => {
        const { gameId } = await createNewGame();

        const res = await exec(gameId);
        expect(res.body._id).toEqual(gameId);
      });
      test("if document was deleted", async () => {
        const { gameId } = await createNewGame();

        await exec(gameId);

        const deletedGameInDB = await Game.findById(gameId);

        expect(deletedGameInDB).toBeNull();
      });
      test("if game for provided gameId doesnt exists, it will return 404", async () => {
        const gameId = getHexedObjectId();

        const res = await exec(gameId);

        expect(res.status).toEqual(404);
      });
    });
  });
});
