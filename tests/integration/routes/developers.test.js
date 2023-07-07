// const { test } = require("node:test");
const app = require("../../../index");
const request = require("supertest")(app);
const { Developer } = require("../../../models/developer");

async function createNewDevelover() {
  const newDeveloper = new Developer({
    name: "genre1",
  });

  await newDeveloper.save();

  const developerId = newDeveloper._id.toHexString();

  return { developerId, newDeveloper };
}

const route = "/api/developers";

describe(route, () => {
  afterEach(async () => {
    await Developer.deleteMany({});
  });

  describe("GET", () => {
    const exec = () => request.get(route);

    describe("/", () => {
      test("if valid request, it will return 200", async () => {
        const res = await exec();

        expect(res.status).toBe(200);
      });

      test("if returned array of documents contain created developer", async () => {
        const { developerId } = await createNewDevelover();
        const res = await exec();

        expect(
          res.body.some((developer) => developer._id === developerId)
        ).toBe(true);
      });
    });
  });
});
