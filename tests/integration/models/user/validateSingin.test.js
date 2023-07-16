const { User } = require("../../../../models/user/user");
const {
  createNewUser,
  validUserData,
} = require("../../routes/utils/createNewUser");
const dbConnection = require("../../../../setup/dbConnection");
const logging = require("../../../../setup/logging");
const getAdminToken = require("../../../utils/getAdminToken");
const decodeToken = require("../../../../utils/decodeToken");

describe("User.validateSignin", () => {
  beforeAll(() => {
    logging();
    dbConnection();
  });
  afterAll(() => {
    dbConnection();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("if user with this email doesnt exist, it will return 404", async () => {
    const { resultBody } = await User.validateSignin(validUserData);
    const { status } = resultBody;

    expect(status).toEqual(404);
  });
  test("if user has been blocked, it will return 403", async () => {
    const { userId } = await createNewUser();

    const { token: adminToken } = getAdminToken();
    const decodedJWT = decodeToken(adminToken);

    await User.blockUserById({
      userId,
      currentUser: decodedJWT,
      reason: "Test test",
    });

    const { resultBody } = await User.validateSignin(validUserData);
    const { status } = resultBody;

    expect(status).toEqual(403);
  });
  test("if password is invalid, it will return 404", async () => {
    await createNewUser();

    const { resultBody } = await User.validateSignin({
      ...validUserData,
      password: "invalid",
    });
    const { status } = resultBody;

    expect(status).toEqual(404);
  });
  test("if valid request, it will return token", async () => {
    await createNewUser();

    const { resultBody } = await User.validateSignin(validUserData);
    const { name } = resultBody;

    expect(name).toEqual("newUser");
  });
  test("if valid request, it will return user name", async () => {
    await createNewUser();

    const { resultBody } = await User.validateSignin(validUserData);
    const { token } = resultBody;

    expect(token).toBeDefined();
  });
});
