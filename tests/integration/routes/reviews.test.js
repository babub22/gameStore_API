const jwt = require("jsonwebtoken");
const config = require("config");
const app = require("../../../index");
const request = require("supertest")(app);
const { Review } = require("../../../models/review");
const createNewGame = require("./utils/createNewGame");
const getAdminToken = require("../../utils/getAdminToken");
const { Game } = require("../../../models/game");
const { Genre } = require("../../../models/genre");
const { Developer } = require("../../../models/developer");
const getUserToken = require("../../utils/getUserToken");
const createNewReview = require("./utils/createNewReview");
const mongoose = require("mongoose");
const { omit } = require("lodash");

const route = "/api/reviews/";

describe(route, () => {
  afterEach(async () => {
    await Review.deleteMany({});
    await Game.deleteMany({});
    await Genre.deleteMany({});
    await Developer.deleteMany({});
  });

  const { token } = getAdminToken();

  describe("GET", () => {
    describe("/game/:gameId", () => {
      const exec = (gameId) => request.get(route + "game/" + gameId);

      test("if valid request, it will return 200", async () => {
        const { newReview } = await createNewReview(token);
        const gameId = newReview.game._id;
        const res = await exec(gameId);

        expect(res.status).toBe(200);
      });

      test("if returned array of documents contain created review", async () => {
        const { reviewId, newReview } = await createNewReview(token);

        const gameId = newReview.game._id;
        const res = await exec(gameId);

        expect(res.body.some((review) => review._id === reviewId)).toBe(true);
      });
    });

    describe("/author/:authorId", () => {
      const exec = (authorId) => request.get(route + "author/" + authorId);

      test("if valid request, it will return 200", async () => {
        const { newReview } = await createNewReview(token);
        const authorId = newReview.author._id;
        const res = await exec(authorId);

        expect(res.status).toBe(200);
      });

      test("if returned array of documents contain created review", async () => {
        const { reviewId, newReview } = await createNewReview(token);

        const authorId = newReview.author._id;
        const res = await exec(authorId);

        expect(res.body.some((review) => review._id === reviewId)).toBe(true);
      });
    });
  });

  describe("POST", () => {
    const { token } = getUserToken();
    const exec = (newReview) =>
      request.post(route).set("x-auth-token", token).send(newReview);

    describe("/", () => {
      test("if game for provided gameId does not exist, it will return 404", async () => {
        const validReqBody = await getValidPOSTReqBody(token);
        const res = await exec({
          ...validReqBody,
          gameId: new mongoose.Types.ObjectId(),
        });

        expect(res.status).toBe(404);
      });

      test("if valid request, it will return 200", async () => {
        const validReqBody = await getValidPOSTReqBody(token);
        const res = await exec(validReqBody);

        expect(res.status).toBe(200);
      });

      test("if document contain author property", async () => {
        const validNewGameParams = await getValidPOSTReqBody();
        const res = await exec(validNewGameParams);

        const decodedJWT = jwt.verify(token, config.get("jwtPrivateKey"));
        const userProps = omit(decodedJWT, ["iat", "role"]);

        expect(res.body.author).toEqual(userProps);
      });

      test("if document contain creationDate property", async () => {
        const validNewGameParams = await getValidPOSTReqBody();
        const res = await exec(validNewGameParams);

        const diff = new Date() - Date.parse(res.body.creationDate);
        expect(diff).toBeLessThan(15 * 1000); // 15sec
      });
    });
  });
});

async function getValidPOSTReqBody() {
  const { gameId } = await createNewGame();

  const validReqBody = {
    gameId,
    text: new Array(15).join("a"),
    gameScore: 7,
  };

  return validReqBody;
}
