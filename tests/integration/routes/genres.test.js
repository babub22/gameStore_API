const { default: mongoose } = require("mongoose");
const app = require("../../../index");
const request = require("supertest")(app);
const { Genre } = require("../../../models/genre");

const route = "/api/genres/";

async function createNewGenre() {
  let newGenre = new Genre({
    name: "genre1",
  });

  await newGenre.save();

  const genreId = newGenre._id.toHexString();

  return { genreId, newGenre };
}

describe(route, () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });

  describe("GET", () => {
    describe("/", () => {
      const exec = () => request.get(route);

      test("if valid request return 200", async () => {
        const res = await exec();

        expect(res.status).toBe(200);
      });

      test("if returned array of documents contain created genre", async () => {
        const { genreId } = await createNewGenre();

        const res = await exec();

        expect(res.body.some((genre) => genre._id === genreId)).toBe(true);
      });
    });

    describe("/:id", () => {
      const exec = (objectId) =>
        request.get(route + objectId).send({ objectId });

      test("if objectId is invalid return 400", async () => {
        const res = await exec("1234");

        expect(res.status).toBe(400);
      });

      test("if not found document for provided id return 404", async () => {
        const randomObjectId = new mongoose.Types.ObjectId();
        const res = await exec(randomObjectId);

        expect(res.status).toBe(404);
      });

      test("if valid request return 200", async () => {
        const { genreId } = await createNewGenre();

        const res = await exec(genreId);

        expect(res.status).toBe(200);
      });

      test("if returned document is same document that was created", async () => {
        const { genreId } = await createNewGenre();

        const res = await exec(genreId);

        expect(res.body._id === genreId).toBe(true);
      });
    });
  });
});
