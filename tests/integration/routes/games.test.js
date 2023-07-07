const { Game } = require("../../../models/game");
const app = require("../../../index");
const request = require("supertest")(app);
const createNewGenre = require("./utils/createNewGenre");
const createNewDevelover = require("./utils/createNewDevelover");
const { Genre } = require("../../../models/genre");
const { Developer } = require("../../../models/developer");
const stringToDate = require("../../../utils/stringToDate");

const route = "/api/games";

async function createNewGame() {
  const { newDeveloper } = await createNewDevelover();
  const { newGenre } = await createNewGenre();

  const gameReleaseDate = stringToDate("30/05/1995");

  const newGame = new Game({
    title: "Game title",
    price: 20,
    gameReleaseDate,
    decription: new Array(26).join("a"),
    genre: newGenre,
    developer: newDeveloper,
  });

  await newGame.save();

  const gameId = newGame._id.toHexString();

  return { gameId, newGame };
}

describe(route, () => {
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
  });
});
