const app = require("../../../index");
const request = require("supertest")(app);
const { Developer } = require("../../../models/developer");
const getAdminToken = require("../../utils/getAdminToken");

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

  describe("POST", () => {
    const { token } = getAdminToken();
    const validNewDeveloper = { name: "newGenre" };
    const exec = (newDeveloper) =>
      request.post(route).set("x-auth-token", token).send(newDeveloper);

    describe("/", () => {
      test("if request data invalid, it will return 400", async () => {
        const res = await exec({ name: "" });

        expect(res.status).toBe(400);
      });

      test("if request data valid, it will return 200", async () => {
        const res = await exec(validNewDeveloper);

        expect(res.status).toBe(200);
      });

      test("if document was created", async () => {
        const res = await exec(validNewDeveloper);

        const developerInDB = await Developer.findOne(validNewDeveloper);

        expect(res.body._id).toBe(developerInDB._id.toHexString());
      });
    });
  });
});
