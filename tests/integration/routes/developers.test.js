const server = require("../../../index");
const request = require("supertest")(server);
const { Developer } = require("../../../models/developer");
const getAdminToken = require("../../utils/getAdminToken");
const createNewDeveloper = require("./utils/createNewDeveloper");
const dbDisconnection = require("../../../setup/dbDisconnection");
const getHexedObjectId = require("../../../utils/getHexedObjectId");

const route = "/api/developers/";

describe(route, () => {
  afterAll(() => {
    dbDisconnection();
    server.close();
  });

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
        const { developerId } = await createNewDeveloper();
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

      test("if request data valid, it will return 201", async () => {
        const res = await exec(validNewDeveloper);

        expect(res.status).toBe(201);
      });

      test("if document was created", async () => {
        const res = await exec(validNewDeveloper);

        const developerInDB = await Developer.findOne(validNewDeveloper);

        expect(res.body._id).toBe(developerInDB._id.toHexString());
      });
      test("if developer already exists, it will return 409", async () => {
        await exec(validNewDeveloper);
        const res = await exec(validNewDeveloper);

        expect(res.status).toEqual(409);
      });
    });
  });

  describe("PUT", () => {
    const { token } = getAdminToken();

    const changedDeveloper = {
      name: "New developer",
    };
    const exec = (developerId) =>
      request
        .put(route + developerId)
        .set("x-auth-token", token)
        .send(changedDeveloper);

    describe("/:developerId", () => {
      test("if review for provided developerId doesnt exists, it will return 404", async () => {
        const wrongReviewId = getHexedObjectId();

        const res = await exec(wrongReviewId);
        expect(res.status).toBe(404);
      });

      test("if valid request, it will return 200", async () => {
        const { developerId } = await createNewDeveloper(token);

        const res = await exec(developerId);
        expect(res.status).toBe(200);
      });

      test("if document was updated", async () => {
        const { developerId } = await createNewDeveloper(token);

        await exec(developerId);

        const updatedDeveloperInDB = await Developer.findById(developerId);

        expect(updatedDeveloperInDB).toMatchObject(changedDeveloper);
      });

      test("if valid request, it will return updated document", async () => {
        const { developerId, newDeveloper } = await createNewDeveloper(token);

        const res = await exec(developerId);

        expect(res.body).not.toEqual(newDeveloper);
      });
    });
  });

  describe("DELETE", () => {
    const { token } = getAdminToken();

    const exec = (developerId) =>
      request.delete(route + developerId).set("x-auth-token", token);

    describe("/:developerId", () => {
      test("if developer for provided developerId doesnt exists, it will return 404", async () => {
        const wrongDeveloperId = getHexedObjectId();

        const res = await exec(wrongDeveloperId);
        expect(res.status).toBe(404);
      });
      test("if valid request, it will send 200", async () => {
        const { developerId } = await createNewDeveloper();

        const res = await exec(developerId);
        expect(res.status).toBe(200);
      });
      test("if valid request, it will send deleted document", async () => {
        const { developerId } = await createNewDeveloper();

        const res = await exec(developerId);
        expect(res.body._id).toEqual(developerId);
      });
      test("if document was deleted", async () => {
        const { developerId } = await createNewDeveloper();

        await exec(developerId);

        const deletedReviewInDB = await Developer.findById(developerId);

        expect(deletedReviewInDB).toBeNull();
      });
    });
  });
});
