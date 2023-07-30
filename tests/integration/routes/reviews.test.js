const server = require("../../../index");
const request = require("supertest")(server);
const { Review } = require("../../../models/review/review");
const { createNewGame } = require("./utils/createNewGame");
const getAdminToken = require("../../utils/getAdminToken");
const { Genre } = require("../../../models/genre");
const { Developer } = require("../../../models/developer");
const getUserToken = require("../../utils/getUserToken");
const createNewReview = require("./utils/createNewReview");
const mongoose = require("mongoose");
const { omit } = require("lodash");
const decodeToken = require("../../../utils/decodeToken");
const getHexedObjectId = require("../../../utils/getHexedObjectId");
const { User } = require("../../../models/user/user");
const { createNewUser } = require("./utils/createNewUser");
const dbDisconnection = require("../../../setup/dbDisconnection");
const REVIEW_DOES_NOT_EXISTS = require("../../../utils/responseObjects/reviews/REVIEW_DOES_NOT_EXISTS");
const DONT_HAVE_PERMISSION_TO_CHANGE_REVIEW = require("../../../utils/responseObjects/reviews/DONT_HAVE_PERMISSION_TO_CHANGE_REVIEW");
const { Game } = require("../../../models/game/game");

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
    await User.deleteMany({});
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
    const exec = (newReview, gameId, existUserToken) =>
      request
        .post(route + gameId)
        .set("x-auth-token", existUserToken || token)
        .send(newReview);

    describe("/:gameId", () => {
      test("if game for provided gameId does not exists, it will return 404", async () => {
        const { validNewGameParams } = await getValidPOSTReqBody(token);
        const gameId = new mongoose.Types.ObjectId();
        const res = await exec(validNewGameParams, gameId);

        expect(res.status).toBe(404);
      });

      test("if valid request, it will return 201", async () => {
        const { validNewGameParams, gameId } = await getValidPOSTReqBody(token);
        const res = await exec(validNewGameParams, gameId);

        expect(res.status).toBe(201);
      });

      test("if document contain author property", async () => {
        const { validNewGameParams, gameId } = await getValidPOSTReqBody();
        const res = await exec(validNewGameParams, gameId);

        const decodedJWT = decodeToken(token);
        const userProps = omit(decodedJWT, ["iat", "role"]);

        expect(res.body.author).toEqual(userProps);
      });
      test("if valid request, this reviewer should get +1 review to reviewCount", async () => {
        const { userId } = await createNewUser();
        const { token: existUserToken } = getUserToken(userId);
        const { validNewGameParams, gameId } = await getValidPOSTReqBody();
        await exec(validNewGameParams, gameId, existUserToken);

        const reviewerInDb = await User.findById(userId);

        expect(reviewerInDb.reviewsCount).toEqual(1);
      });
      test("if valid request, this game should get +1 review to reviewCount", async () => {
        const { gameId } = await createNewGame();
        const { token } = getUserToken();

        const validNewGameParams = {
          text: "a".repeat(14),
          gameScore: 7,
        };

        await exec(validNewGameParams, gameId, token);

        const gameInDb = await Game.findById(gameId);

        expect(gameInDb.reviewsCount).toEqual(1);
      });
      test("if valid request, this game should get average score property", async () => {
        const { gameId } = await createNewGame();
        const { token } = getUserToken();

        const validNewGameParams = {
          text: "a".repeat(14),
          gameScore: 7,
        };

        await exec(validNewGameParams, gameId, token);

        const gameInDb = await Game.findById(gameId);

        expect(gameInDb.averageScore).toEqual(7);
      });

      test("if we create some reviews, this game should get +3 to reviewsCount", async () => {
        const { gameId } = await createNewGame();
        const { token } = getUserToken();

        const validNewGameParams = [
          {
            text: "a".repeat(14),
            gameScore: 7,
          },
          {
            text: "b".repeat(14),
            gameScore: 3,
          },
          {
            text: "c".repeat(14),
            gameScore: 3,
          },
        ];

        let i = 0;

        while (validNewGameParams.length > i) {
          await exec(validNewGameParams[i], gameId, token);
          i++;
        }

        const gameInDb = await Game.findById(gameId);

        expect(gameInDb.averageScore).toEqual(4.3);
      });
      test("if we create some reviews, it will calculate and set average score", async () => {
        const { gameId } = await createNewGame();
        const { token } = getUserToken();

        const validNewGameParams = [
          {
            text: "a".repeat(14),
            gameScore: 7,
          },
          {
            text: "b".repeat(14),
            gameScore: 3,
          },
          {
            text: "c".repeat(14),
            gameScore: 3,
          },
        ];

        let i = 0;

        while (validNewGameParams.length > i) {
          await exec(validNewGameParams[i], gameId, token);
          i++;
        }

        const gameInDb = await Game.findById(gameId);

        expect(gameInDb.reviewsCount).toEqual(3);
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

      test("if review for provided reviewId doesnt exists, it will return 404", async () => {
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
      test("if valid request, it will set updateDate", async () => {
        const { token } = getUserToken();
        const { reviewId } = await createNewReview(token);

        await exec(reviewId, changedReview, token);

        const updatedReviewInDB = await Review.findById(reviewId);

        expect(updatedReviewInDB.updateDate).toBeDefined();
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

      test("if review for provided reviewId doesnt exists, it will return 404", async () => {
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
      test("if review was deleted, it will -1 user reviewCount", async () => {
        const { userId } = await createNewUser();
        const { token: existUserToken } = getUserToken(userId);

        const { reviewId } = await createNewReview(token);

        await exec(reviewId, existUserToken);

        const reviewerInDb = await User.findById(userId);
        expect(reviewerInDb.reviewsCount).toEqual(0);
      });

      test("if review was deleted, it will -1 game reviewCount", async () => {
        const { gameId, newGame } = await createNewGame();
        const { token } = getUserToken();

        const { reviewId } = await createNewReview(token, newGame);

        await exec(reviewId, token);

        const gameInDb = await Game.findById(gameId);
        expect(gameInDb.reviewsCount).toEqual(0);
      });
      test("if valid request, this game average score property will be reset", async () => {
        const { gameId, newGame } = await createNewGame();
        const { token } = getUserToken();

        const { reviewId } = await createNewReview(token, newGame);

        await exec(reviewId, token);

        const gameInDb = await Game.findById(gameId);

        expect(gameInDb.averageScore).toEqual(0);
      });
    });
  });

  describe("checkIfProvidedUserWroteThisReview", () => {
    test("if review for provided id doesnt exists, it will return 403 status and message", async () => {
      const { token } = getUserToken();
      const wrongReviewId = getHexedObjectId();

      const decoded = decodeToken(token);

      const { resultBody } = await Review.checkIfProvidedUserWroteThisReview(
        wrongReviewId,
        decoded
      );
      expect(resultBody).toMatchObject(REVIEW_DOES_NOT_EXISTS);
    });

    test("if user dont has permission to change this review, it will return 404 status and message", async () => {
      const { token } = getUserToken();
      const { reviewId } = await createNewReview(token);
      const { token: anotherToken } = getUserToken();

      const decoded = decodeToken(anotherToken);

      const { resultBody } = await Review.checkIfProvidedUserWroteThisReview(
        reviewId,
        decoded
      );
      expect(resultBody).toMatchObject(DONT_HAVE_PERMISSION_TO_CHANGE_REVIEW);
    });

    test("if it valid request, it will return null", async () => {
      const { token } = getUserToken();
      const { reviewId } = await createNewReview(token);

      const decoded = decodeToken(token);

      const { resultBody } = await Review.checkIfProvidedUserWroteThisReview(
        reviewId,
        decoded
      );
      expect(resultBody).toBe(true);
    });
  });

  describe("POST ", () => {
    describe("/:reviewId", () => {
      const putLike = (reviewId, token) =>
        request.post(route + reviewId + "/like").set("x-auth-token", token);

      const putDislike = (reviewId, token) =>
        request.post(route + reviewId + "/dislike").set("x-auth-token", token);

      describe("/like", () => {
        test("if review for provided id doesnt exists, it will return 404", async () => {
          const { token } = getUserToken();
          const wrongReviewId = getHexedObjectId();

          const res = await putLike(wrongReviewId, token);
          expect(res.status).toBe(404);
        });
        test("if it valid request, it will return 200", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          const res = await putLike(reviewId, token);
          expect(res.status).toBe(200);
        });
        test("if like was put on created review", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putLike(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect(likedReviewInDB.likes).toBeDefined();
        });
        test("if likesCount property has been increased by one", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putLike(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect(likedReviewInDB.likes.likesCount).toBe(1);
        });
        test("if current user has been added to likedUsers array", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);
          const decoded = decodeToken(token);

          await putLike(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);
          const likedUserId =
            likedReviewInDB.likes.likedUsers[0]._id.toHexString();

          expect(likedUserId).toEqual(decoded._id);
        });
        test("if property likesDate was set in user object", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putLike(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect(likedReviewInDB.likes.likedUsers[0].likesDate).toBeDefined();
        });
        test("if current user already has like so likesCount should be decreased by one", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putLike(reviewId, token);
          await putLike(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect(likedReviewInDB.likes.likesCount).toBe(0);
        });
        test("if user already has dislike and tries to put like, it will remove dislike and put like", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putDislike(reviewId, token);
          await putLike(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect({
            likesCount: likedReviewInDB.likes.likesCount,
            dislikesCount: likedReviewInDB.dislikes.dislikesCount,
          }).toMatchObject({ likesCount: 1, dislikesCount: 0 });
        });
      });

      describe("/dislike", () => {
        test("if review for provided id doesnt exists, it will return 404", async () => {
          const { token } = getUserToken();
          const wrongReviewId = getHexedObjectId();

          const res = await putDislike(wrongReviewId, token);
          expect(res.status).toBe(404);
        });
        test("if it valid request, it will return 200", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          const res = await putDislike(reviewId, token);
          expect(res.status).toBe(200);
        });
        test("if dislike was put on created review", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putDislike(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);

          expect(dislikedReviewInDB.dislikes).toBeDefined();
        });
        test("if dislikesCount property has been increased by one", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putDislike(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);

          expect(dislikedReviewInDB.dislikes.dislikesCount).toBe(1);
        });
        test("if current user has been added to dislikedUsers array", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);
          const decoded = decodeToken(token);

          await putDislike(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);
          const likedUserId =
            dislikedReviewInDB.dislikes.dislikedUsers[0]._id.toHexString();

          expect(likedUserId).toEqual(decoded._id);
        });
        test("if property dislikesDate was set in user object", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putDislike(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);

          expect(
            dislikedReviewInDB.dislikes.dislikedUsers[0].dislikesDate
          ).toBeDefined();
        });
        test("if current user already has dislike so dislikesCount should be decreased by one", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putDislike(reviewId, token);
          await putDislike(reviewId, token);

          const dislikedReviewInDB = await Review.findById(reviewId);

          expect(dislikedReviewInDB.dislikes.dislikesCount).toBe(0);
        });
        test("if user already has like and tries to put dislike, it will remove like and put dislike", async () => {
          const { token } = getUserToken();
          const { reviewId } = await createNewReview(token);

          await putLike(reviewId, token);
          await putDislike(reviewId, token);

          const likedReviewInDB = await Review.findById(reviewId);

          expect({
            likesCount: likedReviewInDB.likes.likesCount,
            dislikesCount: likedReviewInDB.dislikes.dislikesCount,
          }).toMatchObject({ likesCount: 0, dislikesCount: 1 });
        });
      });
    });
  });
});

async function getValidPOSTReqBody() {
  const { gameId } = await createNewGame();

  const validNewGameParams = {
    text: "a".repeat(14),
    gameScore: 7,
  };

  return { validNewGameParams, gameId };
}
