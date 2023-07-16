const { User } = require("../../../models/user/user");
const app = require("../../../index");
const { omit } = require("lodash");
const decodeToken = require("../../../utils/decodeToken");
const getHexedObjectId = require("../../../utils/getHexedObjectId");
const getUserToken = require("../../utils/getUserToken");
const getAdminToken = require("../../utils/getAdminToken");
const { createNewUser, validUserData } = require("./utils/createNewUser");
const request = require("supertest")(app);

const route = "/api/users/";

describe(route, () => {
  afterEach(async () => {
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
      test("if user entered an incorrect password, it will return 404", async () => {
        await createNewUser();

        const res = await exec({ ...validLoginData, password: "54321" });

        expect(res.status).toBe(404);
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

    describe("/:userId/block", () => {
      const { token: adminToken, objectId: adminUserId } = getAdminToken();
      const blockingReason = { reason: "Test test" };

      const exec = (userId, blockingReason) =>
        request
          .post(route + userId + "/block")
          .send(blockingReason)
          .set("x-auth-token", adminToken);

      test("if user doesnt exist, it will return 404", async () => {
        const wrongId = getHexedObjectId();

        const res = await exec(wrongId, blockingReason);

        expect(res.status).toBe(404);
      });
      test("if blocking reason was not provided, it will return 400", async () => {
        const { token } = getUserToken();
        const { userId } = await createNewUser(token);

        const res = await exec(userId);

        expect(res.status).toBe(400);
      });
      test("if user succefully blocked, it will return 200", async () => {
        const { token } = getUserToken();
        const { userId } = await createNewUser(token);

        const res = await exec(userId, blockingReason);

        expect(res.status).toBe(200);
      });
      test('if user succefully blocked, it will set "Blocked" value to userStatus', async () => {
        const { token } = getUserToken();
        const { userId } = await createNewUser(token);

        await exec(userId, blockingReason);

        const blockedUserInDB = await User.findById(userId);

        expect(blockedUserInDB.userStatus.status).toEqual("Blocked");
      });
      test('if user succefully blocked, it will set "blockingInfo" propery', async () => {
        const { token } = getUserToken();
        const { userId } = await createNewUser(token);

        await exec(userId, blockingReason);

        const blockedUserInDB = await User.findById(userId);

        expect(blockedUserInDB.userStatus.blockingInfo).toMatchObject(
          blockingReason
        );
      });
      test('if "blockedBy" property equal to adminUser', async () => {
        const { token } = getUserToken();
        const { userId } = await createNewUser(token);

        await exec(userId, blockingReason);

        const blockedUserInDB = await User.findById(userId);

        expect(
          blockedUserInDB.userStatus.blockingInfo.blockedBy._id.toHexString()
        ).toEqual(adminUserId);
      });
    });
  });
});
