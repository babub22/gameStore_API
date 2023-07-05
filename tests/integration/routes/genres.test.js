const app = require("../../../index");
const request = require("supertest")(app);
const { Genre } = require("../../../models/genre");

const route = "/api/genres";

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
    const exec = () => request.get(route);

    describe("/", () => {
      test("if valid request return 200", async () => {
        const res = await exec();

        expect(res.status).toBe(200);
      });

      test("if returned array contain created genre", async () => {
        const { genreId } = await createNewGenre();

        const res = await exec();

        expect(res.body.some((genre) => genre._id === genreId)).toBe(true);
      });
    });
  });
});
