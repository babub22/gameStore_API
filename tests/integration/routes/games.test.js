const { Game } = require("../../../models/game");
const server = require("../../../index");
const request = require("supertest")(server);
const createNewGenre = require("./utils/createNewGenre");
const createNewDevelover = require("./utils/createNewDevelover");
const { Genre } = require("../../../models/genre");
const { Developer } = require("../../../models/developer");
const getAdminToken = require("../../utils/getAdminToken");
const mongoose = require("mongoose");
const createNewGame = require("./utils/createNewGame");
const decodeToken = require("../../../utils/decodeToken");
const dbDisconnection = require("../../../setup/dbDisconnection");

const route = "/api/games";

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
        const { gameId } = await createNewGame(fakeDate);

        const res = await exec();

        expect(res.body.some((game) => game._id === gameId)).toBe(true);
      });
    });
  });

  describe("POST", () => {
    const { token } = getAdminToken();

    describe("/", () => {
      const exec = (validGame) =>
        request.post(route).set("x-auth-token", token).send(validGame);

      test("if developer for provided developerId does not exist, it will return 404", async () => {
        const validNewGameParams = await getValidNewGameParams();
        const res = await exec({
          ...validNewGameParams,
          developerId: new mongoose.Types.ObjectId(),
        });

        expect(res.status).toBe(404);
      });

      test("if genre for provided genreId does not exist, it will return 404", async () => {
        const validNewGameParams = await getValidNewGameParams();
        const res = await exec({
          ...validNewGameParams,
          genreId: new mongoose.Types.ObjectId(),
        });

        expect(res.status).toBe(404);
      });

      test("if wrong date, it will return 400", async () => {
        const validNewGameParams = await getValidNewGameParams();
        const res = await exec({
          ...validNewGameParams,
          releaseDate: "29 05 1995",
        });

        expect(res.status).toBe(400);
      });

      test("if valid request, it will return 200", async () => {
        const validNewGameParams = await getValidNewGameParams();
        const res = await exec(validNewGameParams);

        expect(res.status).toBe(201);
      });

      test("if document contain addedBy property", async () => {
        const validNewGameParams = await getValidNewGameParams();
        const res = await exec(validNewGameParams);

        const decodedJWT = decodeToken(token);

        expect(res.body.addedBy).toEqual(decodedJWT.name);
      });
    });
  });
});

const fakeDate = Date.parse("1995-05-30");

async function getValidNewGameParams() {
  const { developerId } = await createNewDevelover();
  const { genreId } = await createNewGenre();

  const validNewGameParams = {
    title: "Game title",
    price: 20,
    releaseDate: fakeDate,
    description: new Array(26).join("a"),
    developerId,
    genreId,
  };

  return validNewGameParams;
}
