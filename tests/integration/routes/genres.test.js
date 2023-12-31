const mongoose = require("mongoose");
const server = require("../../../index");
const request = require("supertest")(server);
const { Genre } = require("../../../models/genre");
const getUserToken = require("../../utils/getUserToken");
const getAdminToken = require("../../utils/getAdminToken");
const createNewGenre = require("./utils/createNewGenre");
const dbDisconnection = require("../../../setup/dbDisconnection");
const getHexedObjectId = require("../../../utils/getHexedObjectId");

const route = "/api/genres/";

describe(route, () => {
  afterAll(() => {
    dbDisconnection();
    server.close();
  });

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

    describe("/:genreId", () => {
      const exec = (genreId) => request.get(route + genreId);

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

  describe("POST", () => {
    const validNewGenre = { name: "newGenre" };
    const exec = (newGenre, token) =>
      request.post(route).set("x-auth-token", token).send(newGenre);

    describe("/", () => {
      test("if no auth token, it will return 401", async () => {
        const res = await request.post(route).send(validNewGenre);

        expect(res.status).toBe(401);
      });
      test("if auth token invalid, it will return 400", async () => {
        const res = await exec(validNewGenre, "1234");

        expect(res.status).toBe(400);
      });
      test("if user is not admin, it will return 403", async () => {
        const { token: userToken } = getUserToken();
        const res = await exec(validNewGenre, userToken);

        expect(res.status).toBe(403);
      });
      const { token: adminToken } = getAdminToken();

      test("if request data invalid, it will return 400", async () => {
        const res = await exec({ name: "a" }, adminToken);

        expect(res.status).toBe(400);
      });

      test("if request data valid, it will return 201", async () => {
        const res = await exec(validNewGenre, adminToken);

        expect(res.status).toBe(201);
      });

      test("if document was created", async () => {
        const res = await exec(validNewGenre, adminToken);

        const genreInDB = await Genre.findOne(validNewGenre);

        expect(res.body._id).toBe(genreInDB._id.toHexString());
      });

      test("if genre already exists, it will return 409", async () => {
        await exec(validNewGenre, adminToken);
        const res = await exec(validNewGenre, adminToken);

        expect(res.status).toEqual(409);
      });
    });
  });

  describe("PUT", () => {
    const { token } = getAdminToken();

    const changedDeveloper = {
      name: "New developer",
    };
    const exec = (genreId) =>
      request
        .put(route + genreId)
        .set("x-auth-token", token)
        .send(changedDeveloper);

    describe("/:genreId", () => {
      test("if review for provided genreId doesnt exists, it will return 404", async () => {
        const wrongReviewId = getHexedObjectId();

        const res = await exec(wrongReviewId);
        expect(res.status).toBe(404);
      });

      test("if valid request, it will return 200", async () => {
        const { genreId } = await createNewGenre(token);

        const res = await exec(genreId);
        expect(res.status).toBe(200);
      });

      test("if document was updated", async () => {
        const { genreId } = await createNewGenre(token);

        await exec(genreId);

        const updatedDeveloperInDB = await Genre.findById(genreId);

        expect(updatedDeveloperInDB).toMatchObject(changedDeveloper);
      });

      test("if valid request, it will return updated document", async () => {
        const { genreId, newGenre } = await createNewGenre(token);

        const res = await exec(genreId);

        expect(res.body).not.toEqual(newGenre);
      });
    });
  });

  describe("DELETE", () => {
    const { token } = getAdminToken();

    const exec = (genreId) =>
      request.delete(route + genreId).set("x-auth-token", token);

    describe("/:genreId", () => {
      test("if developer for provided genreId doesnt exists, it will return 404", async () => {
        const wrongDeveloperId = getHexedObjectId();

        const res = await exec(wrongDeveloperId);
        expect(res.status).toBe(404);
      });
      test("if valid request, it will send 200", async () => {
        const { genreId } = await createNewGenre();

        const res = await exec(genreId);
        expect(res.status).toBe(200);
      });
      test("if valid request, it will send deleted document", async () => {
        const { genreId } = await createNewGenre();

        const res = await exec(genreId);
        expect(res.body._id).toEqual(genreId);
      });
      test("if document was deleted", async () => {
        const { genreId } = await createNewGenre();

        await exec(genreId);

        const deletedReviewInDB = await Genre.findById(genreId);

        expect(deletedReviewInDB).toBeNull();
      });
    });
  });
});
