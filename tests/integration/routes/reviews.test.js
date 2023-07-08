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

const route = "/api/reviews/";

async function createNewReview(token) {
  const { newGame } = await createNewGame();
  const user = jwt.verify(token, config.get("jwtPrivateKey"));

  const obj = newGame.toObject();

  const newReview = new Review({
    game: obj,
    author: user,
    text: new Array(15).join("a"),
    gameScore: 7,
  });

  await newReview.save();

  const reviewId = newReview._id.toHexString();

  return { reviewId, newReview };
}

describe(route, () => {
  afterEach(async () => {
    await Review.deleteMany({});
    await Game.deleteMany({});
    await Genre.deleteMany({});
    await Developer.deleteMany({});
  });

  const { token } = getAdminToken();

  describe("GET", () => {
    describe("/:gameId", () => {
      const exec = (gameId) => request.get(route + gameId);

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
  });
});
