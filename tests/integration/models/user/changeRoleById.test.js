const { User } = require("../../../../models/user/user");
const { createNewUser } = require("../../routes/utils/createNewUser");
const dbConnection = require("../../../../setup/dbConnection");
const logging = require("../../../../setup/logging");
const getHexedObjectId = require("../../../../utils/getHexedObjectId");
const dbDisconnection = require("../../../../setup/dbDisconnection");

describe("User.changeRoleById", () => {
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

  test("if user doesnt exist, it will return 404", async () => {
    const userId = getHexedObjectId();

    const { resultBody } = await User.changeRoleById({
      userId,
      newRole: "Admin",
    });
    const { status } = resultBody;

    expect(status).toEqual(404);
  });
  test("if valid request, it will return 200", async () => {
    const { userId } = await createNewUser();

    const { isValidRequest } = await User.changeRoleById({
      userId,
      newRole: "Moderator",
    });

    expect(isValidRequest).toBe(true);
  });
  test("if request promote to Moderator, it will set Moderator role", async () => {
    const { userId } = await createNewUser();

    const { resultBody } = await User.changeRoleById({
      userId,
      newRole: "Moderator",
    });

    expect(resultBody.role).toEqual("Moderator");
  });
  test("if request promote to Admin, it will set Admin role", async () => {
    const { userId } = await createNewUser();

    const { resultBody } = await User.changeRoleById({
      userId,
      newRole: "Admin",
    });

    expect(resultBody.role).toEqual("Admin");
  });
});
