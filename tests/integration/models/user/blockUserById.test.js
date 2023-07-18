const { User } = require("../../../../models/user/user");
const { createNewUser } = require("../../routes/utils/createNewUser");
const dbConnection = require("../../../../setup/dbConnection");
const logging = require("../../../../setup/logging");
const getAdminToken = require("../../../utils/getAdminToken");
const decodeToken = require("../../../../utils/decodeToken");
const getHexedObjectId = require("../../../../utils/getHexedObjectId");
const dbDisconnection = require("../../../../setup/dbDisconnection");

describe("User.blockUserById", () => {
  beforeAll(() => {
    logging();
    dbConnection();
  });
  afterAll(() => {
    dbDisconnection();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  const { token: adminToken } = getAdminToken();
  const decodedJWT = decodeToken(adminToken);

  test("if user doesnt exist, it will return 404", async () => {
    const userId = getHexedObjectId();

    const { resultBody } = await User.blockUserById({
      userId,
      currentUser: decodedJWT,
      reason: "Test test",
    });
    const { status } = resultBody;

    expect(status).toEqual(404);
  });
  test("if valid request, it will return 200", async () => {
    const { userId } = await createNewUser();

    const { isValidRequest } = await User.blockUserById({
      userId,
      currentUser: decodedJWT,
      reason: "Test test",
    });

    expect(isValidRequest).toBe(true);
  });
  test("if valid request, it will return user document", async () => {
    const { userId } = await createNewUser();

    const { resultBody } = await User.blockUserById({
      userId,
      currentUser: decodedJWT,
      reason: "Test test",
    });

    expect(resultBody).toBeDefined();
  });
});
