const { User } = require("../../../models/user/user");
const server = require("../../../index");
const { omit, isEqual } = require("lodash");
const decodeToken = require("../../../utils/decodeToken");
const getHexedObjectId = require("../../../utils/getHexedObjectId");
const getUserToken = require("../../utils/getUserToken");
const getAdminToken = require("../../utils/getAdminToken");
const { createNewUser, validUserData } = require("./utils/createNewUser");
const request = require("supertest")(server);
const dbDisconnection = require("../../../setup/dbDisconnection");
const createTenUsers = require("./utils/createTenUsers");
const getArrayOfUsersIdsFromResponse = require("./utils/getArrayOfUsersIdsFromResponse");

const route = "/api/users/";

describe(route, () => {
  afterAll(() => {
    dbDisconnection();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /", () => {
    const singUpRoute = route + "singup";
    const exec = (userData) => request.post(singUpRoute).send(userData);

    describe("singup/", () => {
      test("if invalid data in request, it will return 400", async () => {
        const res = await exec({});

        expect(res.status).toBe(400);
      });

      test("if user already exist, it will return 400", async () => {
        await createNewUser();

        const res = await exec(validUserData);

        expect(res.status).toBe(400);
      });

      test("if valid request, it will return 200", async () => {
        const res = await exec(validUserData);

        expect(res.status).toBe(200);
      });

      test("if returned token is valid", async () => {
        const res = await exec(validUserData);
        const token = res.header["x-auth-token"];

        const decodedJWT = decodeToken(token);

        const userInDb = await User.findOne(omit(validUserData, ["password"]));

        expect(decodedJWT._id).toBe(userInDb._id.toHexString());
      });
    });

    describe("singin/", () => {
      const validLoginData = { email: "example@gmail.com", password: "1234" };

      const singInRoute = route + "singin";
      const exec = (userData) => request.post(singInRoute).send(userData);

      test("if user with entered email does not exist, it will return 404", async () => {
        const res = await exec({
          ...validLoginData,
          email: "wrongMail@gmail.com",
        });

        expect(res.status).toBe(404);
      });
      test("if user entered an incorrect password, it will return 401", async () => {
        await createNewUser();

        const res = await exec({ ...validLoginData, password: "54321" });

        expect(res.status).toBe(401);
      });

      test("if email and password valid, it will return 200", async () => {
        await createNewUser();

        const res = await exec(validLoginData);

        expect(res.status).toBe(200);
      });
      test("if returnrned jwt is valid", async () => {
        const { userId } = await createNewUser();

        const res = await exec(validLoginData);
        const token = res.header["x-auth-token"];

        const decodedJWT = decodeToken(token);

        expect(decodedJWT._id).toBe(userId);
      });
      test("if user has been blocked, and tries to singin, it will return 403", async () => {
        const { userId } = await createNewUser();

        const { token: adminToken } = getAdminToken();
        const decodedJWT = decodeToken(adminToken);

        await User.blockUserById({
          userId,
          currentUser: decodedJWT,
          reason: "Test test",
        });

        const res = await exec(validLoginData);

        expect(res.status).toBe(403);
      });
    });
  });

  describe("PUT", () => {
    describe("/:userId/block", () => {
      const { token: adminToken, objectId: adminUserId } = getAdminToken();
      const blockingReason = { reason: "Test test" };

      const exec = (userId, blockingReason) =>
        request
          .put(route + userId + "/block")
          .send(blockingReason)
          .set("x-auth-token", adminToken);

      test("if user doesnt exist, it will return 404", async () => {
        const wrongId = getHexedObjectId();

        const res = await exec(wrongId, blockingReason);

        expect(res.status).toBe(404);
      });
      test("if blocking reason was not provided, it will return 400", async () => {
        const { userId } = await createNewUser();

        const res = await exec(userId);

        expect(res.status).toBe(400);
      });
      test("if user succefully blocked, it will return 200", async () => {
        const { userId } = await createNewUser();

        const res = await exec(userId, blockingReason);

        expect(res.status).toBe(200);
      });
      test('if user succefully blocked, it will set "Blocked" value to userStatus', async () => {
        const { userId } = await createNewUser();

        await exec(userId, blockingReason);

        const blockedUserInDB = await User.findById(userId);

        expect(blockedUserInDB.userStatus.status).toEqual("Blocked");
      });
      test('if user succefully blocked, it will set "blockingInfo" propery', async () => {
        const { userId } = await createNewUser();

        await exec(userId, blockingReason);

        const blockedUserInDB = await User.findById(userId);

        expect(blockedUserInDB.userStatus.blockingInfo).toMatchObject(
          blockingReason
        );
      });
      test('if "blockedBy" property equal to adminUser', async () => {
        const { userId } = await createNewUser();

        await exec(userId, blockingReason);

        const blockedUserInDB = await User.findById(userId);

        expect(
          blockedUserInDB.userStatus.blockingInfo.blockedBy._id.toHexString()
        ).toEqual(adminUserId);
      });
    });

    describe("/:objectId/changeRole", () => {
      const { token: adminToken } = getAdminToken();

      const exec = (userId, role) =>
        request
          .put(route + userId + "/changeRole" + "?role=" + role)
          .set("x-auth-token", adminToken);

      test("if user for probided usedId doenst exist,it will return 404", async () => {
        const userId = getHexedObjectId();

        const res = await exec(userId, "Moderator");

        expect(res.status).toEqual(404);
      });
      test("if valid request, it will return 200", async () => {
        const { userId } = await createNewUser();

        const res = await exec(userId, "Moderator");

        expect(res.status).toEqual(200);
      });
      test("if user role has been changed", async () => {
        const { userId } = await createNewUser();

        await exec(userId, "Moderator");

        const userInDB = await User.findById(userId);

        expect(userInDB.role).toEqual("Moderator");
      });
    });
  });

  describe("GET", () => {
    describe("/:userId", () => {
      const exec = (userId) => request.get(route + userId);

      test("if user doesnt exist, it will return 404", async () => {
        const userId = getHexedObjectId();

        const res = await exec(userId);

        expect(res.status).toEqual(404);
      });
      test("if valid request, it will return 200", async () => {
        const { userId } = await createNewUser();

        const res = await exec(userId);

        expect(res.status).toEqual(200);
      });
      test("if valid request, it will return user information", async () => {
        const { userId } = await createNewUser();

        const res = await exec(userId);

        expect(res.body._id).toEqual(userId);
      });
      test("if it wont return user password property", async () => {
        const { userId } = await createNewUser();

        const res = await exec(userId);

        expect(res.body.password).toBeUndefined();
      });
    });

    describe("/", () => {
      const { token: userToken } = getUserToken();

      const exec = () => request.get(`${route}`).set("x-auth-token", userToken);

      test("if valid request, it wil return 200", async () => {
        await createTenUsers();

        const res = await exec();

        expect(res.status).toEqual(200);
      });
      test("if returned array contains 9 users", async () => {
        const users = await createTenUsers();

        const res = await exec();

        const createdUsersIds = users
          .filter((user) => user.userStatus.status === "Active")
          .map((user) => user._id.toHexString());

        const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

        expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
      });

      describe("?sortBy=name&limit=3&role=User", () => {
        const exec = () =>
          request
            .get(`${route}?sortBy=name&limit=3&role=User`)
            .set("x-auth-token", userToken);

        test("if valid request, it wil return 200", async () => {
          await createTenUsers();

          const res = await exec();

          expect(res.status).toEqual(200);
        });
        test("if returned array has only users with role 'User' and status 'Active' and limited to 3", async () => {
          const users = await createTenUsers();

          const res = await exec();

          const createdUsersIds = users
            .filter(
              (user) =>
                user.role === "User" && user.userStatus.status === "Active"
            )
            .sort()
            .map((user) => user._id.toHexString());

          createdUsersIds.length = 3;

          const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

          expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
        });
      });

      describe("?sortBy=", () => {
        const exec = (sort) =>
          request.get(`${route}?sortBy=${sort}`).set("x-auth-token", userToken);

        test("name, it will return users in alphabetical order", async () => {
          const users = await createTenUsers();

          const res = await exec("name");

          const createdUsersIds = users
            .sort()
            .filter((user) => user.userStatus.status === "Active")
            .map((user) => user._id.toHexString());

          const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

          expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
        });
        test("role, it will return users in order from admin to user", async () => {
          const users = await createTenUsers();

          const res = await exec("role");

          const createdUsersIds = users
            .filter((user) => user.userStatus.status === "Active")
            .sort((a, b) => a.role.localeCompare(b.role))
            .map((user) => user._id.toHexString());

          const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

          expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
        });
        test("reviewsCount, it will return from user with most reviewsCount to lowest ", async () => {
          const users = await createTenUsers();

          const res = await exec("reviewsCount");

          const createdUsersIds = users
            .filter((user) => user.userStatus.status === "Active")
            .sort((a, b) => b.reviewsCount - a.reviewsCount)
            .map((user) => user._id.toHexString());

          const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

          expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
        });
      });
      describe("?limit=", () => {
        const exec = (limit) =>
          request.get(`${route}?limit=${limit}`).set("x-auth-token", userToken);

        test("2, it will return two users", async () => {
          await createTenUsers();

          const res = await exec(2);

          expect(res.body).toHaveLength(2);
        });
        test("9, it will return 8 users", async () => {
          await createTenUsers();

          const res = await exec(8);

          expect(res.body).toHaveLength(8);
        });
      });
      describe("?role=", () => {
        const exec = (role) =>
          request.get(`${route}?role=${role}`).set("x-auth-token", userToken);

        test("admins, it will display only admins", async () => {
          const users = await createTenUsers();

          const res = await exec("Admin");

          const createdUsersIds = users
            .filter(
              (user) =>
                user.role === "Admin" && user.userStatus.status === "Active"
            )
            .map((user) => user._id.toHexString());

          const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

          expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
        });
        test("reviewers, it will display only users with reviewer status", async () => {
          const users = await createTenUsers();

          const res = await exec("Reviewer");

          const createdUsersIds = users
            .filter(
              (user) => user.isReviewer && user.userStatus.status === "Active"
            )
            .map((user) => user._id.toHexString());

          const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

          expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
        });
        test("moderators, it will display only moderators", async () => {
          const users = await createTenUsers();

          const res = await exec("Moderator");

          const createdUsersIds = users
            .filter(
              (user) =>
                user.role === "Moderator" && user.userStatus.status === "Active"
            )
            .map((user) => user._id.toHexString());
          const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

          expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
        });
        test("users, it will display only users", async () => {
          const users = await createTenUsers();

          const res = await exec("User");

          const createdUsersIds = users
            .filter(
              (user) =>
                user.role === "User" && user.userStatus.status === "Active"
            )
            .map((user) => user._id.toHexString());

          const responseUsersIds = getArrayOfUsersIdsFromResponse(res);

          expect(isEqual(responseUsersIds, createdUsersIds)).toEqual(true);
        });
      });
    });
  });
});
