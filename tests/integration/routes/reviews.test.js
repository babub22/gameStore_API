const server = require("../../../index");
const request = require("supertest")(server);
const { Review } = require("../../../models/review/review");
const createNewGame = require("./utils/createNewGame");
const getAdminToken = require("../../utils/getAdminToken");
const { Game } = require("../../../models/game");
const { Genre } = require("../../../models/genre");
const { Developer } = require("../../../models/developer");
const getUserToken = require("../../utils/getUserToken");
const createNewReview = require("./utils/createNewReview");
const mongoose = require("mongoose");
const { omit } = require("lodash");
const decodeToken = require("../../../utils/decodeToken");
const getHexedObjectId = require("../../../utils/getHexedObjectId");
const dbDisconnection = require("../../../setup/dbDisconnection");

const route = "/api/reviews/";

describe(route, () => {
  afterAll(() => {
    dbDisconnection();
    server.close();
  });

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

      test("if valid request, it will return 201", async () => {
        const validReqBody = await getValidPOSTReqBody(token);
        const res = await exec(validReqBody);

        expect(res.status).toBe(201);
      });

      test("if document contain author property", async () => {
        const validNewGameParams = await getValidPOSTReqBody();
        const res = await exec(validNewGameParams);

        const decodedJWT = decodeToken(token);
        const userProps = omit(decodedJWT, ["iat", "role"]);

        expect(res.body.author).toEqual(userProps);
      });
    });
  });

  describe("PUT", () => {
    describe("/:reviewId", () => {
      const changedReview = {
        text: new Array(15).join("b"),
        gameScore: 2,
      };

      const exec = (reviewId, changedReview, token) =>
        request
          .put(route + reviewId)
          .set("x-auth-token", token)
          .send(changedReview);

      test("if user who try to change review is not the moderator/admin/user who wrote this review, it will return 403", async () => {
        const { token } = getUserToken();
        const { reviewId } = await createNewReview(token);

        const { token: anotherToken } = getUserToken();

        const res = await exec(reviewId, changedReview, anotherToken);
        expect(res.status).toBe(403);
      });

      test("if review for provided reviewId doesnt exist, it will return 404", async () => {
        const { token } = getUserToken();
        const wrongReviewId = getHexedObjectId();

        const res = await exec(wrongReviewId, changedReview, token);
        expect(res.status).toBe(404);
      });

      test("if valid request, it will return 200", async () => {
        const { token } = getUserToken();
        const { reviewId } = await createNewReview(token);

        const res = await exec(reviewId, changedReview, token);
        expect(res.status).toBe(200);
      });

      test("if document was updated", async () => {
        const { token } = getUserToken();
        const { reviewId } = await createNewReview(token);

        await exec(reviewId, changedReview, token);

        const updatedReviewInDB = await Review.findById(reviewId);

        expect(updatedReviewInDB).toMatchObject(changedReview);
      });

      test("if valid request, it will return updated document", async () => {
        const { token } = getUserToken();
        const { reviewId, newReview } = await createNewReview(token);

        const res = await exec(reviewId, changedReview, token);

        expect(res.body).not.toEqual(newReview);
      });
    });
  });

  describe("DELETE", () => {
    describe(" /:reviewId", () => {
      const exec = (reviewId, token) =>
        request.delete(route + reviewId).set("x-auth-token", token);

      test("if user who try to change review is not the moderator/admin/user who wrote this review, it will return 403", async () => {
        const { token } = getUserToken();
        const { reviewId } = await createNewReview(token);

        const { token: anotherToken } = getUserToken();

        const res = await exec(reviewId, anotherToken);
        expect(res.status).toBe(403);
      });

      test("if review for provided reviewId doesnt exist, it will return 404", async () => {
        const { token } = getUserToken();
        const wrongReviewId = getHexedObjectId();

        const res = await exec(wrongReviewId, token);
        expect(res.status).toBe(404);
      });
      test("if valid request, it will send 200", async () => {
        const { token } = getUserToken();
        const { reviewId } = await createNewReview(token);

        const res = await exec(reviewId, token);
        expect(res.status).toBe(200);
      });
      test("if valid request, it will send deleted document", async () => {
        const { token } = getUserToken();
        const { reviewId } = await createNewReview(token);

        const res = await exec(reviewId, token);
        expect(res.body._id).toEqual(reviewId);
      });
      test("if document was deleted", async () => {
        const { token } = getUserToken();
        const { reviewId } = await createNewReview(token);

        await exec(reviewId, token);

        const deletedReviewInDB = await Review.findById(reviewId);

        expect(deletedReviewInDB).toBeNull();
      });
    });
  });

  describe("checkIfProvidedUserWroteThisReview", () => {
    test("if review for provided id doesnt exist, it will return 403 status and message", async () => {
      const { token } = getUserToken();
      const wrongReviewId = getHexedObjectId();

      const decoded = decodeToken(token);

      const response = await Review.checkIfProvidedUserWroteThisReview(
        wrongReviewId,
        decoded
      );
      expect(response).toMatchObject({
        status: 404,
        message: "This review does not exist!",
      });
    });

    test("if user dont have permission to change this review, it will return 404 status and message", async () => {
      const { token } = getUserToken();
      const { reviewId } = await createNewReview(token);
      const { token: anotherToken } = getUserToken();

      const decoded = decodeToken(anotherToken);

      const response = await Review.checkIfProvidedUserWroteThisReview(
        reviewId,
        decoded
      );
      expect(response).toMatchObject({
        status: 403,
        message: "You dont have permission to change this review!",
      });
    });

    test("if it valid request, it will return null", async () => {
      const { token } = getUserToken();
      const { reviewId } = await createNewReview(token);

      const decoded = decodeToken(token);

      const response = await Review.checkIfProvidedUserWroteThisReview(
        reviewId,
        decoded
      );
      expect(response).toBeUndefined();
    });
  });

  describe("POST ", () => {
    describe("/:reviewId", () => {
      describe("/like", () => {
        const exec = (reviewId, token) =>
          request.post(route + reviewId + "/like").set("x-auth-token", token);

        test("if review for provided id doesnt exist, it will return 404", async () => {
          const { token } = getUserToken();
          const wrongReviewId = getHexedObjectId();

          const res = await exec(wrongReviewId, token);
          expect(res.status).toBe(404);
        });
        test("if it valid request, it will return 200", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          const res = await exec(reviewId, token);
          expect(res.status).toBe(200);
        });
        test("if like was put on created review", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await exec(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect(likedReviewInDB.likes).toBeDefined();
        });
        test("if likesCount property has been increased by one", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await exec(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect(likedReviewInDB.likes.likesCount).toBe(1);
        });
        test("if current user has been added to likedUsers array", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);
          const decoded = decodeToken(token);

          await exec(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);
          const likedUserId =
            likedReviewInDB.likes.likedUsers[0]._id.toHexString();

          expect(likedUserId).toEqual(decoded._id);
        });
        test("if property likesDate was set in user object", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await exec(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect(likedReviewInDB.likes.likedUsers[0].likesDate).toBeDefined();
        });
        test("if current user already have like so likesCount should be decreased by one", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await exec(reviewId, token);
          await exec(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect(likedReviewInDB.likes.likesCount).toBe(0);
        });
      });

      describe("/dislike", () => {
        const exec = (reviewId, token) =>
          request
            .post(route + reviewId + "/dislike")
            .set("x-auth-token", token);

        test("if review for provided id doesnt exist, it will return 404", async () => {
          const { token } = getUserToken();
          const wrongReviewId = getHexedObjectId();

          const res = await exec(wrongReviewId, token);
          expect(res.status).toBe(404);
        });
        test("if it valid request, it will return 200", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          const res = await exec(reviewId, token);
          expect(res.status).toBe(200);
        });
        test("if dislike was put on created review", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await exec(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);

          expect(dislikedReviewInDB.dislikes).toBeDefined();
        });
        test("if dislikesCount property has been increased by one", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await exec(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);

          expect(dislikedReviewInDB.dislikes.dislikesCount).toBe(1);
        });
        test("if current user has been added to dislikedUsers array", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);
          const decoded = decodeToken(token);

          await exec(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);
          const likedUserId =
            dislikedReviewInDB.dislikes.dislikedUsers[0]._id.toHexString();

          expect(likedUserId).toEqual(decoded._id);
        });
        test("if property dislikesDate was set in user object", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await exec(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);

          expect(
            dislikedReviewInDB.dislikes.dislikedUsers[0].dislikesDate
          ).toBeDefined();
        });
        test("if current user already have dislike so dislikesCount should be decreased by one", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await exec(reviewId, token);
          await exec(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);

          expect(dislikedReviewInDB.dislikes.dislikesCount).toBe(0);
        });
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
